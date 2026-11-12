import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { getRequestHeader } from "@tanstack/react-start/server";
export const serviceHealth = createServerFn({ method: "GET" }).handler(async () => {
  const url = process.env["AFI_ML_SERVICE_URL"];
  if (!url) return { status: "not_configured", message: "Not connected" };
  try {
    const response = await fetch(`${url.replace(/\/$/, "")}/health`, {
      signal: AbortSignal.timeout(5000),
    });
    return {
      status: response.ok ? "connected" : "unavailable",
      message: response.ok ? "Connected" : "Unavailable",
    };
  } catch {
    return { status: "unavailable", message: "Unavailable" };
  }
});
export const trainModel = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({ datasetId: z.string().uuid(), modelType: z.enum(["random_forest", "xgboost"]) }),
  )
  .handler(async ({ data, context }) => {
    const { data: allowed } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!allowed) return { ok: false, message: "An administrator must authorize model training." };
    const url = process.env["AFI_ML_SERVICE_URL"];
    const authorization = getRequestHeader("Authorization");
    if (!url || !authorization)
      return { ok: false, message: "Connect the independent Python service before training." };
    const { data: dataset } = await context.supabase
      .from("dataset_versions")
      .select("id")
      .eq("id", data.datasetId)
      .eq("user_id", context.userId)
      .maybeSingle();
    if (!dataset) return { ok: false, message: "Dataset not found." };
    try {
      const response = await fetch(`${url.replace(/\/$/, "")}/api/v1/learning/train`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: authorization },
        body: JSON.stringify({ dataset_id: data.datasetId, model_type: data.modelType }),
        signal: AbortSignal.timeout(25000),
      });
      return {
        ok: response.ok,
        message: response.ok
          ? "Training completed. Candidate requires validation before promotion."
          : "Training could not complete. Check service logs.",
      };
    } catch {
      return { ok: false, message: "The learning service is unavailable." };
    }
  });
