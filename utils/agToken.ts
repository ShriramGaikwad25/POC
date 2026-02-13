/**
 * Resolves the bearer token for Access Governance API.
 * Supports:
 * 1. Cookie-style string: accessToken=eyJ...; uidTenant=...; reviewerId=... etc.
 *    → uses the accessToken value as Bearer token.
 * 2. Plain token: single JWT string → used as-is.
 */
export function getAGBearerToken(): string | null {
  const raw = process.env.AG_ACCESS_REQUESTS_BEARER_TOKEN;
  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  if (trimmed.includes("accessToken=")) {
    const parts = trimmed.split(";").map((p) => p.trim());
    for (const part of parts) {
      if (part.startsWith("accessToken=")) {
        const value = part.slice("accessToken=".length).trim();
        return value || null;
      }
    }
  }

  return trimmed;
}
