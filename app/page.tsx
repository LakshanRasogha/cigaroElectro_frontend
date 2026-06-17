import type { Metadata } from "next";
import HomeContent from "./home/home-content";
import { absoluteUrl, brandKeywords, siteConfig } from "@/app/lib/site";
import {
  buildOrganizationSchema,
  buildWebsiteSchema,
  renderJsonLd,
} from "@/app/lib/schema";

export const metadata: Metadata = {
  title: "Premium Vapes, Vape Accessories & Apparel in Sri Lanka",
  description:
    "Shop premium vapes, vape accessories, e-liquids, and apparel at CigarroElectrico. Discover Cigarro Electrico online for curated hardware and lifestyle essentials in Sri Lanka.",
  keywords: [...brandKeywords],
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: "CigarroElectrico | Premium Vapes, Vape Accessories & Apparel",
    description:
      "Discover premium vapes, vape accessories, e-liquids, and apparel at CigarroElectrico.",
    url: absoluteUrl("/"),
    images: [absoluteUrl(siteConfig.defaultOgImage)],
  },
  twitter: {
    card: "summary_large_image",
    title: "CigarroElectrico | Premium Vapes, Vape Accessories & Apparel",
    description:
      "Discover premium vapes, vape accessories, e-liquids, and apparel at CigarroElectrico.",
    images: [absoluteUrl(siteConfig.defaultOgImage)],
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: renderJsonLd(buildOrganizationSchema()),
        }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: renderJsonLd(buildWebsiteSchema()),
        }}
      />
      <HomeContent />
    </>
  );
}
