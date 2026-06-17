import type { Metadata } from "next";
import ContactContent from "./contact-content";
import { absoluteUrl, brandKeywords, siteConfig } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Vapes with golden quality | Sri Lanka's Best Vapes",
  description:
    "Contact CigarroElectrico for premium vape product support, delivery coordination, and order inquiries in Sri Lanka.",
  keywords: [
    ...brandKeywords,
    "contact CigarroElectrico",
    "vape store contact Sri Lanka",
    "CigarroElectrico phone number",
  ],
  alternates: {
    canonical: absoluteUrl("/contact"),
  },
  openGraph: {
    title: "Vapes with golden quality | Sri Lanka's Best Vapes",
    description:
      "Reach CigarroElectrico for premium vape product support, delivery coordination, and order inquiries in Sri Lanka.",
    url: absoluteUrl("/contact"),
    images: [absoluteUrl(siteConfig.defaultOgImage)],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vapes with golden quality | Sri Lanka's Best Vapes",
    description:
      "Reach CigarroElectrico for premium vape product support, delivery coordination, and order inquiries in Sri Lanka.",
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
      name: "Contact",
      item: absoluteUrl("/contact"),
    },
  ],
};

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact CigarroElectrico",
  description:
    "Contact CigarroElectrico for premium vape product support, delivery coordination, and order inquiries in Sri Lanka.",
  url: absoluteUrl("/contact"),
  mainEntity: {
    "@type": "Organization",
    name: siteConfig.legalName,
    alternateName: siteConfig.alternateName,
    url: absoluteUrl("/"),
    email: siteConfig.contactEmail,
    telephone: siteConfig.contactPhone,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: siteConfig.contactPhone,
      email: siteConfig.contactEmail,
      areaServed: "LK",
      availableLanguage: "en",
    },
  },
};

export default function ContactPage() {
  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactPageSchema),
        }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <ContactContent />
    </>
  );
}
