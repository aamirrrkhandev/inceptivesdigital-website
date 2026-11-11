import type { NextConfig } from "next";
import redirects from "./content/redirects.json";
const indexingAllowed =
  process.env.ALLOW_INDEXING === "true" &&
  (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production");
const config: NextConfig = {
  distDir: process.env.MIGRATION_BUILD_DIR || ".next",
  skipTrailingSlashRedirect: true,
  outputFileTracingIncludes: { "/*": ["./src/page-content/**/*.json", "./src/page-content/**/*.css"] },
  async rewrites() {
    return [
      {
        source: "/",
        has: [{ type: "query", key: "s", value: "(?<query>.*)" }],
        destination: "/search?s=:query",
      },
    ];
  },
  async redirects() {
    // Keep historical links as single-hop redirects to their approved destination.
    return redirects.map((r) => ({
      ...r,
      statusCode: r.statusCode as 301 | 302 | 303 | 307 | 308,
    }));
  },
  async headers() {
    if (indexingAllowed) return [];
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
    ];
  },
};
export default config;
