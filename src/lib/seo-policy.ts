// Preview indexing must stay disabled even if an indexing variable is copied.
export const indexingAllowed =
  process.env.ALLOW_INDEXING === "true" &&
  (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production");

export const canonicalPath = (path: string) =>
  path === "/" ? "/" : path.replace(/\/$/, "");
export const canonicalOverrides: Record<string, string> = {
  "/blog/rightfirms-top-artificial-intelligence-company-2026":
    "/press-release/rightfirms-top-artificial-intelligence-company-2026",
  "/press-release/rightfirms-top-artificial-intelligence-company-2026":
    "/press-release/rightfirms-top-artificial-intelligence-company-2026",
};
export function approvedCanonical(value: string) {
  if (!value) return undefined;
  const url = new URL(value, "https://inceptivesdigital.com");
  if (url.origin !== "https://inceptivesdigital.com") return value;
  url.pathname =
    canonicalOverrides[canonicalPath(url.pathname)] || url.pathname;
  return url.href;
}

export function correctedSchema(value: unknown): unknown {
  if (typeof value === "string")
    return value.replace(
      /^https:\/\/inceptivesdigital\.com\/blog\/rightfirms-top-artificial-intelligence-company-2026(?=\/?(?:#|$))/,
      "https://inceptivesdigital.com/press-release/rightfirms-top-artificial-intelligence-company-2026",
    );
  if (Array.isArray(value)) return value.map(correctedSchema);
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, correctedSchema(item)]),
    );
  return value;
}
