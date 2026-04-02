import { timingSignals } from "./trust-signals/timingSignals.js";
import { interactionSignals } from "./trust-signals/interactionSignals.js";
import { deviceContext } from "./trust-signals/deviceContext.js";

import { establishBaseline } from "./trust-model/baselineModel.js";
import { calculateDrift } from "./trust-model/driftEngine.js";
import { temporalDecay } from "./trust-model/temporalDecay.js";
import { computeTrust } from "./trust-model/trustScore.js";

import { resolveDecision } from "./decision-engine/decisionResolver.js";

import { reduceCapabilities } from "./enforcement/capabilityReducer.js";
import { controlSession } from "./enforcement/sessionController.js";
import { rateSoftLimiter } from "./enforcement/rateSoftLimiter.js";

import { captureTrustEvent } from "./audit/trustTimeline.js";
import { explain } from "./audit/explainability.js";

// -------------------------
// SESSION STATE
// -------------------------
let session = {
  active: true,
  trust: 0.9,
  lastAction: Date.now(),
  device: "DESKTOP",
  featuresLimited: false,
  readOnly: false,
  delay: 0
};

// -------------------------
// BASELINE LEARNING
// -------------------------
const initialSignals = [
  timingSignals(1000, 1400),
  interactionSignals(90)
];

const baseline = establishBaseline(initialSignals);

// -------------------------
// CONTINUOUS TRUST LOOP
// -------------------------
function processAction(actionTime, interactionSpeed, userAgent) {
  if (!session.active) {
    console.log("Session expired.");
    return;
  }

  // Collect signals
  const signals = [
    timingSignals(session.lastAction, actionTime),
    interactionSignals(interactionSpeed),
    deviceContext(userAgent, session.device)
  ];

  // Calculate drift
  let totalDrift = 0;
  signals.forEach(signal => {
    totalDrift += calculateDrift(baseline, signal);
  });

  // Temporal decay
  session.trust = temporalDecay(session.trust, session.lastAction);

  // Apply drift
  session.trust = computeTrust(session.trust, totalDrift);

  // Decision
  const decision = resolveDecision(session.trust);

  // Enforcement
  session = reduceCapabilities(session, decision.action);
  session = rateSoftLimiter(session, decision.action);
  session = controlSession(session, decision.action);

  // Audit
  const auditEvent = captureTrustEvent(decision);
  const explanation = explain(decision);

  // Output (for demo)
  console.log("ACTION:", decision.action);
  console.log("TRUST:", session.trust.toFixed(2));
  console.log("SESSION:", session);
  console.log("EXPLANATION:", explanation);
  console.log("--------");

  session.lastAction = actionTime;
  session.device = userAgent;
}

// -------------------------
// SIMULATION RUN
// -------------------------
processAction(Date.now() + 1200, 95, "DESKTOP");
processAction(Date.now() + 1400, 92, "DESKTOP");
processAction(Date.now() + 1600, 70, "DESKTOP");    
processAction(Date.now() + 2000, 55, "MOBILE");    
processAction(Date.now() + 2400, 45, "MOBILE");      
processAction(Date.now() + 3000, 30, "MOBILE");      