import type { Metadata } from "next";
import AboutContent from "./about-content";
import { absoluteUrl, brandKeywords, siteConfig } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Vapes with golden quality | Sri Lanka's Best Vapes",
  description: "Learn about CigarroElectrico, a Sri Lanka vape shop offering premium devices, accessories, e-liquids, and apparel with trusted service.",
  keywords: [
    ...brandKeywords,
    "about CigarroElectrico",
    "Sri Lanka vape store",
    "premium vape store Sri Lanka",
  ],
  alternates: {
    canonical: absoluteUrl("/about"),
  },
  openGraph: {
    title:  "Vapes with golden quality | Sri Lanka's Best Vapes",
    description:
      "Learn about CigarroElectrico, a Sri Lanka vape shop offering premium devices, accessories, e-liquids, and apparel with trusted service.",
    url: absoluteUrl("/about"),
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
    images: [absoluteUrl(siteConfig.defaultOgImage)],
  },
  twitter: {
    card: "summary_large_image",
    title:  "Vapes with golden quality | Sri Lanka's Best Vapes",
    description:
      "Learn about CigarroElectrico, a Sri Lanka vape shop offering premium devices, accessories, e-liquids, and apparel with trusted service.",
    images: [absoluteUrl(siteConfig.defaultOgImage)],
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: absoluteUrl("/"),
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "About",
      item: absoluteUrl("/about"),
    },
  ],
};

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About CigarroElectrico",
  description:
    "Learn about CigarroElectrico, a Sri Lanka-based destination for premium vapes, vape accessories, e-liquids, and apparel.",
  url: absoluteUrl("/about"),
  mainEntity: {
    "@type": "Organization",
    name: siteConfig.legalName,
    alternateName: siteConfig.alternateName,
    url: absoluteUrl("/"),
    email: siteConfig.contactEmail,
    telephone: siteConfig.contactPhone,
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutPageSchema),
        }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <AboutContent />
    </>
  );
}
