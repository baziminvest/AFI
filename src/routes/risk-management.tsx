import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/afi/domain";
import { RiskManagement } from "@/components/afi/research-views";
export const Route = createFileRoute("/risk-management")({
  head: () => pageHead("Risk Management"),
  component: RiskManagement,
});
