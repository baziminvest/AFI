import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/afi/domain";
import { Strategies } from "@/components/afi/research-views";
export const Route = createFileRoute("/strategies")({
  head: () => pageHead("Strategies"),
  component: Strategies,
});
