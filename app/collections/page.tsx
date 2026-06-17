import type { Metadata } from "next";
import CollectionsClient from "./collections-client";
import { fetchAllProductsSafe } from "@/app/lib/catalog";
import { absoluteUrl, brandKeywords, siteConfig } from "@/app/lib/site";
import {
  buildBreadcrumbSchema,
  buildCollectionsIndexSchema,
  renderJsonLd,
} from "@/app/lib/schema";

export const metadata: Metadata = {
  title: "Collections | Vapes, Accessories & E-Liquid",
  description:
    "Explore the CigarroElectrico collections of premium vapes, vape accessories, e-liquids, and apparel through product and category pages built for easy browsing.",
  keywords: [...brandKeywords, "collections", "vape collection", "vape accessories collection"],
  alternates: {
    canonical: absoluteUrl("/collections"),
  },
  openGraph: {
    title: "CigarroElectrico Collections",
    description:
      "Browse CigarroElectrico collections for premium vapes, vape accessories, e-liquids, and apparel.",
    url: absoluteUrl("/collections"),
    images: [absoluteUrl(siteConfig.defaultOgImage)],
  },
  twitter: {
    card: "summary_large_image",
    title: "CigarroElectrico Collections",
    description:
      "Browse premium vapes, vape accessories, e-liquids, and apparel from CigarroElectrico.",
    images: [absoluteUrl(siteConfig.defaultOgImage)],
  },
};

export default async function CollectionsPage() {
  const products = await fetchAllProductsSafe();
  const collectionsSchema = buildCollectionsIndexSchema(products);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Collections", path: "/collections" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: renderJsonLd(collectionsSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: renderJsonLd(breadcrumbSchema),
        }}
      />
      <CollectionsClient />
    </>
  );
}
