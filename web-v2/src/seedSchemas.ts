/**
 * Batch-extract schemas for the most recent versions in src/versions.ts.
 *
 * Usage:
 *   npm run seed:schemas -- 5      most recent 5
 *   npm run seed:schemas           all versions in versions.ts
 *   npm run seed:schemas -- 5 --force
 *
 * WEBVERSIONS is newest-first, so "most recent N" is the head of the list.
 * Versions already present in schemas/ are skipped unless --force is passed,
 * which makes a partial run cheap to resume.
 */

import * as fs from "fs";
import * as path from "path";
import { extractVersion } from "./extract";
import { WEBVERSIONS } from "./versions";

const SCHEMA_DIR = path.resolve(__dirname, "../schemas");

function main() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const countArg = args.find((a) => !a.startsWith("--"));

  let count = WEBVERSIONS.length;
  if (countArg !== undefined) {
    count = Number(countArg);
    if (!Number.isInteger(count) || count < 1) {
      console.error(`Invalid count: ${countArg}`);
      console.error("Usage: npm run seed:schemas -- <count> [--force]");
      process.exit(1);
    }
    count = Math.min(count, WEBVERSIONS.length);
  }

  const versions = WEBVERSIONS.slice(0, count);

  console.log(`\n╔═══ Seeding ${versions.length} schema(s) ═══`);
  console.log(`║ ${versions.join(", ")}`);
  console.log(`╚${force ? " (--force: re-extracting existing)" : ""}`);

  const succeeded: string[] = [];
  const skipped: string[] = [];
  const failed: { version: string; error: string }[] = [];

  for (const [index, version] of versions.entries()) {
    const outPath = path.join(SCHEMA_DIR, `${version}.json`);

    if (!force && fs.existsSync(outPath)) {
      console.log(`\n[${index + 1}/${versions.length}] ${version} — already extracted, skipping.`);
      skipped.push(version);
      continue;
    }

    console.log(`\n[${index + 1}/${versions.length}] ${version}`);

    try {
      extractVersion(version);
      succeeded.push(version);
    } catch (error: any) {
      // One bad version shouldn't abandon the rest of the batch.
      console.error(`✗ ${version} failed: ${error.message}`);
      failed.push({ version, error: error.message });
    }
  }

  console.log(`\n╔═══ BATCH SUMMARY ═══`);
  console.log(`║ Extracted: ${succeeded.length}${succeeded.length ? ` (${succeeded.join(", ")})` : ""}`);
  if (skipped.length) {
    console.log(`║ Skipped:   ${skipped.length} (${skipped.join(", ")})`);
  }
  if (failed.length) {
    console.log(`║ Failed:    ${failed.length}`);
    for (const f of failed) console.log(`║   ${f.version}: ${f.error}`);
  }
  console.log(`╚═════════════════════`);

  if (failed.length) process.exit(1);
}

main();
