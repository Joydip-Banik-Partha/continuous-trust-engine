export const metrics = {
  sessionsStarted: 0,
  sessionsExpired: 0,
  decisions: {
    NORMAL: 0,
    DEGRADED: 0,
    RESTRICTED: 0,
    EXPIRE: 0
  },
  trustSamples: [],
  expirations: []
};

export function recordDecision(action, trustScore) {
  metrics.decisions[action]++;
  metrics.trustSamples.push(trustScore);
}

export function recordSessionStart() {
  metrics.sessionsStarted++;
}

export function recordSessionExpiry(durationMs) {
  metrics.sessionsExpired++;
  metrics.expirations.push(durationMs);
}