import { describe, it, expect } from "vitest";
import { resolvePageReferrer, ENTRY_REFERRER_KEY } from "./referrer";
import { buildRedirectScript } from "./redirect-script";

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

// The redirect shims build their inline <script> via buildRedirectScript, which reads the
// shared ENTRY_REFERRER_KEY. getPageReferrer reads that same key, so attribution only works
// if the stash writes it. Pin the contract, and that the no-index payment-success path opts out.
describe("buildRedirectScript stashes the entry referrer under the shared key", () => {
  it("writes ENTRY_REFERRER_KEY before redirecting when stashing is enabled", () => {
    expect(buildRedirectScript("")).toContain(`sessionStorage.setItem('${ENTRY_REFERRER_KEY}'`);
  });

  it("omits the referrer stash when disabled (e.g. no-index pages)", () => {
    expect(buildRedirectScript("payment-success/", false)).not.toContain(ENTRY_REFERRER_KEY);
  });

  it("redirects to the locale-prefixed suffix path", () => {
    expect(buildRedirectScript("project-request/")).toContain("'/' + target + '/project-request/'");
  });
});
