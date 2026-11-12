import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BrainCircuit,
  Database,
  Download,
  FileCheck2,
  FlaskConical,
  History,
  Layers3,
  Monitor,
  Play,
  Plug,
  Radio,
  Save,
  ShieldCheck,
  Upload,
  Activity,
  TrendingUp,
  RotateCcw,
  Waves,
  Crosshair,
  Clock3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { instruments, parseCsv, riskSize, timeframes, type Bar } from "@/lib/afi/domain";
import { trainModel } from "@/lib/afi/service.functions";
import { useWorkspace } from "./workspace";
import { PageTitle, ConnectionStrip } from "./shell";
import { Empty, InstrumentCards, MarketChart, Panel } from "./overview";
export function Filters() {
  const w = useWorkspace();
  return (
    <div className="filters">
      <label>
        Instrument
        <select
          aria-label="Instrument filter"
          value={w.symbol}
          onChange={(e) => w.setSymbol(e.target.value)}
        >
          {instruments.map((i) => (
            <option key={i.symbol} value={i.symbol}>
              {i.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Timeframe
        <select
          aria-label="Timeframe filter"
          value={w.timeframe}
          onChange={(e) => w.setTimeframe(e.target.value)}
        >
          {timeframes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <label>
        Trading style
        <select
          aria-label="Trading style"
          value={w.style}
          onChange={(e) => w.setStyle(e.target.value)}
        >
          {["All styles", "Scalping", "Intraday", "Swing trading"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
    </div>
  );
}
const strategies = [
  {
    name: "Trend continuation",
    icon: TrendingUp,
    regime: "TRENDING UP / DOWN",
    description:
      "Continuation after a pullback to established structure. Invalidated by an opposing structure break.",
    timeframes: "M5 · M15 · M30 · H1 · H4 · D1",
  },
  {
    name: "Range trading",
    icon: Waves,
    regime: "RANGING",
    description:
      "Mean reversion at confirmed range boundaries. Invalidated by a volatility-adjusted breakout.",
    timeframes: "M1 · M5 · M15 · M30 · H1",
  },
  {
    name: "Breakout",
    icon: Activity,
    regime: "BREAKOUT / EXPANSION",
    description:
      "Expansion beyond a consolidated price range. Invalidated when price closes back inside the range.",
    timeframes: "M5 · M15 · M30 · H1 · H4",
  },
  {
    name: "Reversal",
    icon: RotateCcw,
    regime: "REVERSAL",
    description:
      "Change of character following an extended directional move. Requires closed-candle confirmation.",
    timeframes: "M15 · M30 · H1 · H4 · D1",
  },
  {
    name: "Liquidity sweep & reclaim",
    icon: Crosshair,
    regime: "REVERSAL / RANGING",
    description:
      "A sweep of a price-derived liquidity reference followed by a reclaim. Not verified order-book liquidity.",
    timeframes: "M1 · M5 · M15 · M30 · H1",
  },
];
export function Markets() {
  return (
    <>
      <PageTitle title="Markets" subtitle="Forex and Gold. One research universe." />
      <ConnectionStrip />
      <Filters />
      <InstrumentCards />
      <div className="research-grid">
        <MarketChart />
        <Panel title="Gold intelligence" icon={<Layers3 />}>
          <div className="intelligence-stats">
            {[
              "Dollar strength",
              "Treasury yields",
              "Real yields",
              "Inflation expectations",
              "Geopolitical context",
            ].map((s) => (
              <div className="stat-row" key={s}>
                <span>{s}</span>
                <span className="text-gold">Unavailable</span>
              </div>
            ))}
          </div>
          <div className="notice">No external macroeconomic source is connected.</div>
        </Panel>
      </div>
    </>
  );
}
export function Intelligence() {
  const w = useWorkspace();
  return (
    <>
      <PageTitle
        title="Market intelligence"
        subtitle="Structure, volatility and behaviour. Beyond a single indicator."
      />
      <Filters />
      <Panel title={`${w.symbol} · ${w.timeframe} intelligence`} icon={<BrainCircuit />}>
        <Empty
          icon={<BrainCircuit />}
          title="Awaiting validated market analysis"
          subtitle="Feature generation and regime classification require the Python learning service."
          action={
            <Button variant="outline" asChild>
              <Link to="/learning-lab">
                Open Learning Lab <ArrowRight />
              </Link>
            </Button>
          }
        />
      </Panel>
      <div className="detail-grid">
        {[
          {
            title: "Price & structure",
            icon: TrendingUp,
            text: "Returns, candle bodies, wicks, confirmed swings and breaks of structure.",
          },
          {
            title: "Volatility & displacement",
            icon: Activity,
            text: "ATR, realized volatility and unusually large directional movements.",
          },
          {
            title: "Liquidity & sessions",
            icon: Waves,
            text: "Previous-day reference levels, price-derived sweeps and UTC session context.",
          },
        ].map((i) => (
          <article className="detail-card" key={i.title}>
            <i.icon />
            <h3>{i.title}</h3>
            <p>{i.text}</p>
            <div className="badge mt-4 inline-block">AWAITING ANALYSIS</div>
          </article>
        ))}
      </div>
    </>
  );
}
export function Signals() {
  return (
    <>
      <PageTitle title="Signals" subtitle="Evidence-led decisions. BUY, SELL or WAIT." />
      <Filters />
      <Panel
        title="Confirmed signals"
        icon={<Radio />}
        action={<span className="badge">SIGNALS ONLY</span>}
      >
        <table className="data-table">
          <thead>
            <tr>
              {["Instrument", "Decision", "Confidence", "Regime", "Model", "Expiry"].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
        </table>
        <Empty
          icon={<Radio />}
          title="No confirmed signals"
          subtitle="No production model or genuine feed is available. No directional decisions are being generated."
        />
      </Panel>
    </>
  );
}
export function Strategies() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <>
      <PageTitle
        title="Strategies"
        subtitle="The right approach depends on the market environment."
      />
      <Filters />
      <div className="detail-grid">
        {strategies.map((s) => (
          <article className="detail-card" key={s.name}>
            <div className="flex justify-between items-center">
              <s.icon />
              <span className="badge">BASELINE DEFINITION</span>
            </div>
            <h3>{s.name}</h3>
            <p>{s.description}</p>
            <div className="mini-sub mt-4">{s.regime}</div>
            <div className="mini-sub">{s.timeframes}</div>
            <Button
              variant="outline"
              size="sm"
              className="mt-5"
              onClick={() => setSelected(selected === s.name ? null : s.name)}
            >
              {selected === s.name ? "Close assessment" : "View assessment"}
              <ArrowRight />
            </Button>
            {selected === s.name && (
              <div className="notice mt-4 px-0">
                <strong>NO TRADE</strong>
                <br />
                Historical performance: unavailable.
                <br />
                Confidence threshold: not calibrated.
                <br />
                Entry, exit and sizing must pass validated strategy evaluation before use.
              </div>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
export function LearningLab() {
  const w = useWorkspace();
  const [tab, setTab] = useState("Datasets");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [bars, setBars] = useState<Bar[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [model, setModel] = useState<"random_forest" | "xgboost">("random_forest");
  const input = useRef<HTMLInputElement>(null);
  const train = useServerFn(trainModel);
  async function chooseFile(f?: File) {
    if (!f) return;
    setError("");
    setBars([]);
    setFile(f);
    if (f.size > 20 * 1024 * 1024) {
      setError("CSV files must be no larger than 20 MB.");
      return;
    }
    const content = await f.text();
    setText(content);
    const cols =
      content
        .replace(/^\uFEFF/, "")
        .split(/\r?\n/)[0]
        ?.split(",")
        .map((c) => c.trim()) ?? [];
    setHeaders(cols);
    const next: Record<string, string> = {};
    for (const field of ["timestamp", "open", "high", "low", "close", "volume"]) {
      const match = cols.find((c) => c.toLowerCase() === field);
      if (match) next[field] = match;
    }
    setMapping(next);
  }
  function validate() {
    try {
      setBars(parseCsv(text, mapping));
      setError("");
      toast.success("Historical bars validated.");
    } catch (e) {
      setBars([]);
      setError(e instanceof Error ? e.message : "Invalid CSV.");
    }
  }
  async function save() {
    if (!w.user) {
      toast.error("Sign in to save historical data.");
      return;
    }
    setBusy(true);
    try {
      const hash = Array.from(
        new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text))),
      )
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      const { error: err } = await supabase.rpc("import_historical_dataset", {
        p_symbol: w.symbol,
        p_timeframe: w.timeframe,
        p_filename: file?.name ?? "historical.csv",
        p_hash: hash,
        p_bars: bars,
      });
      if (err) throw err;
      await w.datasets.refetch();
      toast.success("Historical dataset saved to your research workspace.");
      setFile(null);
      setBars([]);
      setText("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save the dataset.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageTitle
        title="Learning Lab"
        subtitle="From historical observations to validated intelligence."
      />
      <Filters />
      <div className="tabs-row">
        {[
          "Datasets",
          "Feature engineering",
          "Model training",
          "Model registry",
          "Learning history",
        ].map((t) => (
          <Button
            key={t}
            variant={tab === t ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setTab(t)}
          >
            {t}
          </Button>
        ))}
      </div>
      {tab === "Datasets" ? (
        <>
          <Panel
            title="Historical datasets"
            icon={<Database />}
            className="full-panel"
            action={<span className="badge">CSV · UTC TIMESTAMPS</span>}
          >
            <input
              type="file"
              accept=".csv,text/csv"
              hidden
              ref={input}
              onChange={(e) => chooseFile(e.target.files?.[0])}
            />
            <div className="import-area">
              <Upload size={25} />
              <div className="empty-title">{file?.name ?? "Import historical market data"}</div>
              <div className="empty-sub">
                Timestamp, open, high, low, close and optional volume.
              </div>
              <Button variant="outline" onClick={() => input.current?.click()}>
                <Upload />
                {file ? "Choose another CSV" : "Choose CSV file"}
              </Button>
            </div>
            {file && (
              <>
                <div className="form-grid">
                  {["timestamp", "open", "high", "low", "close", "volume"].map((field) => (
                    <div className="form-field" key={field}>
                      <label htmlFor={`map-${field}`}>{field} column</label>
                      <select
                        id={`map-${field}`}
                        value={mapping[field] ?? ""}
                        onChange={(e) => {
                          setMapping({ ...mapping, [field]: e.target.value });
                          setBars([]);
                        }}
                      >
                        <option value="">
                          {field === "volume" ? "None (optional)" : "Select column"}
                        </option>
                        {headers.map((h) => (
                          <option key={h}>{h}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                <div className="px-6 pb-5 flex flex-wrap gap-3">
                  <Button variant="outline" onClick={validate}>
                    <FileCheck2 />
                    Validate data
                  </Button>
                  <Button disabled={!bars.length || busy} onClick={save}>
                    <Save />
                    {busy ? "Saving…" : "Save dataset"}
                  </Button>
                  {!w.user && (
                    <Button variant="link" asChild>
                      <Link to="/auth">
                        Sign in to save <ArrowRight />
                      </Link>
                    </Button>
                  )}
                </div>
              </>
            )}
            {error && (
              <div role="alert" className="notice error">
                {error}
              </div>
            )}
            {bars.length > 0 && (
              <>
                <div className="notice success">
                  {bars.length} valid historical bars · {bars[0]?.timestamp} to{" "}
                  {bars.at(-1)?.timestamp}
                </div>
                <div className="table-scroll">
                  <table className="data-table">
                    <thead>
                      <tr>
                        {["Timestamp (UTC)", "Open", "High", "Low", "Close", "Volume"].map((t) => (
                          <th key={t}>{t}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bars.slice(0, 5).map((b) => (
                        <tr key={b.timestamp}>
                          <td>{b.timestamp}</td>
                          <td>{b.open}</td>
                          <td>{b.high}</td>
                          <td>{b.low}</td>
                          <td>{b.close}</td>
                          <td>{b.volume ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            <div className="notice">
              Historical data only. Duplicate timestamps, malformed candles and unordered rows are
              rejected. Up to 10,000 bars per import.
            </div>
          </Panel>
          <Panel title="Dataset library" icon={<History />} className="full-panel">
            {w.datasets.data?.length ? (
              <div className="table-scroll">
                <table className="data-table">
                  <thead>
                    <tr>
                      {["Dataset", "Instrument", "Timeframe", "Bars", "Imported"].map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {w.datasets.data.map((d) => (
                      <tr key={d.id}>
                        <td>{d.filename}</td>
                        <td>{d.symbol}</td>
                        <td>{d.timeframe}</td>
                        <td>{d.row_count.toLocaleString()}</td>
                        <td>{d.created_at.slice(0, 10)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <Empty
                title={
                  w.user
                    ? "No historical datasets imported"
                    : "Sign in to access your dataset library"
                }
                icon={<Database />}
                action={
                  !w.user ? (
                    <Button variant="outline" asChild>
                      <Link to="/auth">
                        Sign in
                        <ArrowRight />
                      </Link>
                    </Button>
                  ) : undefined
                }
              />
            )}
          </Panel>
        </>
      ) : tab === "Feature engineering" ? (
        <div className="detail-grid">
          {[
            "Returns & momentum",
            "Candle structure & wicks",
            "ATR & realized volatility",
            "EMA, RSI & Bollinger Bands",
            "Displacement & liquidity proxies",
            "Sessions & regime classification",
          ].map((f) => (
            <div className="detail-card" key={f}>
              <BrainCircuit />
              <h3>{f}</h3>
              <p>Calculated by the independent Python service from closed historical bars.</p>
              <span className="badge mt-4 inline-block">NOT GENERATED</span>
            </div>
          ))}
        </div>
      ) : tab === "Model training" ? (
        <Panel title="Train a candidate model" icon={<FlaskConical />} className="full-panel">
          <div className="form-grid">
            <div className="form-field">
              <label>Model type</label>
              <select
                value={model}
                onChange={(e) =>
                  setModel(e.target.value === "xgboost" ? "xgboost" : "random_forest")
                }
              >
                <option value="random_forest">Random forest</option>
                <option value="xgboost">XGBoost</option>
              </select>
            </div>
            <div className="form-field">
              <label>Dataset</label>
              <select id="training-dataset" aria-label="Training dataset">
                <option value="">Select a dataset</option>
                {w.datasets.data?.map((d) => (
                  <option value={d.id} key={d.id}>
                    {d.filename} · {d.symbol} · {d.timeframe}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="px-6 pb-6">
            <Button
              disabled={busy}
              onClick={async () => {
                const select = document.getElementById(
                  "training-dataset",
                ) as HTMLSelectElement | null;
                if (!select?.value) {
                  toast.error("Select a historical dataset first.");
                  return;
                }
                setBusy(true);
                try {
                  const result = await train({
                    data: { datasetId: select.value, modelType: model },
                  });
                  result.ok ? toast.success(result.message) : toast.error(result.message);
                } catch {
                  toast.error("Sign in as an authorized administrator to train.");
                } finally {
                  setBusy(false);
                }
              }}
            >
              <Play />
              {busy ? "Training…" : "Train candidate"}
            </Button>
          </div>
          <div className="notice">
            Administrator authorization is required. Training uses chronological validation; a
            candidate is never promoted automatically.
          </div>
        </Panel>
      ) : (
        <Panel title={tab} icon={<BrainCircuit />} className="full-panel">
          <Empty
            title={
              tab === "Model registry"
                ? "No model versions registered"
                : "No learning cycles recorded"
            }
            subtitle="No training, validation or model promotion has been recorded."
          />
        </Panel>
      )}
    </>
  );
}
export function Backtesting() {
  const [type, setType] = useState("Historical");
  return (
    <>
      <PageTitle
        title="Backtesting"
        subtitle="Test assumptions. Measure outcomes. Respect uncertainty."
      />
      <div className="tabs-row">
        {["Historical", "Out-of-sample", "Forward testing", "Live performance"].map((t) => (
          <Button
            key={t}
            variant={type === t ? "secondary" : "ghost"}
            onClick={() => setType(t)}
            size="sm"
          >
            {t}
          </Button>
        ))}
      </div>
      <Filters />
      <Panel title={`${type} testing`} icon={<Activity />}>
        <div className="form-grid">
          {[
            { label: "Strategy", options: strategies.map((s) => s.name) },
            { label: "Start date", type: "date" },
            { label: "End date", type: "date" },
            { label: "Initial capital (USD)", value: "10000" },
            { label: "Risk per trade (%)", value: "1" },
            { label: "Stop-loss (ATR)", value: "1.5" },
            { label: "Take-profit (ATR)", value: "2" },
            { label: "Spread (price units)", value: "0" },
            { label: "Slippage (price units)", value: "0" },
            { label: "Commission per trade (USD)", value: "0" },
          ].map((f) => (
            <div className="form-field" key={f.label}>
              <label>{f.label}</label>
              {f.options ? (
                <select aria-label={f.label}>
                  {f.options.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              ) : (
                <input
                  aria-label={f.label}
                  type={f.type ?? "number"}
                  defaultValue={f.value}
                  min="0"
                />
              )}
            </div>
          ))}
        </div>
        <div className="px-6 pb-6">
          <Button
            onClick={() =>
              toast.error(
                type === "Live performance"
                  ? "Live execution is disabled in this release."
                  : "A validated strategy and connected Python backtesting service are required.",
              )
            }
          >
            <Play />
            Run backtest
          </Button>
        </div>
        <div className="notice">
          No backtest results are available. Historical performance does not guarantee future
          results.
        </div>
      </Panel>
    </>
  );
}
export function MT4Simulator() {
  return (
    <>
      <PageTitle
        title="MT4 Simulator"
        subtitle="Local, closed-candle intelligence for the MetaTrader 4 Strategy Tester."
      />
      <div className="detail-grid">
        <article className="detail-card">
          <Monitor />
          <h3>AFI baseline indicator</h3>
          <p>
            Offline calculations. Confirmed closed candles. Stable iCustom buffers. No WebRequest
            and no trade execution.
          </p>
          <Button className="mt-5" variant="outline" asChild>
            <a href="/downloads/AFI_Baseline.mq4" download>
              <Download />
              Download MQL4 source
            </a>
          </Button>
        </article>
        <article className="detail-card">
          <Database />
          <h3>Historical predictions</h3>
          <p>
            Local tester-compatible CSV schema for external historical predictions. Timestamp,
            symbol, timeframe and directional probabilities.
          </p>
          <Button className="mt-5" variant="outline" asChild>
            <a href="/downloads/afi-predictions-template.csv" download>
              <Download />
              Download CSV template
            </a>
          </Button>
        </article>
        <article className="detail-card">
          <ShieldCheck />
          <h3>Read-only bridge</h3>
          <p>
            Optional Expert Advisor health bridge for future external service communication. Orders
            are not permitted.
          </p>
          <Button className="mt-5" variant="outline" asChild>
            <a href="/downloads/AFI_ReadOnlyBridge.mq4" download>
              <Download />
              Download bridge source
            </a>
          </Button>
        </article>
      </div>
      <Panel title="Indicator buffer contract" className="full-panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Buffer</th>
              <th>Output</th>
            </tr>
          </thead>
          <tbody>
            {["Bullish score", "Bearish score", "Market regime", "Buy arrow", "Sell arrow"].map(
              (s, n) => (
                <tr key={s}>
                  <td className="font-mono">{n}</td>
                  <td>{s}</td>
                </tr>
              ),
            )}
          </tbody>
        </table>
        <div className="notice">
          Source prepared for MetaEditor testing. Compilation and Strategy Tester behaviour have not
          been verified in MetaTrader.
        </div>
      </Panel>
    </>
  );
}
export function MT5Integration() {
  return (
    <>
      <PageTitle
        title="MT5 Integration"
        subtitle="A read-only foundation for future broker-connected intelligence."
      />
      <ConnectionStrip />
      <Panel title="MetaTrader 5 connector" icon={<Plug />} className="full-panel">
        <Empty
          icon={<Plug />}
          title="No MT5 terminal connected"
          subtitle="Requires a Windows machine with MetaTrader 5 running. Historical CSV research remains available."
          action={
            <Button variant="outline" asChild>
              <Link to="/learning-lab">
                Import historical data
                <ArrowRight />
              </Link>
            </Button>
          }
        />
        <div className="notice">
          Connection, account metadata, symbol discovery and candle retrieval source are prepared.
          No order submission is exposed.
        </div>
      </Panel>
    </>
  );
}
export function RiskManagement() {
  const [capital, setCapital] = useState(10000),
    [risk, setRisk] = useState(1),
    [stop, setStop] = useState(20),
    [point, setPoint] = useState(10);
  const result = riskSize(capital, risk, stop, point);
  return (
    <>
      <PageTitle
        title="Risk Management"
        subtitle="Understand exposure before any future execution."
      />
      <Panel title="Position sizing research" icon={<ShieldCheck />} className="full-panel">
        <div className="form-grid">
          {[
            { label: "Account capital (USD)", value: capital, set: setCapital },
            { label: "Risk per trade (%)", value: risk, set: setRisk },
            { label: "Stop distance (points)", value: stop, set: setStop },
            { label: "Value per point per lot (USD)", value: point, set: setPoint },
          ].map((f) => (
            <div className="form-field" key={f.label}>
              <label>{f.label}</label>
              <input
                aria-label={f.label}
                type="number"
                min="0.01"
                step="any"
                value={f.value}
                onChange={(e) => f.set(Number(e.target.value))}
              />
            </div>
          ))}
        </div>
        <div className="px-6 pb-6 flex gap-12 flex-wrap">
          <div>
            <div className="metric-label">Maximum risk</div>
            <div className="result-big">{result ? `$${result.risk.toFixed(2)}` : "—"}</div>
          </div>
          <div>
            <div className="metric-label">Calculated size</div>
            <div className="result-big">{result ? `${result.lots.toFixed(3)} lots` : "—"}</div>
          </div>
        </div>
        {!result && (
          <div className="notice error">
            Enter positive values and a risk percentage no greater than 5%.
          </div>
        )}
        <div className="notice">
          Research calculation only. Confirm broker contract specifications and minimum lot sizes.
          Live trading and automatic execution are disabled.
        </div>
      </Panel>
    </>
  );
}
export function Settings() {
  const w = useWorkspace();
  const [timezone, setTimezone] = useState("UTC");
  const [timeframe, setTimeframe] = useState("H1");
  const [busy, setBusy] = useState(false);
  return (
    <>
      <PageTitle title="Settings" subtitle="Your research preferences and connection status." />
      <ConnectionStrip />
      <Panel title="Workspace preferences" icon={<Save />} className="full-panel">
        <div className="form-grid">
          <div className="form-field">
            <label>Display timezone</label>
            <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
              {["UTC", "Africa/Nairobi", "Europe/London", "America/New_York", "Asia/Tokyo"].map(
                (z) => (
                  <option key={z}>{z}</option>
                ),
              )}
            </select>
          </div>
          <div className="form-field">
            <label>Default timeframe</label>
            <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
              {timeframes.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="px-6 pb-6">
          <Button
            disabled={busy}
            onClick={async () => {
              if (!w.user) {
                toast.error("Sign in to save preferences.");
                return;
              }
              setBusy(true);
              const { error } = await supabase
                .from("user_settings")
                .upsert(
                  { user_id: w.user.id, timezone, default_timeframe: timeframe },
                  { onConflict: "user_id" },
                );
              setBusy(false);
              if (error) {
                toast.error("Preferences could not be saved.");
                return;
              }
              w.setTimeframe(timeframe);
              toast.success("Research preferences saved.");
            }}
          >
            <Save />
            {busy ? "Saving…" : "Save preferences"}
          </Button>
        </div>
      </Panel>
      <Panel title="Service connections" icon={<Plug />} className="full-panel">
        <div className="notice">
          Market feed: not configured.
          <br />
          Python service: {w.health.data?.message ?? "Checking"}.<br />
          Credentials are managed securely outside the browser. No broker password is stored in this
          workspace.
        </div>
      </Panel>
    </>
  );
}
