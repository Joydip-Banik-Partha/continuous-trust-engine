export function trustPolicy(trustScore) {
  if (trustScore >= 0.65) return "NORMAL";
  if (trustScore >= 0.45) return "DEGRADED";
  if (trustScore >= 0.25) return "RESTRICTED";
  return "EXPIRE";
}