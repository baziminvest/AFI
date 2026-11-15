import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/afi/domain";
import { Overview } from "@/components/afi/overview";
export const Route = createFileRoute("/overview")({ head: () => pageHead("Research overview"), component: Overview });