import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { serviceHealth } from "@/lib/afi/service.functions";
import type { Bar } from "@/lib/afi/domain";
const WorkspaceContext = createContext<ReturnType<typeof useWorkspaceState> | null>(null);
function useWorkspaceState() {
  const [user, setUser] = useState<User | null>(null);
  const [symbol, setSymbol] = useState("EURUSD");
  const [timeframe, setTimeframe] = useState("H1");
  const [style, setStyle] = useState("All styles");
  const cache = useQueryClient();
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (["INITIAL_SESSION", "SIGNED_IN", "SIGNED_OUT", "USER_UPDATED"].includes(event)) {
        setUser(session?.user ?? null);
        cache.removeQueries({ queryKey: ["afi-private"] });
      }
    });
    return () => data.subscription.unsubscribe();
  }, [cache]);
  const datasets = useQuery({
    queryKey: ["afi-private", "datasets", user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const result = await supabase
        .from("dataset_versions")
        .select("*")
        .order("created_at", { ascending: false });
      if (result.error) throw result.error;
      return result.data;
    },
  });
  const latestDataset = datasets.data?.find(
    (d) => d.symbol === symbol && d.timeframe === timeframe,
  );
  const bars = useQuery({
    queryKey: ["afi-private", "bars", latestDataset?.id],
    enabled: Boolean(latestDataset),
    queryFn: async () => {
      if (!latestDataset) return [];
      const result = await supabase
        .from("market_bars")
        .select("timestamp,open,high,low,close,volume")
        .eq("dataset_id", latestDataset.id)
        .order("timestamp", { ascending: false })
        .limit(500);
      if (result.error) throw result.error;
      return result.data.reverse() as Bar[];
    },
  });
  const health = useQuery({
    queryKey: ["service-health"],
    queryFn: () => serviceHealth(),
    refetchInterval: 60000,
  });
  const connection = useQuery({
    queryKey: ["cloud-health"],
    queryFn: async () => {
      const result = await supabase.from("instruments").select("id").limit(1);
      return !result.error;
    },
    refetchInterval: 60000,
  });
  return {
    user,
    symbol,
    setSymbol,
    timeframe,
    setTimeframe,
    style,
    setStyle,
    datasets,
    bars,
    health,
    connection,
    cache,
  };
}
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const state = useWorkspaceState();
  return <WorkspaceContext.Provider value={state}>{children}</WorkspaceContext.Provider>;
}
export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error("Workspace provider is required");
  return context;
}
