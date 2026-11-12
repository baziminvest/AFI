import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/afi/domain";
import { Backtesting } from "@/components/afi/research-views";
export const Route = createFileRoute("/backtesting")({
  head: () => pageHead("Backtesting"),
  component: Backtesting,
});
