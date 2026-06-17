import type { Metadata } from "next";
import HomeContent from "./home/home-content";
import { absoluteUrl, brandKeywords, siteConfig } from "@/app/lib/site";
import {
  buildOrganizationSchema,
  buildWebsiteSchema,
  renderJsonLd,
} from "@/app/lib/schema";

export const metadata: Metadata = {
  title: "Vapes with golden quality | Sri Lanka's Best Vapes",
  description:
    "Shop the best disposable vapes, premium e-liquids, and vape accessories in Sri Lanka at CigarroElectrico. Enjoy fast island-wide delivery.",
  keywords: [
    ...brandKeywords,
    "vape sri lanka",
    "best vape shop colombo",
    "disposable vapes sri lanka",
    "e-liquid sri lanka",
    "vape accessories sri lanka",
    "pod vapes",
    "nicotine salts",
    "vape juice",
    "best disposable vapes",
  ],
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: "Vapes with golden quality | Sri Lanka's Best Vapes",
    description:
      "Explore premium disposable vapes, vape accessories, e-liquids, and pod systems at CigarroElectrico with island-wide delivery.",
    url: absoluteUrl("/"),
    images: [absoluteUrl(siteConfig.defaultOgImage)],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vapes with golden quality | Sri Lanka's Best Vapes",
    description:
      "Explore premium disposable vapes, vape accessories, e-liquids, and pod systems at CigarroElectrico with island-wide delivery.",
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
      
      {/* 
        Semantic H1 tag for search engine spiders. 
        Using standard Tailwind CSS 'sr-only' keeps it hidden visually 
        while making sure crawlers register it.
      */}
      <h1 className="sr-only">CigarroElectrico | Sri Lanka's Best Vapes & Premium E-Liquids</h1>
      
      <HomeContent />
    </>
  );
}