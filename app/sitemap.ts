import type { MetadataRoute } from "next";
import { fetchAllProductsSafe } from "@/app/lib/catalog";
import { absoluteUrl, categoryLandingPages } from "@/app/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await fetchAllProductsSafe();

  // ── Static pages ──────────────────────────────────────────────────────────
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
    {
      url: absoluteUrl("/privacy-policy"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: absoluteUrl("/free-membership-agreement"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  // ── Category landing pages ─────────────────────────────────────────────────
  // High priority — these are the main SEO entry points for product discovery.
  const categoryPages: MetadataRoute.Sitemap = categoryLandingPages.map(
    (page) => ({
      url: absoluteUrl(`/collections/category/${page.slug}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }),
  );

  // ── Individual product pages ───────────────────────────────────────────────
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

  return [...staticPages, ...categoryPages, ...productPages];
}
