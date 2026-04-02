import { trustPolicy } from "./trustPolicy.js";

export function resolveDecision(trustScore) {
  return {
    trustScore,
    action: trustPolicy(trustScore),
    decidedAt: Date.now()
  };
}