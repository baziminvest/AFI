import { describe, it, expect } from "vitest";
import { canonicalSymbol, parseCsv, riskSize, instruments, timeframes } from "@/lib/afi/domain";
const csv =
  "timestamp,open,high,low,close,volume\n2026-01-01T00:00:00Z,1.1,1.2,1.0,1.15,100\n2026-01-01T01:00:00Z,1.15,1.3,1.1,1.2,200";
describe("AFI data rules", () => {
  it("supports the four required canonical instruments", () => {
    expect(instruments.map((i) => i.symbol)).toEqual(["EURUSD", "GBPUSD", "USDJPY", "XAUUSD"]);
  });
  it("supports all seven required timeframes", () => {
    expect(timeframes).toEqual(["M1", "M5", "M15", "M30", "H1", "H4", "D1"]);
  });
  it("maps broker aliases without conflating canonical symbols", () => {
    expect(canonicalSymbol("GOLD")).toBe("XAUUSD");
    expect(canonicalSymbol("EURUSDm")).toBe("EURUSD");
    expect(canonicalSymbol("GBPUSD.a")).toBe("GBPUSD");
    expect(canonicalSymbol("XAUUSDm")).toBe("XAUUSD");
  });
  it("accepts genuine chronological OHLC rows", () => {
    expect(parseCsv(csv)[1]?.close).toBe(1.2);
  });
  it("rejects duplicate records", () => {
    expect(() => parseCsv(csv.replace("01:00:00Z", "00:00:00Z"))).toThrow("duplicate");
  });
  it("requires explicit timezone information", () => {
    expect(() => parseCsv(csv.replaceAll("Z", ""))).toThrow("timezone");
  });
  it("rejects malformed candles", () => {
    expect(() => parseCsv(csv.replace("1.2,1.0", "0.9,1.0"))).toThrow("OHLC");
  });
  it("calculates risk from real user inputs", () => {
    expect(riskSize(10000, 1, 20, 10)).toEqual({ risk: 100, lots: 0.5 });
  });
});
