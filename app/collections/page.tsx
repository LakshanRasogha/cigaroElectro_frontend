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
  title: "Vape Collection Sri Lanka | CigarroElectrico",
  description:
    "Browse the CigarroElectrico vape collection in Sri Lanka, including disposable vapes, refillable pod systems, e-liquids, accessories, and apparel.",
  keywords: [...brandKeywords, "vape collection Sri Lanka", "vape accessories collection", "online vape store Sri Lanka"],
  alternates: {
    canonical: absoluteUrl("/collections"),
  },
  openGraph: {
    title: "Vape Collection Sri Lanka | CigarroElectrico",
    description:
      "Browse CigarroElectrico collections for disposable vapes, pod systems, vape accessories, e-liquids, and apparel in Sri Lanka.",
    url: absoluteUrl("/collections"),
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
    images: [absoluteUrl(siteConfig.defaultOgImage)],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vape Collection Sri Lanka | CigarroElectrico",
    description:
      "Browse premium vapes, accessories, e-liquids, and apparel from CigarroElectrico in Sri Lanka.",
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
      <CollectionsClient pageHeading="Browse Collections" />
    </>
  );
}
