export function deviceContext(userAgent, lastKnownAgent) {
  const changed = userAgent !== lastKnownAgent;

  return {
    signal: "device",
    value: changed ? "changed" : "stable",
    confidence: changed ? 0.4 : 0.9,
    timestamp: Date.now()
  }
}