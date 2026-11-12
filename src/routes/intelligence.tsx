import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/afi/domain";
import { Intelligence } from "@/components/afi/research-views";
export const Route = createFileRoute("/intelligence")({
  head: () => pageHead("Intelligence"),
  component: Intelligence,
});
