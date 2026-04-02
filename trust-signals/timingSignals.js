export function timingSignals(previousActionTime, currentActionTime) {
  const delta = currentActionTime - previousActionTime;

  return {
    signal: "timing",
    value: delta,
    confidence: delta > 0 ? 0.8 : 0.2,
    timestamp: currentActionTime
  }
}