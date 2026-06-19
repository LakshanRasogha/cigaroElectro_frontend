import type { MetadataRoute } from "next";
import { fetchAllProductsSafe } from "@/app/lib/catalog";
import { absoluteUrl, categoryLandingPages, productSeoHints } from "@/app/lib/site";

const hardcodedProductPages = [
  { slug: "elfbar-raya-d1", lastModified: "2026-06-13T12:38:04.970Z" },
  { slug: "vozol-vista-20k", lastModified: "2026-06-13T14:35:11.608Z" },
  { slug: "elfbar-raya-d3-25k", lastModified: "2026-06-13T14:40:36.425Z" },
  {
    slug: "elfbar-planet-space-edition-25k",
    lastModified: "2026-06-13T14:49:13.505Z",
  },
  { slug: "elfbar-ice-king-30k", lastModified: "2026-06-13T14:54:20.698Z" },
  { slug: "elfbar-trio-30k", lastModified: "2026-06-13T14:56:59.885Z" },
  { slug: "nasty-bolt-50k", lastModified: "2026-06-16T23:19:44.890Z" },
  {
    slug: "vozol-gear-ice-sweet-50k",
    lastModified: "2026-06-16T23:21:36.879Z",
  },
  { slug: "sonder-q2-geek-vape", lastModified: "2026-06-16T23:24:19.950Z" },
  { slug: "wenex-q-geekvape", lastModified: "2026-06-16T23:26:11.640Z" },
  { slug: "qpods", lastModified: "2026-06-16T23:28:11.992Z" },
  { slug: "nasty-liquids", lastModified: "2026-06-16T23:33:03.875Z" },
  { slug: "vozol-salt-liquids", lastModified: "2026-06-16T23:37:50.917Z" },
  { slug: "silvaper-salt-liquids", lastModified: "2026-06-16T23:39:42.085Z" },
  { slug: "i-love-salt-liquids", lastModified: "2026-06-16T23:42:19.046Z" },
  { slug: "vgod-salt-liquids", lastModified: "2026-06-16T23:44:25.694Z" },
  {
    slug: "tokyo-classic-liquids",
    lastModified: "2026-06-16T23:47:03.292Z",
  },
  { slug: "vozol-salt-50mg-30ml", lastModified: "2026-06-17T11:31:12.699Z" },
  {
    slug: "silvaper-salt-50mg-30ml",
    lastModified: "2026-06-17T11:35:06.931Z",
  },
  { slug: "i-salt-50mg-30ml", lastModified: "2026-06-17T11:38:50.641Z" },
  { slug: "vgod-salt-50mg-30ml", lastModified: "2026-06-17T11:49:01.420Z" },
  {
    slug: "manchester-double-drive-cigarettes",
    lastModified: "2026-06-17T11:51:00.875Z",
  },
  { slug: "platinum-seven-slims", lastModified: "2026-06-17T11:52:39.953Z" },
  {
    slug: "esse-lights-super-slim-luxury-cigarettes",
    lastModified: "2026-06-17T11:54:15.417Z",
  },
  {
    slug: "manchester-red-premium-cigarettes",
    lastModified: "2026-06-17T11:55:31.813Z",
  },
] as const;

const hardcodedProductSlugs = new Set<string>(
  hardcodedProductPages.map((page) => page.slug),
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await fetchAllProductsSafe();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
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

  const categoryPages: MetadataRoute.Sitemap = categoryLandingPages.map(
    (page) => ({
      url: absoluteUrl(`/collections/category/${page.slug}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }),
  );

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

  const hardcodedPages: MetadataRoute.Sitemap = hardcodedProductPages.map(
    (page) => ({
      url: absoluteUrl(`/collections/${page.slug}`),
      lastModified: new Date(page.lastModified),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }),
  );

  const hardcodedPageUrls = new Set(hardcodedPages.map((page) => page.url));
  const productPagesFromApi = productPages.filter(
    (page) => !hardcodedPageUrls.has(page.url),
  );

  const productHintPages: MetadataRoute.Sitemap = Object.keys(productSeoHints)
    .filter((slug) => !hardcodedProductSlugs.has(slug))
    .map((slug) => ({
      url: absoluteUrl(`/collections/${slug}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));

  return [
    ...staticPages,
    ...categoryPages,
    ...hardcodedPages,
    ...productPagesFromApi,
    ...productHintPages,
  ];
}
