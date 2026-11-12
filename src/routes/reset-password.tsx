import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/afi/domain";
import { ResetPasswordView } from "@/components/afi/auth-view";
export const Route = createFileRoute("/reset-password")({
  head: () => pageHead("Reset password"),
  component: ResetPasswordView,
});
