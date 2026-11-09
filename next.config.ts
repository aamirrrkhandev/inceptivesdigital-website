import type { NextConfig } from "next";
import redirects from "./content/redirects.json";
const config: NextConfig = {
  skipTrailingSlashRedirect: true,
  async redirects() {
    return redirects.map((r) => ({
      ...r,
      statusCode: r.statusCode as 301 | 302 | 303 | 307 | 308,
    }));
  },
  async headers() {
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
