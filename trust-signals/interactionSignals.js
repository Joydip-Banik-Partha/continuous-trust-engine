export function interactionSignals(interactionSpeed) {
  return {
    signal: "interaction",
    value: interactionSpeed,
    confidence: interactionSpeed < 120 ? 0.9 : 0.4,
    timestamp: Date.now()
  }
}