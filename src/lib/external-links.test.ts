import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";

// Canonical external links — update here when they change.
const CANONICAL = {
  personalLinkedin: "https://www.linkedin.com/in/giel-nijkamp-ab370447/",
  companyLinkedin: "https://www.linkedin.com/company/tovy/",
  personalGithub: "https://github.com/GielNijkamp",
  companyGithub: "https://github.com/tovy-eu",
};

const CONTENT_DIR = join(__dirname, "../content");
const DICT_DIR = join(__dirname, "../dictionaries");

function readJsonFiles(dir: string): { file: string; text: string }[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({ file: f, text: readFileSync(join(dir, f), "utf8") }));
}

function extractUrls(text: string, domain: string): string[] {
  const re = new RegExp(`https?://[^"\\s]*${domain.replace(".", "\\.")}[^"\\s]*`, "g");
  return [...new Set(text.match(re) ?? [])];
}

describe("external links: linkedin", () => {
  const allSources = [...readJsonFiles(CONTENT_DIR), ...readJsonFiles(DICT_DIR)];

  it("all LinkedIn URLs in content/dictionaries match canonical values", () => {
    const allowed = new Set([CANONICAL.personalLinkedin, CANONICAL.companyLinkedin]);
    for (const { file, text } of allSources) {
      const urls = extractUrls(text, "linkedin.com");
      for (const url of urls) {
        expect(url, `unexpected LinkedIn URL in ${file}`).toSatisfy((u: string) => allowed.has(u));
      }
    }
  });

  it("company-profile.json contains the correct company LinkedIn", () => {
    const text = readFileSync(join(CONTENT_DIR, "company-profile.json"), "utf8");
    expect(text).toContain(CANONICAL.companyLinkedin);
  });
});

describe("external links: github", () => {
  const allSources = [...readJsonFiles(CONTENT_DIR), ...readJsonFiles(DICT_DIR)];

  it("all GitHub URLs in content/dictionaries match canonical values", () => {
    const allowed = new Set([CANONICAL.personalGithub, CANONICAL.companyGithub]);
    for (const { file, text } of allSources) {
      const urls = extractUrls(text, "github.com");
      for (const url of urls) {
        expect(url, `unexpected GitHub URL in ${file}`).toSatisfy((u: string) => allowed.has(u));
      }
    }
  });

  it("company-profile.json contains the correct company GitHub", () => {
    const text = readFileSync(join(CONTENT_DIR, "company-profile.json"), "utf8");
    expect(text).toContain(CANONICAL.companyGithub);
  });

  // ponytail: HEAD check for GitHub only — LinkedIn returns 999 for bots
  it("GitHub profile URLs return HTTP 200", async () => {
    for (const url of [CANONICAL.personalGithub, CANONICAL.companyGithub]) {
      const res = await fetch(url, { method: "HEAD", redirect: "follow" });
      expect(res.status, `${url} returned ${res.status}`).toBe(200);
    }
  }, 15_000);
});

describe("external links: google analytics", () => {
  it("GA tag script URL is valid", async () => {
    const trackingSource = readFileSync(join(__dirname, "tracking.ts"), "utf8");
    const match = trackingSource.match(/https:\/\/www\.googletagmanager\.com\/gtag\/js/);
    expect(match, "googletagmanager script URL must exist in tracking.ts").toBeTruthy();

    // Verify the GTM endpoint responds (without a real ID it still returns 200)
    const res = await fetch("https://www.googletagmanager.com/gtag/js?id=G-TEST", {
      method: "HEAD",
    });
    expect(res.status).toBe(200);
  }, 10_000);

  it("GA measurement ID env var is set in CI workflow", () => {
    const workflow = readFileSync(
      join(__dirname, "../../.github/workflows/firebase-deploy.yml"),
      "utf8",
    );
    expect(workflow).toContain("NEXT_PUBLIC_GA_MEASUREMENT_ID");
  });
});
