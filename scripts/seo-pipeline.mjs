#!/usr/bin/env node
/**
 * SEO optimization pipeline — collects GSC + CrUX data, stores weekly snapshots,
 * computes opportunity scores, and outputs a prioritized action report.
 *
 * Usage:
 *   node scripts/seo-pipeline.mjs                    # full run
 *   node scripts/seo-pipeline.mjs --report-only      # just re-compute from latest snapshot
 *
 * Setup:
 *   1. Create a GCP service account with Search Console API + PageSpeed Insights access
 *   2. Download the JSON key and set: export GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json
 *   3. Add the service account email as a user in GSC for your property
 *   4. (Optional) Set CRUX_API_KEY for CrUX — works without it but rate-limited
 */

import { google } from "googleapis";
import { writeFileSync, mkdirSync, readFileSync, existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data", "seo");
const SITE_URL = "https://www.tovy.eu";
const GSC_PROPERTY = "sc-domain:tovy.eu"; // domain-level property in GSC
const LOCALES = ["en", "nl", "es", "de", "fr"];

// Expected CTR by position (industry averages for organic search)
const EXPECTED_CTR = {
  1: 0.30, 2: 0.15, 3: 0.10, 4: 0.07, 5: 0.05,
  6: 0.04, 7: 0.03, 8: 0.025, 9: 0.02, 10: 0.015,
};

// ── Auth ──────────────────────────────────────────────────────────────────────

async function getAuthClient() {
  const auth = new google.auth.GoogleAuth({
    scopes: [
      "https://www.googleapis.com/auth/webmasters.readonly",
    ],
  });
  return auth.getClient();
}

// ── GSC: Search Analytics ─────────────────────────────────────────────────────

async function fetchGSCData(authClient, startDate, endDate) {
  const searchconsole = google.searchconsole({ version: "v1", auth: authClient });

  // Queries by page + query + country + device
  const response = await searchconsole.searchanalytics.query({
    siteUrl: GSC_PROPERTY,
    requestBody: {
      startDate,
      endDate,
      dimensions: ["query", "page", "country", "device"],
      rowLimit: 5000,
      // ponytail: 5000 rows is the API max per request. Enough for a small consultancy site.
    },
  });

  return response.data.rows || [];
}

// Separate query: pages only (for pages that get impressions but no query data)
async function fetchGSCPageData(authClient, startDate, endDate) {
  const searchconsole = google.searchconsole({ version: "v1", auth: authClient });

  const response = await searchconsole.searchanalytics.query({
    siteUrl: GSC_PROPERTY,
    requestBody: {
      startDate,
      endDate,
      dimensions: ["page"],
      rowLimit: 500,
    },
  });

  return response.data.rows || [];
}

// ── GSC: Index Coverage ───────────────────────────────────────────────────────

async function fetchIndexStatus(authClient) {
  const searchconsole = google.searchconsole({ version: "v1", auth: authClient });

  // URL Inspection API: check key pages
  const pages = [];
  for (const locale of LOCALES) {
    pages.push(`${SITE_URL}/${locale}/`);
    pages.push(`${SITE_URL}/${locale}/project-request/`);
  }

  const results = [];
  for (const url of pages) {
    try {
      const res = await searchconsole.urlInspection.index.inspect({
        requestBody: {
          inspectionUrl: url,
          siteUrl: GSC_PROPERTY,
        },
      });
      results.push({
        url,
        verdict: res.data.inspectionResult?.indexStatusResult?.verdict,
        coverageState: res.data.inspectionResult?.indexStatusResult?.coverageState,
        crawledAs: res.data.inspectionResult?.indexStatusResult?.crawledAs,
        lastCrawlTime: res.data.inspectionResult?.indexStatusResult?.lastCrawlTime,
        mobileFriendly: res.data.inspectionResult?.mobileUsabilityResult?.verdict,
      });
    } catch (err) {
      results.push({ url, error: err.message });
    }
  }

  return results;
}

// ── CrUX / PageSpeed Insights ─────────────────────────────────────────────────

async function fetchPageSpeedData(url) {
  const apiKey = process.env.CRUX_API_KEY || process.env.PAGESPEED_API_KEY || "";
  // URLSearchParams.set overwrites — use append for multiple category values
  const apiUrl = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  apiUrl.searchParams.set("url", url);
  apiUrl.searchParams.set("strategy", "mobile");
  apiUrl.searchParams.append("category", "performance");
  apiUrl.searchParams.append("category", "accessibility");
  apiUrl.searchParams.append("category", "seo");
  if (apiKey) apiUrl.searchParams.set("key", apiKey);

  try {
    const res = await fetch(apiUrl.toString());
    if (!res.ok) return { url, error: `HTTP ${res.status}` };
    const data = await res.json();

    const crux = data.loadingExperience?.metrics || {};
    const lighthouse = data.lighthouseResult?.categories || {};

    return {
      url,
      // Field data (real users, 28-day rolling)
      field: {
        lcp_ms: crux.LARGEST_CONTENTFUL_PAINT_MS?.percentile,
        lcp_category: crux.LARGEST_CONTENTFUL_PAINT_MS?.category,
        cls: crux.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile,
        cls_category: crux.CUMULATIVE_LAYOUT_SHIFT_SCORE?.category,
        inp_ms: crux.INTERACTION_TO_NEXT_PAINT?.percentile,
        inp_category: crux.INTERACTION_TO_NEXT_PAINT?.category,
        fcp_ms: crux.FIRST_CONTENTFUL_PAINT_MS?.percentile,
        fcp_category: crux.FIRST_CONTENTFUL_PAINT_MS?.category,
        ttfb_ms: crux.EXPERIMENTAL_TIME_TO_FIRST_BYTE?.percentile,
      },
      // Lab data (Lighthouse scores 0-100)
      lab: {
        performance: lighthouse.performance?.score ? Math.round(lighthouse.performance.score * 100) : null,
        accessibility: lighthouse.accessibility?.score ? Math.round(lighthouse.accessibility.score * 100) : null,
        seo: lighthouse.seo?.score ? Math.round(lighthouse.seo.score * 100) : null,
      },
    };
  } catch (err) {
    return { url, error: err.message };
  }
}

async function fetchAllPageSpeed() {
  // Check key pages per locale (rate limit: space requests)
  const urls = LOCALES.map(l => `${SITE_URL}/${l}/`);
  // Also check project-request for the default locale
  urls.push(`${SITE_URL}/en/project-request/`);

  const results = [];
  for (const url of urls) {
    console.log(`  PSI: ${url}`);
    results.push(await fetchPageSpeedData(url));
    // ponytail: naive 2s delay to avoid rate limiting. Parallel+backoff if this matters.
    await new Promise(r => setTimeout(r, 2000));
  }
  return results;
}

// ── Analysis: Opportunity Scoring ─────────────────────────────────────────────

function computeOpportunities(gscRows) {
  // Aggregate by page (sum impressions/clicks across queries)
  const byPage = {};
  for (const row of gscRows) {
    const page = row.keys[1]; // [query, page, country, device]
    if (!byPage[page]) {
      byPage[page] = { page, impressions: 0, clicks: 0, positionSum: 0, rows: 0, queries: new Set() };
    }
    byPage[page].impressions += row.impressions;
    byPage[page].clicks += row.clicks;
    byPage[page].positionSum += row.position * row.impressions; // weighted
    byPage[page].rows += 1;
    byPage[page].queries.add(row.keys[0]);
  }

  const opportunities = Object.values(byPage).map(p => {
    const avgPosition = p.positionSum / p.impressions;
    const actualCTR = p.impressions > 0 ? p.clicks / p.impressions : 0;
    const positionBucket = Math.min(Math.max(Math.round(avgPosition), 1), 10);
    const targetCTR = EXPECTED_CTR[positionBucket] || 0.01;
    const ctrGap = Math.max(0, targetCTR - actualCTR);
    const opportunity = p.impressions * ctrGap;

    return {
      page: p.page,
      impressions: p.impressions,
      clicks: p.clicks,
      avgPosition: Math.round(avgPosition * 10) / 10,
      actualCTR: Math.round(actualCTR * 1000) / 10, // percentage
      targetCTR: Math.round(targetCTR * 1000) / 10,
      ctrGap: Math.round(ctrGap * 1000) / 10,
      opportunity: Math.round(opportunity),
      uniqueQueries: p.queries.size,
    };
  });

  return opportunities.sort((a, b) => b.opportunity - a.opportunity);
}

// Striking distance keywords: position 4-20, decent impressions
function findStrikingDistance(gscRows) {
  // Aggregate by query
  const byQuery = {};
  for (const row of gscRows) {
    const query = row.keys[0];
    if (!byQuery[query]) {
      byQuery[query] = { query, impressions: 0, clicks: 0, positionSum: 0, pages: new Set() };
    }
    byQuery[query].impressions += row.impressions;
    byQuery[query].clicks += row.clicks;
    byQuery[query].positionSum += row.position * row.impressions;
    byQuery[query].pages.add(row.keys[1]);
  }

  return Object.values(byQuery)
    .map(q => {
      const avgPosition = q.positionSum / q.impressions;
      const ctr = q.impressions > 0 ? q.clicks / q.impressions : 0;
      return {
        query: q.query,
        impressions: q.impressions,
        clicks: q.clicks,
        avgPosition: Math.round(avgPosition * 10) / 10,
        ctr: Math.round(ctr * 1000) / 10,
        pages: [...q.pages],
      };
    })
    .filter(q => q.avgPosition >= 4 && q.avgPosition <= 20 && q.impressions >= 5)
    .sort((a, b) => b.impressions - a.impressions);
}

// ── Report Generation ─────────────────────────────────────────────────────────

function generateReport(snapshot) {
  const lines = [];
  const date = snapshot.metadata.date;

  lines.push(`# SEO Pipeline Report — ${date}`);
  lines.push(`Period: ${snapshot.metadata.startDate} to ${snapshot.metadata.endDate}`);
  lines.push("");

  // 1. Page Opportunities
  lines.push("## 1. Page Opportunities (CTR gap × impressions)");
  lines.push("");
  if (snapshot.opportunities?.length) {
    lines.push("| Page | Impr | Clicks | Pos | CTR% | Target% | Gap% | Score | Queries |");
    lines.push("|------|------|--------|-----|------|---------|------|-------|---------|");
    for (const o of snapshot.opportunities.slice(0, 20)) {
      const short = o.page.replace(SITE_URL, "");
      lines.push(`| ${short} | ${o.impressions} | ${o.clicks} | ${o.avgPosition} | ${o.actualCTR} | ${o.targetCTR} | ${o.ctrGap} | **${o.opportunity}** | ${o.uniqueQueries} |`);
    }
  } else {
    lines.push("No data available.");
  }
  lines.push("");

  // 2. Striking Distance Keywords
  lines.push("## 2. Striking Distance Keywords (position 4-20)");
  lines.push("");
  if (snapshot.strikingDistance?.length) {
    lines.push("| Query | Impr | Clicks | Pos | CTR% | Pages |");
    lines.push("|-------|------|--------|-----|------|-------|");
    for (const q of snapshot.strikingDistance.slice(0, 30)) {
      lines.push(`| ${q.query} | ${q.impressions} | ${q.clicks} | ${q.avgPosition} | ${q.ctr} | ${q.pages.length} |`);
    }
  } else {
    lines.push("No striking distance keywords found.");
  }
  lines.push("");

  // 3. Index Status
  lines.push("## 3. Index Status");
  lines.push("");
  if (snapshot.indexStatus?.length) {
    lines.push("| URL | Verdict | Coverage | Last Crawl | Mobile |");
    lines.push("|-----|---------|----------|------------|--------|");
    for (const p of snapshot.indexStatus) {
      if (p.error) {
        lines.push(`| ${p.url.replace(SITE_URL, "")} | ERROR | ${p.error} | — | — |`);
      } else {
        lines.push(`| ${p.url.replace(SITE_URL, "")} | ${p.verdict || "?"} | ${p.coverageState || "?"} | ${p.lastCrawlTime?.slice(0, 10) || "?"} | ${p.mobileFriendly || "?"} |`);
      }
    }
  }
  lines.push("");

  // 4. Core Web Vitals
  lines.push("## 4. Core Web Vitals & Lighthouse");
  lines.push("");
  if (snapshot.pageSpeed?.length) {
    lines.push("| Page | LCP (ms) | CLS | INP (ms) | Perf | A11y | SEO |");
    lines.push("|------|----------|-----|----------|------|------|-----|");
    for (const p of snapshot.pageSpeed) {
      if (p.error) {
        lines.push(`| ${p.url.replace(SITE_URL, "")} | ERROR: ${p.error} | | | | | |`);
      } else {
        lines.push(`| ${p.url.replace(SITE_URL, "")} | ${p.field?.lcp_ms ?? "—"} (${p.field?.lcp_category ?? "?"}) | ${p.field?.cls ?? "—"} | ${p.field?.inp_ms ?? "—"} | ${p.lab?.performance ?? "—"} | ${p.lab?.accessibility ?? "—"} | ${p.lab?.seo ?? "—"} |`);
      }
    }
  }
  lines.push("");

  // 5. Action Items
  lines.push("## 5. Suggested Actions");
  lines.push("");
  const actions = [];

  // High-opportunity pages
  const topOpps = (snapshot.opportunities || []).filter(o => o.opportunity > 0).slice(0, 5);
  for (const o of topOpps) {
    const short = o.page.replace(SITE_URL, "");
    if (o.ctrGap > 5) {
      actions.push(`- **Rewrite title/meta** for \`${short}\` — CTR is ${o.actualCTR}% vs ${o.targetCTR}% expected at position ${o.avgPosition} (${o.impressions} impressions)`);
    } else if (o.avgPosition > 5) {
      actions.push(`- **Add content depth** to \`${short}\` — position ${o.avgPosition}, could gain ${o.opportunity} clicks with better ranking`);
    }
  }

  // Poor Core Web Vitals
  for (const p of snapshot.pageSpeed || []) {
    if (p.field?.lcp_category === "SLOW") {
      actions.push(`- **Fix LCP** on \`${p.url.replace(SITE_URL, "")}\` — ${p.field.lcp_ms}ms (SLOW)`);
    }
    if (p.field?.cls_category === "SLOW" || (p.field?.cls && p.field.cls > 25)) {
      actions.push(`- **Fix CLS** on \`${p.url.replace(SITE_URL, "")}\` — score ${p.field.cls}`);
    }
    if (p.lab?.accessibility && p.lab.accessibility < 90) {
      actions.push(`- **Fix accessibility** on \`${p.url.replace(SITE_URL, "")}\` — Lighthouse a11y: ${p.lab.accessibility}/100`);
    }
  }

  // Index issues
  for (const p of snapshot.indexStatus || []) {
    if (p.verdict && p.verdict !== "PASS" && !p.error) {
      actions.push(`- **Fix index issue** for \`${p.url.replace(SITE_URL, "")}\` — verdict: ${p.verdict}, coverage: ${p.coverageState}`);
    }
  }

  if (actions.length) {
    lines.push(...actions);
  } else {
    lines.push("No urgent actions identified. Keep monitoring.");
  }

  lines.push("");
  lines.push("---");
  lines.push("*Generated by `scripts/seo-pipeline.mjs`*");

  return lines.join("\n");
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const reportOnly = process.argv.includes("--report-only");

  mkdirSync(DATA_DIR, { recursive: true });

  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10);

  if (reportOnly) {
    // Find latest snapshot
    const files = readdirSync(DATA_DIR).filter(f => f.startsWith("snapshot-") && f.endsWith(".json")).sort();
    if (!files.length) {
      console.error("No snapshots found. Run without --report-only first.");
      process.exit(1);
    }
    const latest = JSON.parse(readFileSync(join(DATA_DIR, files.at(-1)), "utf-8"));
    const report = generateReport(latest);
    const reportPath = join(DATA_DIR, `report-${dateStr}.md`);
    writeFileSync(reportPath, report);
    console.log(`Report written to ${reportPath}`);
    return;
  }

  // Date range: last 28 days (GSC standard window)
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() - 3); // GSC data has ~3 day lag
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 28);

  const startStr = startDate.toISOString().slice(0, 10);
  const endStr = endDate.toISOString().slice(0, 10);

  console.log(`SEO Pipeline — ${dateStr}`);
  console.log(`GSC period: ${startStr} to ${endStr}`);
  console.log("");

  // 1. GSC data
  console.log("1/4 Fetching GSC search analytics...");
  const authClient = await getAuthClient();
  const gscRows = await fetchGSCData(authClient, startStr, endStr);
  const gscPageRows = await fetchGSCPageData(authClient, startStr, endStr);
  console.log(`  ${gscRows.length} query rows, ${gscPageRows.length} page rows`);

  // 2. Index status
  console.log("2/4 Checking index status...");
  const indexStatus = await fetchIndexStatus(authClient);
  console.log(`  ${indexStatus.length} pages checked`);

  // 3. PageSpeed / CrUX
  console.log("3/4 Fetching PageSpeed Insights...");
  const pageSpeed = await fetchAllPageSpeed();
  console.log(`  ${pageSpeed.length} pages analyzed`);

  // 4. Compute opportunities
  console.log("4/4 Computing opportunities...");
  const opportunities = computeOpportunities(gscRows);
  const strikingDistance = findStrikingDistance(gscRows);

  // Store snapshot
  const snapshot = {
    metadata: { date: dateStr, startDate: startStr, endDate: endStr, site: SITE_URL },
    gscQueryData: gscRows,
    gscPageData: gscPageRows,
    indexStatus,
    pageSpeed,
    opportunities,
    strikingDistance,
  };

  const snapshotPath = join(DATA_DIR, `snapshot-${dateStr}.json`);
  writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2));
  console.log(`\nSnapshot saved: ${snapshotPath}`);

  // Generate report
  const report = generateReport(snapshot);
  const reportPath = join(DATA_DIR, `report-${dateStr}.md`);
  writeFileSync(reportPath, report);
  console.log(`Report saved: ${reportPath}`);

  // Print summary to terminal
  console.log("\n" + "=".repeat(60));
  console.log(report);
}

main().catch(err => {
  console.error("Pipeline failed:", err.message);
  process.exit(1);
});
