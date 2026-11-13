import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Entry point for the make.fun coolest-art-01 competition.
// The artwork lives beside this file as entry.png; this program
// copies it into the output directory the harness provides.
const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const target = join(outputDir, "entry.png");

if (!existsSync(source)) {
  throw new Error(`entry.png not found next to main.ts (${source})`);
}
mkdirSync(outputDir, { recursive: true });
copyFileSync(source, target);

// Post-copy check: the output must be a real, non-empty image inside the
// competition's 1 MiB limit, or the run has failed loudly instead of
// silently shipping a broken file.
const copiedBytes = statSync(target).size;
if (copiedBytes === 0 || copiedBytes > 1048576) {
  throw new Error(`copied entry.png is ${copiedBytes} bytes, outside the 1..1048576 range`);
}
console.log(`Wrote ${target} (${copiedBytes} bytes)`);
