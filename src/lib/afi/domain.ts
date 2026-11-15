export const instruments = [
  {
    symbol: "EURUSD",
    label: "EUR/USD",
    name: "Euro / US Dollar",
    flag: "eu",
    quote: "usd",
    category: "FOREX",
  },
  {
    symbol: "GBPUSD",
    label: "GBP/USD",
    name: "British Pound / US Dollar",
    flag: "gb",
    quote: "usd",
    category: "FOREX",
  },
  {
    symbol: "USDJPY",
    label: "USD/JPY",
    name: "US Dollar / Japanese Yen",
    flag: "usd",
    quote: "jp",
    category: "FOREX",
  },
  {
    symbol: "XAUUSD",
    label: "XAU/USD",
    name: "Gold / US Dollar",
    flag: "gold",
    quote: "usd",
    category: "COMMODITY",
  },
] as const;
export const timeframes = ["M1", "M5", "M15", "M30", "H1", "H4", "D1"] as const;
export type Bar = {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number | null;
};
export function canonicalSymbol(symbol: string) {
  const normalized = symbol.toUpperCase();
  if (normalized === "GOLD") return "XAUUSD";
  return instruments.find(
    (i) =>
      normalized === i.symbol || normalized === `${i.symbol}M` || normalized === `${i.symbol}.A`,
  )?.symbol;
}
export function parseCsv(text: string, mapping?: Record<string, string>): Bar[] {
  const lines = text
    .replace(/^\uFEFF/, "")
    .trim()
    .split(/\r?\n/);
  const headers = lines[0]?.split(",").map((h) => h.trim().toLowerCase()) ?? [];
  const index = (name: string) => headers.indexOf(mapping?.[name]?.toLowerCase() ?? name);
  for (const field of ["timestamp", "open", "high", "low", "close"])
    if (index(field) < 0) throw new Error(`Map the ${field} column before validating.`);
  const seen = new Set<string>();
  const bars = lines
    .slice(1)
    .filter((l) => l.trim())
    .map((line, n) => {
      const cells = line.split(",").map((c) => c.trim());
      const raw = cells[index("timestamp")] ?? "";
      if (!/(Z|[+-]\d\d:\d\d)$/.test(raw))
        throw new Error(
          `Row ${n + 2}: timestamp must include UTC Z or an explicit timezone offset.`,
        );
      const date = new Date(raw);
      if (!Number.isFinite(date.getTime())) throw new Error(`Row ${n + 2}: invalid timestamp.`);
      const timestamp = date.toISOString();
      if (seen.has(timestamp)) throw new Error(`Row ${n + 2}: duplicate timestamp.`);
      seen.add(timestamp);
      const values = ["open", "high", "low", "close"].map((k) => Number(cells[index(k)]));
      const [open, high, low, close] = values;
      if (
        open === undefined ||
        high === undefined ||
        low === undefined ||
        close === undefined ||
        values.some((v) => !Number.isFinite(v) || v <= 0) ||
        high < Math.max(open, close, low) ||
        low > Math.min(open, close)
      )
        throw new Error(`Row ${n + 2}: invalid OHLC prices.`);
      const volume =
        index("volume") < 0 || !cells[index("volume")] ? null : Number(cells[index("volume")]);
      if (volume !== null && (!Number.isFinite(volume) || volume < 0))
        throw new Error(`Row ${n + 2}: invalid volume.`);
      return { timestamp, open, high, low, close, volume };
    });
  if (bars.length < 2 || bars.length > 10000)
    throw new Error("Import between 2 and 10,000 historical bars per dataset.");
  for (let i = 1; i < bars.length; i++) {
    const previous = bars[i - 1];
    const current = bars[i];
    if (previous && current && current.timestamp <= previous.timestamp)
      throw new Error("Bars must be in ascending chronological order.");
  }
  return bars;
}
export function riskSize(
  capital: number,
  riskPercent: number,
  stopDistance: number,
  pointValue: number,
) {
  if (
    [capital, riskPercent, stopDistance, pointValue].some((n) => !Number.isFinite(n) || n <= 0) ||
    riskPercent > 5
  )
    return null;
  const risk = (capital * riskPercent) / 100;
  return { risk, lots: risk / (stopDistance * pointValue) };
}
export function pageHead(title: string) {
  const description = `${title} — AFI Adaptive Financial Intelligence. Intelligence for Better Investment Decisions. Evidence-led, signals-only market research.`;
  return {
    meta: [
      { title: `${title} | AFI` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} | AFI` },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
