export function isRecoveryLink(hash: string) {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  return params.get("type") === "recovery";
}