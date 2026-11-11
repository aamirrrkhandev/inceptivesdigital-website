import "server-only";
import { createHash } from "node:crypto";

// This stores HTML only after the caller has checked the current published REST
// record. It is never a fallback for a deleted/unpublished or unavailable post.
const html = new Map<string, { expires: number; value: Promise<string> }>();
export function beginColdArticleRead(path: string, read: () => Promise<string>) {
  if ([...html].some(([key, entry]) => key.startsWith(path + ":") && entry.expires > Date.now())) return undefined;
  // Always settle speculative errors: deleted posts must not produce an
  // unhandled rejection while the authoritative published-record check runs.
  return read().then(value => ({ html: value }), () => ({ html: undefined }));
}
export function readCurrentArticleHTML(path: string, currentRecord: unknown, read: () => Promise<string>) {
  const key = path + ":" + createHash("sha256").update(JSON.stringify(currentRecord)).digest("hex");
  const existing = html.get(key);
  if (existing && existing.expires > Date.now()) return existing.value;
  if (html.size >= 32) html.delete(html.keys().next().value!);
  const value = read().then(result => {
    if (Buffer.byteLength(result) > 2_000_000) html.delete(key);
    return result;
  }).catch(error => { html.delete(key); throw error; });
  html.set(key, { expires: Date.now() + 60_000, value });
  return value;
}
