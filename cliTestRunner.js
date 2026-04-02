import { timingSignals } from "./trust-signals/timingSignals.js";
import { interactionSignals } from "./trust-signals/interactionSignals.js";
import { deviceContext } from "./trust-signals/deviceContext.js";

import { establishBaseline } from "./trust-model/baselineModel.js";
import { calculateDrift } from "./trust-model/driftEngine.js";
import { temporalDecay } from "./trust-model/temporalDecay.js";
import { computeTrust } from "./trust-model/trustScore.js";

import { resolveDecision } from "./decision-engine/decisionResolver.js";
import { reduceCapabilities } from "./enforcement/capabilityReducer.js";
import { rateSoftLimiter } from "./enforcement/rateSoftLimiter.js";
import { controlSession } from "./enforcement/sessionController.js";

import {
  metrics,
  recordDecision,
  recordSessionStart,
  recordSessionExpiry
} from "./telemetry/metrics.js";

import {
  createTrustTimeline,
  recordTrustEvent
} from "./audit/trustTimeline.js";

import { replayTimeline } from "./audit/playbackEngine.js";

function runProfile(profileName, actions) {
  console.log(`\n=== PROFILE: ${profileName} ===`);

  recordSessionStart();
  const sessionStart = Date.now();

  const timeline = createTrustTimeline(profileName);

  let session = {
    active: true,
    trust: 0.9,
    lastAction: Date.now(),
    device: "DESKTOP",
    featuresLimited: false,
    readOnly: false,
    delay: 0
  };

  const baseline = establishBaseline([
    timingSignals(1000, 1400),
    interactionSignals(90)
  ]);

  for (const step of actions) {
    const signals = [
      timingSignals(session.lastAction, session.lastAction + step.timing),
      interactionSignals(step.speed),
      deviceContext(step.device, session.device)
    ];

    let drift = 0;
    for (const signal of signals) {
      drift += calculateDrift(baseline, signal);
    }

    session.trust = temporalDecay(session.trust, session.lastAction);
    session.trust = computeTrust(session.trust, drift);

    const decision = resolveDecision(session.trust);

    recordDecision(decision.action, session.trust);

    recordTrustEvent(timeline, {
      action: decision.action,
      trust: session.trust
    });

    session = reduceCapabilities(session, decision.action);
    session = rateSoftLimiter(session, decision.action);
    session = controlSession(session, decision.action);

    console.log(
      `Action: ${decision.action} | Trust: ${session.trust.toFixed(2)}`
    );

    session.lastAction += step.timing;
    session.device = step.device;

    if (!session.active) {
      recordSessionExpiry(Date.now() - sessionStart);
      console.log("SESSION ENDED QUIETLY");
      break;
    }
  }

  replayTimeline(timeline);
}

/* ================================
   TEST PROFILES
   ================================ */

// Normal Human
runProfile("Normal Human", [
  { timing: 1200, speed: 95, device: "DESKTOP" },
  { timing: 1500, speed: 90, device: "DESKTOP" },
  { timing: 1700, speed: 100, device: "DESKTOP" }
]);

// Automation Bot
runProfile("Automation Bot", [
  { timing: 300, speed: 40, device: "DESKTOP" },
  { timing: 300, speed: 40, device: "DESKTOP" },
  { timing: 300, speed: 40, device: "DESKTOP" }
]);

// Session Hijack
runProfile("Session Hijack", [
  { timing: 1300, speed: 90, device: "DESKTOP" },
  { timing: 600, speed: 55, device: "MOBILE" },
  { timing: 500, speed: 45, device: "MOBILE" }
]);

// Slow Adaptive Attacker
runProfile("Slow Adaptive Attacker", [
  { timing: 1100, speed: 90, device: "DESKTOP" },
  { timing: 1000, speed: 85, device: "DESKTOP" },
  { timing: 900, speed: 80, device: "DESKTOP" },
  { timing: 800, speed: 75, device: "DESKTOP" }
]);

console.log("\n=== TELEMETRY SUMMARY ===");
console.log("Sessions Started:", metrics.sessionsStarted);
console.log("Sessions Expired:", metrics.sessionsExpired);
console.log("Decision Counts:", metrics.decisions);

const avgTrust =
  metrics.trustSamples.reduce((a, b) => a + b, 0) /
  metrics.trustSamples.length;

console.log("Average Trust Level:", avgTrust.toFixed(2));

if (metrics.expirations.length > 0) {
  const avgExpire =
    metrics.expirations.reduce((a, b) => a + b, 0) /
    metrics.expirations.length;

  console.log(
    "Mean Time To Expiry (ms):",
    Math.round(avgExpire)
  );
}