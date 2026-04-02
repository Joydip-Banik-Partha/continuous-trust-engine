export function explain(decision) {
  return {
    summary: `Trust evaluated as ${decision.action}`,
    score: decision.trustScore,
    time: new Date(decision.decidedAt).toISOString()
  };
}