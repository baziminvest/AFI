import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/afi/domain";
import { PortfolioView } from "@/components/afi/portfolio-view";
export const Route = createFileRoute("/portfolio")({ head: () => pageHead("Portfolio"), component: PortfolioView });
