export const riskProfiles = [
  { level: 1, name: "Capital Preservation", maxPosition: 0.05, maxEquity: 0.2, minCash: 0.5, maxVolatility: 0.05, maxDrawdown: 0.05, crypto: false },
  { level: 2, name: "Conservative", maxPosition: 0.07, maxEquity: 0.4, minCash: 0.25, maxVolatility: 0.08, maxDrawdown: 0.1, crypto: false },
  { level: 3, name: "Moderate", maxPosition: 0.1, maxEquity: 0.6, minCash: 0.1, maxVolatility: 0.12, maxDrawdown: 0.18, crypto: false },
  { level: 4, name: "Growth", maxPosition: 0.12, maxEquity: 0.8, minCash: 0.05, maxVolatility: 0.18, maxDrawdown: 0.25, crypto: true },
  { level: 5, name: "Aggressive", maxPosition: 0.15, maxEquity: 0.95, minCash: 0.02, maxVolatility: 0.25, maxDrawdown: 0.35, crypto: true },
  { level: 6, name: "Speculative", maxPosition: 0.2, maxEquity: 1, minCash: 0, maxVolatility: 0.4, maxDrawdown: 0.5, crypto: true },
] as const;

/** Willingness to take risk never exceeds the financial ability to bear it. */
export function suitableRiskLevel(tolerance: number, capacity: number, horizonYears: number, liquidityNeed: string) {
  let level = Math.min(tolerance, capacity);
  if (horizonYears < 3) level = Math.min(level, 2);
  if (liquidityNeed === "high") level = Math.min(level, 2);
  return Math.max(1, Math.min(6, Math.round(level)));
}

export function riskProfile(level: number) {
  return riskProfiles[Math.max(1, Math.min(6, level)) - 1];
}
