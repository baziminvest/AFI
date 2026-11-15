import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/afi/domain";
import { AccountView } from "@/components/afi/account-view";
export const Route = createFileRoute("/account")({ head: () => pageHead("Your account"), component: AccountView });