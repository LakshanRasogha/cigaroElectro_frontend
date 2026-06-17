import type { MetadataRoute } from "next";
import { fetchAllProductsSafe } from "@/app/lib/catalog";
import { absoluteUrl, categoryLandingPages } from "@/app/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await fetchAllProductsSafe();

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

  return [...staticPages, ...utilityPages, ...categoryPages, ...productPages];
}