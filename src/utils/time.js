export function formatDateTime(iso) {
  try {
    const d = new Date(iso);
    // local readable format
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function getMatchStatus(match) {
  // Prefer backend status if present
  if (match?.status) return match.status;

  // Otherwise derive from time
  const start = new Date(match.startTime).getTime();
  const now = Date.now();

  if (Number.isNaN(start)) return "UNKNOWN";
  if (now < start) return "UPCOMING";
  return "LIVE";
}
