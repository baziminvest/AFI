import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/afi/domain";
import { LearningLab } from "@/components/afi/research-views";
export const Route = createFileRoute("/learning-lab")({
  head: () => pageHead("Learning Lab"),
  component: LearningLab,
});
