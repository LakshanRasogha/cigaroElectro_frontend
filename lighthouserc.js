/** @type {import('lighthouse').Flags} */
const lighthouseFlags = {
  onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
};

/** @type {import('lighthouse').Config} */
const lighthouseConfig = {
  extends: "lighthouse:default",
  settings: {
    formFactor: "mobile",
    screenEmulation: {
      mobile: true,
      width: 412,
      height: 823,
      deviceScaleFactor: 2.625,
    },
    throttling: {
      rttMs: 150,
      throughputKbps: 1638.4,
      cpuSlowdownMultiplier: 4,
    },
  },
};

/** @type {import('@lhci/cli').LighthouseCiConfig} */
module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run start",
      startServerReadyPattern: "Ready",
      startServerReadyTimeout: 120000,
      url: [
        "http://localhost:3000/",
        "http://localhost:3000/collections",
        "http://localhost:3000/collections/category/vapes",
        "http://localhost:3000/about",
        "http://localhost:3000/contact",
      ],
      numberOfRuns: 3,
      settings: lighthouseConfig.settings,
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.85 }],
        "categories:accessibility": ["warn", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.9 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["warn", { maxNumericValue: 300 }],
        "interactive": ["warn", { maxNumericValue: 4500 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
  flags: lighthouseFlags,
};
