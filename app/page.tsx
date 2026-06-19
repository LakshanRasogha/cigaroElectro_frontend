import type { Metadata } from "next";
import HomeContent from "./home/home-content";
import { absoluteUrl, brandKeywords, siteConfig } from "@/app/lib/site";
import {
  buildOrganizationSchema,
  buildWebsiteSchema,
  renderJsonLd,
} from "@/app/lib/schema";

export const metadata: Metadata = {
  title: "cigarroelectrico.com | Premium Vapes in Sri Lanka",
  description:
    "Discover premium vapes, e-liquids, and accessories from CigarroElectrico with fast island-wide delivery across Sri Lanka.",
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
    title: "cigarroelectrico.com | Premium Vapes in Sri Lanka",
    description:
      "Discover premium disposable devices, vape accessories, e-liquids, and pod systems from CigarroElectrico with island-wide delivery.",
    url: absoluteUrl("/"),
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
    images: [absoluteUrl(siteConfig.defaultOgImage)],
  },
  twitter: {
    card: "summary_large_image",
    title: "cigarroelectrico.com | Premium Vapes in Sri Lanka",
    description:
      "Discover premium disposable devices, vape accessories, e-liquids, and pod systems from CigarroElectrico with island-wide delivery.",
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
