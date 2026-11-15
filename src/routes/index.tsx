import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/afi/domain";
import { FrontPage } from "@/components/afi/front-page";
export const Route = createFileRoute("/")({
  head: () => pageHead("Adaptive Financial Intelligence"),
  component: FrontPage,
});
