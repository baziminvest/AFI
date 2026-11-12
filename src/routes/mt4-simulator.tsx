import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/afi/domain";
import { MT4Simulator } from "@/components/afi/research-views";
export const Route = createFileRoute("/mt4-simulator")({
  head: () => pageHead("MT4 Simulator"),
  component: MT4Simulator,
});
