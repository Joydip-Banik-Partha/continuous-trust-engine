export function replayTimeline(timeline) {
  console.log(`\n=== TRUST PLAYBACK: SESSION ${timeline.sessionId} ===`);

  for (const event of timeline.events) {
    console.log(
      `[${event.recordedAt}] ACTION: ${event.action} | TRUST: ${event.trust.toFixed(2)}`
    );
  }

  console.log("=== END PLAYBACK ===\n");
}