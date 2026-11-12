import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/afi/domain";
import { Settings } from "@/components/afi/research-views";
export const Route = createFileRoute("/settings")({
  head: () => pageHead("Settings"),
  component: Settings,
});
