import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Save, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { riskProfile, riskProfiles, suitableRiskLevel } from "@/lib/afi/portfolio";
import { useWorkspace } from "./workspace";
import { PageTitle } from "./shell";

const blank = { initial_capital: 1000, base_currency: "USD", objective: "balanced", horizon_years: 5, risk_tolerance: 3, risk_capacity: 3, liquidity_need: "medium", income_required: false, experience: "some", restrictions: "" };
const pct = (n: number) => `${Math.round(n * 100)}%`;

export function PortfolioView() {
  const { user, cache } = useWorkspace();
  const [form, setForm] = useState(blank);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const data = useQuery({
    queryKey: ["afi-private", "portfolio", user?.id], enabled: Boolean(user),
    queryFn: async () => {
      const [p, f] = await Promise.all([
        supabase.from("investor_profiles").select("*").maybeSingle(),
        supabase.from("paper_portfolios").select("*").order("created_at").limit(1).maybeSingle(),
      ]);
      if (p.error) throw p.error; if (f.error) throw f.error;
      return { profile: p.data, portfolio: f.data };
    },
  });
  useEffect(() => { if (data.data?.profile) setForm({ ...blank, ...data.data.profile }); }, [data.data?.profile]);
  const level = suitableRiskLevel(form.risk_tolerance, form.risk_capacity, form.horizon_years, form.liquidity_need);
  const limits = riskProfile(level);
  const portfolio = data.data?.portfolio;
  const set = (k: keyof typeof blank, v: string | number | boolean) => setForm({ ...form, [k]: v });

  async function save(e: React.FormEvent) {
    e.preventDefault(); if (!user) return; setBusy(true); setMessage("");
    try {
      const { error } = await supabase.from("investor_profiles").upsert({ ...form, user_id: user.id, updated_at: new Date().toISOString() });
      if (error) throw error;
      if (!portfolio) {
        const r = await supabase.from("paper_portfolios").insert({ user_id: user.id, base_currency: form.base_currency, starting_cash: 1000, cash_balance: 1000, risk_profile: level });
        if (r.error) throw r.error;
      } else if (!portfolio.simulation_started) {
        const r = await supabase.from("paper_portfolios").update({ base_currency: form.base_currency, risk_profile: level }).eq("id", portfolio.id);
        if (r.error) throw r.error;
      }
      await cache.invalidateQueries({ queryKey: ["afi-private", "portfolio", user.id] });
      setMessage("Investor profile saved.");
    } catch (err) { setMessage(err instanceof Error ? err.message : "Could not save."); }
    finally { setBusy(false); }
  }

  if (!user) return <><PageTitle title="Portfolio" subtitle="Simulated capital only. No real orders."/>
    <div className="workspace-empty"><Wallet/><h2>Sign in to build your investor profile</h2><Button asChild className="mt-6"><Link to="/auth">Sign in</Link></Button></div></>;

  return <><PageTitle title="Portfolio" subtitle="Investor profile and the AFI paper portfolio. Simulated capital only."/>
    <div className="portfolio-grid">
      <form className="panel portfolio-form" onSubmit={save}>
        <h2 className="panel-title">Investor profile</h2>
        <div className="form-row">
          <div className="form-field"><label htmlFor="cap">Capital you plan to invest</label><input id="cap" type="number" min={1} value={form.initial_capital} onChange={e => set("initial_capital", Number(e.target.value))}/></div>
          <div className="form-field"><label htmlFor="ccy">Base currency</label><select id="ccy" disabled={portfolio?.simulation_started} value={form.base_currency} onChange={e => set("base_currency", e.target.value)}>{["USD","EUR","GBP","KES","JPY","CHF","SGD"].map(c => <option key={c}>{c}</option>)}</select></div>
        </div>
        <div className="form-row">
          <div className="form-field"><label htmlFor="obj">Objective</label><select id="obj" value={form.objective} onChange={e => set("objective", e.target.value)}><option value="preservation">Preserve capital</option><option value="income">Income</option><option value="balanced">Balanced</option><option value="growth">Growth</option></select></div>
          <div className="form-field"><label htmlFor="hz">Horizon (years)</label><input id="hz" type="number" min={1} max={50} value={form.horizon_years} onChange={e => set("horizon_years", Number(e.target.value))}/></div>
        </div>
        <div className="form-row">
          <div className="form-field"><label htmlFor="tol">Risk you are willing to take</label><select id="tol" value={form.risk_tolerance} onChange={e => set("risk_tolerance", Number(e.target.value))}>{riskProfiles.map(r => <option key={r.level} value={r.level}>{r.name}</option>)}</select></div>
          <div className="form-field"><label htmlFor="capy">Risk you can afford to take</label><select id="capy" value={form.risk_capacity} onChange={e => set("risk_capacity", Number(e.target.value))}>{riskProfiles.map(r => <option key={r.level} value={r.level}>{r.name}</option>)}</select></div>
        </div>
        <div className="form-row">
          <div className="form-field"><label htmlFor="liq">Need for quick access to cash</label><select id="liq" value={form.liquidity_need} onChange={e => set("liquidity_need", e.target.value)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
          <div className="form-field"><label htmlFor="exp">Experience</label><select id="exp" value={form.experience} onChange={e => set("experience", e.target.value)}><option value="none">None</option><option value="some">Some</option><option value="experienced">Experienced</option><option value="professional">Professional</option></select></div>
        </div>
        <div className="form-field"><label htmlFor="res">Restrictions (sectors, countries, ethical)</label><input id="res" maxLength={400} value={form.restrictions} onChange={e => set("restrictions", e.target.value)} placeholder="e.g. no tobacco, no crypto"/></div>
        <label className="check"><input type="checkbox" checked={form.income_required} onChange={e => set("income_required", e.target.checked)}/> I need regular income from this portfolio</label>
        <Button disabled={busy} type="submit"><Save size={15}/>{busy ? "Saving…" : portfolio ? "Save profile" : "Save and open paper portfolio"}</Button>
        <p role="status" className="mini-sub">{message}</p>
      </form>
      <div className="portfolio-side">
        <section className="panel"><h2 className="panel-title">Suitable risk profile</h2>
          <p className="metric-value">{limits.name}</p>
          <p className="mini-sub">Your willingness to take risk is capped by what you can afford, your horizon and cash needs.</p>
          <dl className="limit-list">
            <div><dt>Max single position</dt><dd>{pct(limits.maxPosition)}</dd></div>
            <div><dt>Max equity exposure</dt><dd>{pct(limits.maxEquity)}</dd></div>
            <div><dt>Minimum cash</dt><dd>{pct(limits.minCash)}</dd></div>
            <div><dt>Max volatility</dt><dd>{pct(limits.maxVolatility)}</dd></div>
            <div><dt>Max drawdown</dt><dd>{pct(limits.maxDrawdown)}</dd></div>
            <div><dt>Crypto allowed</dt><dd>{limits.crypto ? "Yes" : "No"}</dd></div>
          </dl>
        </section>
        <section className="panel"><h2 className="panel-title">AFI paper portfolio</h2>
          {!portfolio ? <p className="mini-sub">Save your profile to open a simulated portfolio with 1,000 starting cash.</p> : <dl className="limit-list">
            <div><dt>Net asset value</dt><dd>{Number(portfolio.cash_balance).toLocaleString()} {portfolio.base_currency}</dd></div>
            <div><dt>Cash</dt><dd>{Number(portfolio.cash_balance).toLocaleString()} {portfolio.base_currency}</dd></div>
            <div><dt>Open positions</dt><dd>0</dd></div>
            <div><dt>Status</dt><dd>{portfolio.simulation_started ? "Running" : "Not started"}</dd></div>
          </dl>}
          <p className="mini-sub">Trading starts once real market prices are connected. No returns are simulated before then.</p>
        </section>
      </div>
    </div>
  </>;
}
