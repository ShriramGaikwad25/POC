/**
 * Resolves the bearer token for Access Governance API.
 * Uses env AG_ACCESS_REQUESTS_BEARER_TOKEN, or the fallback below (for local/POC only).
 * Supports:
 * 1. Cookie-style string: accessToken=eyJ...; uidTenant=...; reviewerId=... etc.
 * 2. Plain token: single JWT string.
 */
const AG_TOKEN_HARDCODED =
  "accessToken=eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJBQ01FQ09NIiwiYXVkIjoiaHR0cDovL2twZ2F0ZXdheWF1ZGllbmNlLmNvbS9nYXRld2F5IiwiaWF0IjoxNzcwOTQxNDI5LCJleHAiOjE3NzEwMjc4MjksImluZm8iOnsiY2xpZW50SUQiOiJkMDk2OGE3MC01OTRlLTQxZjgtYjNhZS01ODk4YzU3YjBiMGIiLCJsb2dpbklEIjoiSEFSSVNIIiwiYnJvd3NlcklEIjoib3gzbjlSQUpKYiIsInRlbmFudElkIjoiQUNNRUNPTSIsImlkIjoiSEFSSVNIIiwidXNlcmlkIjoiZDBkMWQ0NWEtN2M2Zi00MTFhLTg2NzUtODk3NTZiMGFlY2Y3IiwiYWRtaW5Sb2xlcyI6IkRvbWFpbiBBZG1pbmlzdHJhdG9yIiwiZW1haWwiOiJKYW5nYWRhLkhhcmlzaEBrZXlmb3JnZS5haSIsInVzZXJOYW1lIjoiSEFSSVNIIiwiZGlzcGxheU5hbWUiOiJIYXJpc2ggSmFuZ2FkYSIsImZpcnN0TmFtZSI6IkhhcmlzaCIsInBhc3N3b3JkIjoiNTQ3OmRiZmViZjUwYmVkYTJhNjkxNDJmNWZkOWRmYTk0MTA5OmNhZTA5YmViMmE3NmU0MzZjZWVmNDQwZWU4ZDBhM2FkOGZjMzM0OTI3MjMxNWRiN2I0Y2RkYjdlN2QzOWQ1NDY2NzMxZWI4YTgwYTdjMjZiMzRiZDkwYjRlYzc3NDIwODFiNTk2MDI0M2Q0NGExOTg4YTg2ZTk5YTliNzZmYzdmIiwibGFzdE5hbWUiOiJKYW5nYWRhIn19.baSbluO0ZxAFHf9IaD1lsuZsfp1Lib-_N40U2EFSoQo; uidTenant=%7B%22userid%22%3A%22HARISH%22%2C%22tenantId%22%3A%22ACMECOM%22%7D; reviewerId=d0d1d45a-7c6f-411a-8675-89756b0aecf7; userAdminRoles=Domain%20Administrator; jwtToken=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhcGl2YWxpZGF0aW9uIiwiaWF0IjoxNzcwOTQxNDMwLCJleHAiOjE3NzA5NDUwMzB9.6SoA1MW-ONhzeVsLp85Jmg3_MNXK8m-_Y75SeAE64l4";

export function getAGBearerToken(): string | null {
  const raw = process.env.AG_ACCESS_REQUESTS_BEARER_TOKEN || AG_TOKEN_HARDCODED;
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
