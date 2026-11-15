import { describe, expect, it } from "vitest";
import { isRecoveryLink } from "@/lib/afi/account";
describe("Password recovery access", () => {
  it("accepts only a recovery link", () => {
    expect(isRecoveryLink("#type=recovery&access_token=test")).toBe(true);
    expect(isRecoveryLink("#type=signup&access_token=test")).toBe(false);
    expect(isRecoveryLink("")).toBe(false);
  });
});