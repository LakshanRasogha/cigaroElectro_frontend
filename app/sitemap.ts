import type { MetadataRoute } from "next";
import { fetchAllProductsSafe } from "@/app/lib/catalog";
import { absoluteUrl, categoryLandingPages } from "@/app/lib/site";

const requiredProductPages = [
  {
    slug: "elfbar-raya-d1",
    lastModified: "2026-06-13T12:38:04.970Z",
  },
  {
    slug: "vozol-vista-20k",
    lastModified: "2026-06-13T14:35:11.608Z",
  },
  {
    slug: "elfbar-raya-d3-25k",
    lastModified: "2026-06-13T14:40:36.425Z",
  },
  {
    slug: "elfbar-planet-space-edition-25k",
    lastModified: "2026-06-13T14:49:13.505Z",
  },
  {
    slug: "elfbar-ice-king-30k",
    lastModified: "2026-06-13T14:54:20.698Z",
  },
  {
    slug: "elfbar-trio-30k",
    lastModified: "2026-06-13T14:56:59.885Z",
  },
  {
    slug: "nasty-bolt-50k",
    lastModified: "2026-06-16T23:19:44.890Z",
  },
  {
    slug: "vozol-gear-ice-sweet-50k",
    lastModified: "2026-06-16T23:21:36.879Z",
  },
  {
    slug: "sonder-q2-geek-vape",
    lastModified: "2026-06-16T23:24:19.950Z",
  },
  {
    slug: "wenex-q-geekvape",
    lastModified: "2026-06-16T23:26:11.640Z",
  },
  {
    slug: "qpods",
    lastModified: "2026-06-16T23:28:11.992Z",
  },
  {
    slug: "nasty-liquids",
    lastModified: "2026-06-16T23:33:03.875Z",
  },
  {
    slug: "vozol-salt-liquids",
    lastModified: "2026-06-16T23:37:50.917Z",
  },
  {
    slug: "silvaper-salt-liquids",
    lastModified: "2026-06-16T23:39:42.085Z",
  },
  {
    slug: "i-love-salt-liquids",
    lastModified: "2026-06-16T23:42:19.046Z",
  },
  {
    slug: "vgod-salt-liquids",
    lastModified: "2026-06-16T23:44:25.694Z",
  },
  {
    slug: "tokyo-classic-liquids",
    lastModified: "2026-06-16T23:47:03.292Z",
  },
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await fetchAllProductsSafe();

  // ── Core Indexable Static Pages ─────────────────────────────────────────────
  // ── Core Indexable Static Pages ─────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: absoluteUrl("/collections"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/contact"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // ── Non-Indexable Utility Pages (Crawl Control Segregation) ──────────────────
  // Included per explicit system structural requirements. 
  // NOTE: Wastes crawl budget if prioritized; kept at minimum structural weight.
  const utilityPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/cart"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/auth/login"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/auth/login/privacy-policy"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/auth/login/free-membership-agreement"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/auth/Signin"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // ── Category Landing Pages ─────────────────────────────────────────────────
  // High priority — these are the main SEO entry points for product discovery.
  const categoryPages: MetadataRoute.Sitemap = categoryLandingPages.map(
    (page) => ({
      url: absoluteUrl(`/collections/category/${page.slug}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }),
  );

  // ── Individual Product Pages ───────────────────────────────────────────────
  // Use the real updatedAt timestamp when available so Google knows freshness.
  const productPages: MetadataRoute.Sitemap = products.map((product) => {
    const updatedAt =
      (product as { updatedAt?: string }).updatedAt ??
      (product as { updated_at?: string }).updated_at;

    return {
      url: absoluteUrl(`/collections/${product.slug || product.key}`),
      lastModified: updatedAt ? new Date(updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    };
  });

  const productPageUrls = new Set(productPages.map((page) => page.url));
  const requiredProductFallbackPages: MetadataRoute.Sitemap =
    requiredProductPages
      .filter((page) => !productPageUrls.has(absoluteUrl(`/collections/${page.slug}`)))
      .map((page) => ({
        url: absoluteUrl(`/collections/${page.slug}`),
        lastModified: new Date(page.lastModified),
        changeFrequency: "weekly" as const,
        priority: 0.85,
      }));

  return [
    ...staticPages,
    ...utilityPages,
    ...categoryPages,
    ...productPages,
    ...requiredProductFallbackPages,
  ];
}
