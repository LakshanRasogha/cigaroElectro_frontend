/**
 * PageSpeed Insights audit script for production URLs.
 *
 * Usage:
 *   GOOGLE_API_KEY=your_key node scripts/pagespeed-audit.mjs
 *
 * Requires the root-level `googleapis` package.
 */

import { google } from "googleapis";

const SITE_URL = process.env.SITE_URL || "https://cigarroelectrico.com";
const API_KEY = process.env.GOOGLE_API_KEY;

const AUDIT_PATHS = [
  "/",
  "/collections",
  "/collections/category/vapes",
  "/about",
  "/contact",
];

const THRESHOLDS = {
  lcpMs: 2500,
  cls: 0.1,
  performanceScore: 0.85,
  seoScore: 0.9,
};

async function auditUrl(pagespeed, url) {
  const response = await pagespeed.pagespeedapi.runpagespeed({
    url,
    key: API_KEY,
    strategy: "mobile",
    category: ["performance", "seo"],
  });

  const lighthouse = response.data.lighthouseResult;
  const audits = lighthouse?.audits ?? {};
  const categories = lighthouse?.categories ?? {};

  const lcp = audits["largest-contentful-paint"]?.numericValue ?? Infinity;
  const cls = audits["cumulative-layout-shift"]?.numericValue ?? Infinity;
  const performance = categories.performance?.score ?? 0;
  const seo = categories.seo?.score ?? 0;

  const passed =
    lcp <= THRESHOLDS.lcpMs &&
    cls <= THRESHOLDS.cls &&
    performance >= THRESHOLDS.performanceScore &&
    seo >= THRESHOLDS.seoScore;

  return {
    url,
    lcpMs: Math.round(lcp),
    cls: Number(cls.toFixed(3)),
    performanceScore: Number(performance.toFixed(2)),
    seoScore: Number(seo.toFixed(2)),
    passed,
  };
}

async function main() {
  if (!API_KEY) {
    console.error("GOOGLE_API_KEY environment variable is required.");
    process.exit(1);
  }

  const pagespeed = google.pagespeedonline({ version: "v5" });
  const results = [];

  for (const path of AUDIT_PATHS) {
    const url = `${SITE_URL.replace(/\/+$/, "")}${path}`;
    try {
      const result = await auditUrl(pagespeed, url);
      results.push(result);
      const status = result.passed ? "PASS" : "FAIL";
      console.log(
        `[${status}] ${url} — LCP: ${result.lcpMs}ms | CLS: ${result.cls} | Perf: ${result.performanceScore} | SEO: ${result.seoScore}`,
      );
    } catch (error) {
      console.error(`[ERROR] ${url}:`, error.message);
      results.push({ url, passed: false, error: error.message });
    }
  }

  const failed = results.filter((result) => !result.passed);
  if (failed.length > 0) {
    console.error(`\n${failed.length} URL(s) failed thresholds.`);
    process.exit(1);
  }

  console.log("\nAll URLs passed Core Web Vitals and SEO thresholds.");
}

main();
