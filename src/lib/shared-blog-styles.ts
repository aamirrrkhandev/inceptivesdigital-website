import "server-only";
import { createHash } from "node:crypto";
import styles from "../../content/shared-blog-styles.json";

// Only exact, byte-identical approved CSS uses an immutable shared asset.
// New WordPress styles fall back to inline output immediately, without a build.
export function sharedBlogStyles(path: string, css: string) {
  if (!/^\/(?:blog|press-release)(?:\/|$)/.test(path)) return undefined;
  return (styles as Record<string, string>)[createHash("sha256").update(css).digest("hex")];
}
