export function calculateDrift(baseline, signal) {
  let drift = 0;

  if (signal.signal === "timing") {
    if (
      signal.value < baseline.timingRange.min ||
      signal.value > baseline.timingRange.max
    ) {
      drift = 0.08; // softened timing drift
    }
  }

  if (signal.signal === "interaction") {
    const deviation = Math.abs(
      signal.value - baseline.interactionAvg
    );

    if (deviation > 40) drift = Math.max(drift, 0.1);
  }

  if (signal.signal === "device" && signal.value === "changed") {
    drift = Math.max(drift, 0.15); // device still high impact
  }

  return drift;
}