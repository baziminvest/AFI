import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/afi/domain";
import { MT5Integration } from "@/components/afi/research-views";
export const Route = createFileRoute("/mt5-integration")({
  head: () => pageHead("MT5 Integration"),
  component: MT5Integration,
});
