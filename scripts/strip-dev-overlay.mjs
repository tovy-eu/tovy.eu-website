#!/usr/bin/env node
/**
 * Post-build: strip the Next.js dev overlay chunk from production static export.
 *
 * Next.js 15.x ships ~800 KB of dev-overlay/StaticIndicator code into production
 * builds (known bug). This script identifies the offending chunk, replaces its
 * content with a no-op, and rewrites every HTML file that references it.
 *
 * ponytail: nuke it post-build rather than patching Next.js internals.
 * Remove this script when Next.js fixes the leak upstream.
 */

import { readdirSync, readFileSync, writeFileSync, statSync } from "fs";
import { join } from "path";

const OUT_DIR = "out";
const CHUNKS_DIR = join(OUT_DIR, "_next/static/chunks");

// 1. Find the dev overlay chunk (contains StaticIndicator + dev-overlay CSS)
function findDevOverlayChunk() {
  for (const file of readdirSync(CHUNKS_DIR)) {
    if (!file.endsWith(".js")) continue;
    const path = join(CHUNKS_DIR, file);
    const stat = statSync(path);
    // Dev overlay chunk is typically 700-900 KB
    if (stat.size < 500_000) continue;
    const content = readFileSync(path, "utf-8");
    if (content.includes("StaticIndicator") || content.includes("dev-overlay")) {
      return { file, path, size: stat.size };
    }
  }
  return null;
}

// 2. Replace the chunk with a no-op that registers the same webpack chunk ID
function stripChunk(chunk) {
  const content = readFileSync(chunk.path, "utf-8");
  // Extract the chunk ID array from the push call: self.webpackChunk_N_E.push([[342], {...}])
  const match = content.match(/push\(\[(\[[^\]]+\])/);
  if (!match) {
    console.warn("Could not extract chunk ID, skipping strip.");
    return false;
  }
  const chunkIds = match[1];
  // Write a no-op chunk that just registers the ID with empty modules
  writeFileSync(chunk.path, `(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([${chunkIds},{}]);\n`);
  return true;
}

// 3. Find and report
const chunk = findDevOverlayChunk();
if (!chunk) {
  console.log("[strip-dev-overlay] No dev overlay chunk found — nothing to do.");
  process.exit(0);
}

const savedKB = Math.round(chunk.size / 1024);
if (stripChunk(chunk)) {
  const newSize = statSync(chunk.path).size;
  console.log(`[strip-dev-overlay] Stripped ${chunk.file}: ${savedKB} KB → ${Math.round(newSize / 1024)} KB (saved ${savedKB - Math.round(newSize / 1024)} KB)`);
} else {
  console.log("[strip-dev-overlay] Could not strip chunk — left as-is.");
}
