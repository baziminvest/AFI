<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.

<!-- LOVABLE:END -->

## AFI architecture

- Keep leaf route metadata and page entry points in TanStack routes; shared terminal views live under src/components/afi to preserve consistent navigation.
- Historical imports use one security-invoker database RPC so metadata and bars commit atomically under owner-scoped RLS.
- Feature generation and learning run only in the independent Python service because browser and Worker processes cannot host persistent Python workloads.
- Forward authenticated bearer requests only to the configured learning service; both services validate authorization without client-controlled roles.
- Python candidate artifacts use single-instance durable SQLite until a shared PostgreSQL adapter exists; require a persistent volume to avoid data loss.
- MetaTrader integrations stay read-only and separately sourced; expose no order-placement functions.
- Keep the public introduction at / and the research terminal at /overview; this separates visitor onboarding from the dense workspace without removing existing tools.
- Store editable identity in owner-only profiles and maintain one workspace auth listener; authorization roles never belong in editable profile fields.
