export function establishBaseline(signals) {
  return {
    timingRange: {
      min: Math.min(...signals.map(s => s.value)),
      max: Math.max(...signals.map(s => s.value))
    },
    interactionAvg:
      signals.reduce((a, s) => a + s.value, 0) / signals.length,
    createdAt: Date.now()
  }
}