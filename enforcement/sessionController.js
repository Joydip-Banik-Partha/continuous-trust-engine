export function controlSession(session, level) {
  if (level === "EXPIRE") {
    session.active = false;
    session.reason = "Trust expired quietly";
  }

  return session;
}