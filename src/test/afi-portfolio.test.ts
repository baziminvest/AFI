import { describe, expect, it } from "vitest";
import { suitableRiskLevel, riskProfile } from "@/lib/afi/portfolio";
describe("Investor suitability", () => {
  it("caps tolerance at risk capacity", () => expect(suitableRiskLevel(6, 2, 10, "low")).toBe(2));
  it("limits short horizons to conservative", () => expect(suitableRiskLevel(5, 5, 2, "low")).toBe(2));
  it("limits high liquidity needs to conservative", () => expect(suitableRiskLevel(5, 5, 10, "high")).toBe(2));
  it("blocks crypto below growth", () => expect(riskProfile(3).crypto).toBe(false));
});
