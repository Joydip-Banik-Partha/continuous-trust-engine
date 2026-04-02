export function createTrustTimeline(sessionId) {
  return {
    sessionId,
    events: []
  };
}

export function recordTrustEvent(timeline, event) {
  timeline.events.push({
    ...event,
    recordedAt: new Date().toISOString()
  });
}

export function getTimeline(timeline) {
  return timeline.events;
}