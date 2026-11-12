import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/afi/domain";
import { Signals } from "@/components/afi/research-views";
export const Route = createFileRoute("/signals")({
  head: () => pageHead("Signals"),
  component: Signals,
});
