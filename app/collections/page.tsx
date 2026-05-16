import type { Metadata } from "next";
import CollectionsClient from "./collections-client";
import { absoluteUrl, brandKeywords, siteConfig } from "@/app/lib/site";

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

export default function CollectionsPage() {
  return <CollectionsClient />;
}
