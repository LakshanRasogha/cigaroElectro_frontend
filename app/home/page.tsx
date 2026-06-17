import type { Metadata } from "next";
import HomeContent from "./home-content";
import { absoluteUrl } from "@/app/lib/site";

// 1. High-Trending Keyword Metadata Injection
export const metadata: Metadata = {
  title:  "Vapes with golden quality | Sri Lanka's Best Vapes",
  description: "Shop premium vapes online at CigarroElectrico. Curated collection of disposable vapes, e-liquids, and hardware add-ons. Fast delivery across Colombo and island-wide Sri Lanka.",
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title:  "Vapes with golden quality | Sri Lanka's Best Vapes",
    description: "The gold standard of vapor technology. Explore top-tier disposable devices, pod systems, and premium nicotine salts with fast Sri Lanka delivery.",
    url: absoluteUrl("/"),
    siteName: "CigarroElectrico",
    images: [
      {
        url: absoluteUrl("/opengraph-image.png"),
        width: 1200,
        height: 630,
        alt: "CigarroElectrico Premium Storefront",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  <meta name="msvalidate.01" content="85D8EDFDD4C1B872558C39E186397F6F" />
  return <HomeContent />;
}