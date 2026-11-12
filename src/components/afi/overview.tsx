import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  ChartNoAxesCombined,
  ChevronDown,
  Database,
  FlaskConical,
  History,
  Radio,
  RefreshCw,
  Server,
  ShieldCheck,
  Sparkles,
  Upload,
  Clock3,
  CircleDashed,
  CandlestickChart,
  Gem,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { instruments, timeframes } from "@/lib/afi/domain";
import { useWorkspace } from "./workspace";
import { PageTitle, ConnectionStrip } from "./shell";
import type { ReactNode } from "react";
export function Panel({
  title,
  icon,
  action,
  children,
  className = "",
}: {
  title: string;
  icon?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel-header">
        <h2 className="panel-title">
          {icon}
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}
export function Empty({
  icon = <Database />,
  title,
  subtitle,
  action,
}: {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="workspace-empty">
      <div className="empty-icon">{icon}</div>
      <div className="empty-title">{title}</div>
      {subtitle && <p className="empty-sub">{subtitle}</p>}
      {action}
    </div>
  );
}
export function Flags({ flag, quote }: { flag: string; quote: string }) {
  return (
    <div className="flag-pair" aria-hidden="true">
      <span className={`flag ${flag}`}>
        {flag === "eu" ? "✦" : flag === "gold" ? <Gem size={14} /> : ""}
      </span>
      <span className={`flag ${quote}`} />
    </div>
  );
}
export function InstrumentCards() {
  const { setSymbol, timeframe } = useWorkspace();
  return (
    <div className="instrument-grid">
      {instruments.map((i) => (
        <Link
          to="/markets"
          onClick={() => setSymbol(i.symbol)}
          key={i.symbol}
          className={`instrument-card ${i.symbol === "XAUUSD" ? "is-gold" : ""}`}
        >
          <div className="instrument-top">
            <Flags flag={i.flag} quote={i.quote} />
            <div>
              <div className={`instrument-symbol ${i.symbol === "XAUUSD" ? "text-gold" : ""}`}>
                {i.label}
              </div>
              <div className="instrument-name">{i.name}</div>
            </div>
            <span className="instrument-category">{i.category}</span>
          </div>
          <div className="price-placeholder">
            — <span className="text-[11px]">—</span>
          </div>
          <div className="awaiting">
            <Clock3 size={10} />
            Awaiting market data
          </div>
          <div className="instrument-bottom">
            <span className="badge">NO DATA</span>
            <span>
              {timeframe} <span className="mx-1">·</span> Regime —
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
export function MarketChart() {
  const { symbol, setSymbol, timeframe, setTimeframe, bars, datasets } = useWorkspace();
  const latestDataset = datasets.data?.find(
    (d) => d.symbol === symbol && d.timeframe === timeframe,
  );
  const data = bars.data ?? [];
  const low = Math.min(...data.map((b) => b.low));
  const high = Math.max(...data.map((b) => b.high));
  const range = high - low || 1;
  const y = (price: number) => 230 - ((price - low) / range) * 210;
  return (
    <Panel
      title="Market overview"
      icon={<ChartNoAxesCombined />}
      action={<span className="badge">{data.length ? "HISTORICAL DATA" : "NO LIVE FEED"}</span>}
    >
      <div className="chart-toolbar">
        <div className="chart-instrument">
          <select
            aria-label="Chart instrument"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          >
            {instruments.map((i) => (
              <option key={i.symbol} value={i.symbol}>
                {i.label}
              </option>
            ))}
          </select>
          <span className="text-muted-foreground text-[9px]">{timeframe}</span>
        </div>
        <div className="timeframe-group">
          {timeframes.map((t) => (
            <Button
              key={t}
              size="sm"
              variant={timeframe === t ? "secondary" : "ghost"}
              onClick={() => setTimeframe(t)}
              className={timeframe === t ? "text-primary" : ""}
            >
              {t}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            title="Refresh historical bars"
            aria-label="Refresh historical bars"
            onClick={() => bars.refetch()}
          >
            <RefreshCw size={12} />
          </Button>
        </div>
      </div>
      <div className="chart-area">
        {data.length ? (
          <svg
            viewBox="0 0 800 255"
            preserveAspectRatio="none"
            className="history-chart"
            aria-label={`${symbol} historical candlestick chart`}
            role="img"
          >
            {data.slice(-100).map((b, n, arr) => {
              const x = 15 + (n * 730) / arr.length;
              return (
                <g
                  key={b.timestamp}
                  className={b.close >= b.open ? "text-bullish" : "text-bearish"}
                >
                  <line
                    x1={x}
                    x2={x}
                    y1={y(b.high)}
                    y2={y(b.low)}
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                  <rect
                    x={x - 2}
                    y={Math.min(y(b.open), y(b.close))}
                    width="4"
                    height={Math.max(1, Math.abs(y(b.open) - y(b.close)))}
                    fill="currentColor"
                  />
                </g>
              );
            })}
            <text x="746" y="20" className="fill-muted-foreground" fontSize="10">
              {high.toFixed(symbol === "USDJPY" || symbol === "XAUUSD" ? 2 : 5)}
            </text>
            <text x="746" y="232" className="fill-muted-foreground" fontSize="10">
              {low.toFixed(symbol === "USDJPY" || symbol === "XAUUSD" ? 2 : 5)}
            </text>
          </svg>
        ) : (
          <div className="chart-empty">
            <div className="empty-icon">
              <CandlestickChart />
            </div>
            <div className="empty-title">Your market intelligence starts with data</div>
            <div className="empty-sub">
              No market data available for {symbol} · {timeframe}
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/learning-lab">
                <Upload /> Import historical data <ArrowRight />
              </Link>
            </Button>
          </div>
        )}
      </div>
      <div className="chart-footer">
        <span>
          <i className="status-dot mr-1" />
          {data.length
            ? `${data.length} historical bars · ${latestDataset?.filename}`
            : "Awaiting data connection"}
        </span>
        <span>
          {data.length
            ? `${data.at(-1)?.timestamp.slice(0, 16).replace("T", " ")} UTC`
            : "Last update: —"}
        </span>
      </div>
    </Panel>
  );
}
export function Overview() {
  const { cache, health, connection } = useWorkspace();
  return (
    <>
      <PageTitle title="Overview" subtitle="Your market intelligence, in one place.">
        <Button variant="outline" size="sm" onClick={() => cache.invalidateQueries()}>
          <RefreshCw />
          Refresh
        </Button>
        <Button size="sm" asChild>
          <Link to="/learning-lab">
            <Upload />
            Import data
          </Link>
        </Button>
      </PageTitle>
      <ConnectionStrip />
      <div className="section-heading">
        <h2>
          Instrument watchlist{" "}
          <span className="text-muted-foreground text-[10px] font-normal">4 instruments</span>
        </h2>
        <Link className="section-link" to="/markets">
          All markets <ArrowRight size={12} />
        </Link>
      </div>
      <InstrumentCards />
      <div className="research-grid">
        <MarketChart />
        <Panel
          title="Intelligence snapshot"
          icon={<BrainCircuit />}
          action={<Sparkles size={13} className="text-primary" />}
        >
          <div className="intelligence-stats">
            {[
              ["Market regime", "Unclassified"],
              ["Directional bias", "Awaiting analysis"],
              ["Strategy assessment", "No assessment"],
              ["Model confidence", "—"],
              ["Last prediction", "—"],
            ].map(([name, value]) => (
              <div className="stat-row" key={name}>
                <span>{name}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
          <div className="regime-empty">
            <ShieldCheck />
            <div>
              <div className="mini-heading">Patience is part of the process.</div>
              <div className="mini-sub">
                No directional signal without
                <br />
                validated market evidence.
              </div>
            </div>
          </div>
          <div className="panel-footer">
            <Link to="/intelligence" className="section-link">
              Explore intelligence <ArrowRight size={12} />
            </Link>
          </div>
        </Panel>
      </div>
      <div className="lower-grid">
        <Panel
          title="Signal activity"
          icon={<Radio />}
          action={<span className="badge">0 CONFIRMED</span>}
        >
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  {["Instrument", "Decision", "Confidence", "Timeframe", "Generated"].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
            </table>
          </div>
          <div className="table-empty">
            <Radio />
            <div className="empty-title">No confirmed signals yet</div>
            <div className="mini-sub">
              Signals appear when a validated model finds sufficient evidence.
            </div>
          </div>
          <div className="panel-footer">
            <span>WAIT is a valid decision.</span>
            <Link className="section-link" to="/signals">
              View all signals <ArrowRight size={11} />
            </Link>
          </div>
        </Panel>
        <Panel
          title="Model performance"
          icon={<Activity />}
          action={<span className="badge">OUT-OF-SAMPLE</span>}
        >
          <div className="performance-body">
            <div className="performance-metrics">
              {["Balanced accuracy", "Evaluated predictions", "Brier score"].map((label) => (
                <div key={label}>
                  <div className="metric-label">{label}</div>
                  <div className="metric-value">—</div>
                </div>
              ))}
            </div>
            <div className="performance-empty">
              <CircleDashed size={12} className="inline mr-2" />
              Not enough evaluated predictions.
              <br />
              Metrics appear after chronological validation.
            </div>
          </div>
        </Panel>
      </div>
      <div className="bottom-grid">
        <Panel
          title="Learning activity"
          icon={<FlaskConical />}
          action={
            <Link to="/learning-lab" className="section-link">
              Learning Lab <ArrowRight size={11} />
            </Link>
          }
        >
          <div className="learning-empty">
            <div className="empty-icon">
              <History />
            </div>
            <div>
              <div className="empty-title">Ready for the first learning cycle</div>
              <div className="mini-sub">No training runs or model promotions recorded.</div>
              <div className="mini-sub">Last successful learning cycle: —</div>
            </div>
          </div>
        </Panel>
        <Panel title="System health" icon={<Server />}>
          <div className="system-body">
            {[
              {
                icon: Database,
                label: "Lovable Cloud",
                status: connection.data
                  ? "Connected"
                  : connection.data === undefined
                    ? "Checking"
                    : "Unavailable",
                ok: connection.data,
              },
              {
                icon: BrainCircuit,
                label: "Python ML service",
                status: health.data?.message ?? "Checking",
                ok: health.data?.status === "connected",
              },
              { icon: Radio, label: "Market data feed", status: "Not connected", ok: false },
            ].map((s) => (
              <div className="system-line" key={s.label}>
                <span>
                  <s.icon />
                  {s.label}
                </span>
                <span className={s.ok ? "text-primary" : "text-muted-foreground"}>
                  <i className={`status-dot mr-2 ${s.ok ? "connected" : ""}`} />
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
