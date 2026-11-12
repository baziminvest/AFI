import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/afi/domain";
import { AuthView } from "@/components/afi/auth-view";
export const Route = createFileRoute("/auth")({
  head: () => pageHead("Sign in"),
  component: AuthView,
});
