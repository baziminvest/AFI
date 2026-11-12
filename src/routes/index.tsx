import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/afi/domain";
import { Overview } from "@/components/afi/overview";
export const Route = createFileRoute("/")({
  head: () => pageHead("Overview"),
  component: Overview,
});
