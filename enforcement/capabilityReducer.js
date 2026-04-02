export function reduceCapabilities(session, level) {
  if (level === "DEGRADED") session.featuresLimited = true;
  if (level === "RESTRICTED") session.readOnly = true;

  return session;
}