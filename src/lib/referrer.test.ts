import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";
import { resolvePageReferrer, ENTRY_REFERRER_KEY } from "./referrer";

const HOST = "www.tovy.eu";

describe("resolvePageReferrer", () => {
  it("prefers the stashed external referrer over a self-referral current value", () => {
    // The classic bug: shim redirect makes document.referrer our own domain.
    expect(
      resolvePageReferrer("https://www.linkedin.com/feed/", "https://www.tovy.eu/", HOST),
    ).toBe("https://www.linkedin.com/feed/");
  });

  it("falls back to the current referrer when nothing is stashed", () => {
    expect(resolvePageReferrer(null, "https://www.google.com/", HOST)).toBe(
      "https://www.google.com/",
    );
  });

  it("ignores a stashed value that is our own domain (not a real external source)", () => {
    expect(resolvePageReferrer("https://www.tovy.eu/en/", "https://www.google.com/", HOST)).toBe(
      "https://www.google.com/",
    );
  });

  it("keeps the first-touch external referrer even if current is also external", () => {
    expect(
      resolvePageReferrer("https://instagram.com/", "https://t.co/", HOST),
    ).toBe("https://instagram.com/");
  });

  it("returns empty string when there is no referrer at all", () => {
    expect(resolvePageReferrer(null, "", HOST)).toBe("");
    expect(resolvePageReferrer("", "", HOST)).toBe("");
  });
});

// The redirect shims run as inline <script> strings and cannot import ENTRY_REFERRER_KEY,
// so they hardcode the storage key. If the constant is ever renamed, getPageReferrer would
// read a key the shims never wrote and attribution would silently break. Pin the contract.
describe("redirect shims stash the entry referrer under the shared key", () => {
  const shims = ["../app/page.tsx", "../app/project-request/page.tsx"];

  it.each(shims)("%s writes ENTRY_REFERRER_KEY before redirecting", (rel) => {
    const src = readFileSync(join(__dirname, rel), "utf8");
    expect(src).toContain(`sessionStorage.setItem('${ENTRY_REFERRER_KEY}'`);
  });
});
