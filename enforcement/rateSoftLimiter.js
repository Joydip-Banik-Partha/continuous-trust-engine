export function rateSoftLimiter(session, level) {
  session.delay =
    level === "DEGRADED" ? 200 :
    level === "RESTRICTED" ? 500 :
    0;

  return session;
}