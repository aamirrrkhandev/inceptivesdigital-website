import type { NextConfig } from "next";
import redirects from "./content/redirects.json";
import sharedBlogStyles from "./content/shared-blog-styles.json";
const indexingAllowed =
  process.env.ALLOW_INDEXING === "true" &&
  (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === "production");
const config: NextConfig = {
  distDir: process.env.MIGRATION_BUILD_DIR || ".next",
  skipTrailingSlashRedirect: true,
  outputFileTracingIncludes: { "/*": ["./content/editable-runtime/**/*"] },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "nextincep.wpenginepowered.com", pathname: "/wp-content/uploads/**" }],
  },
  // Original images/video are emitted as static route bodies or public files.
  // Page functions need catalog parts and compact editable data, not media packs
  // or the uncompressed authoring copies of every page.
  outputFileTracingExcludes: { "/*": ["./content/media/**/*", "./src/page-content/**/*"] },
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
    const immutableStyles = Object.values(sharedBlogStyles).map(source => ({
      source,
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
    }));
    if (indexingAllowed) return immutableStyles;
    return [
      ...immutableStyles,
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
