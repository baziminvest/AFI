import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/afi/domain";
import { Markets } from "@/components/afi/research-views";
export const Route = createFileRoute("/markets")({
  head: () => pageHead("Markets"),
  component: Markets,
});
