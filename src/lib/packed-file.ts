import "server-only";
import fs from "node:fs";
import path from "node:path";
import mapping from "../../content/file-parts.json";

// Large source files are split for deployment transport; served bytes stay identical.
export function readPackedFile(file: string, offset = 0, size?: number): Buffer {
  const parts = (mapping as Record<string, string[]>)[file] || [file];
  const lengths = parts.map((part) => fs.statSync(path.join(process.cwd(), part)).size);
  const total = lengths.reduce((sum, length) => sum + length, 0);
  const count = size ?? total - offset;
  if (offset < 0 || count < 0 || offset + count > total) throw new Error("Invalid packed file range");
  const output = Buffer.alloc(count);
  let start = 0;
  let written = 0;
  for (let i = 0; i < parts.length && written < count; i++) {
    const localOffset = Math.max(0, offset - start);
    const length = Math.min(lengths[i] - localOffset, count - written);
    if (length > 0) {
      const fd = fs.openSync(path.join(process.cwd(), parts[i]), "r");
      try {
        let read = 0;
        while (read < length) {
          const received = fs.readSync(fd, output, written + read, length - read, localOffset + read);
          if (!received) throw new Error("Incomplete packed file read");
          read += received;
        }
      } finally { fs.closeSync(fd); }
      written += length;
    }
    start += lengths[i];
  }
  return output;
}
