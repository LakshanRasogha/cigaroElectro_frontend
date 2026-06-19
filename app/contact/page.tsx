import type { Metadata } from "next";
import ContactContent from "./contact-content";
import { absoluteUrl, brandKeywords, siteConfig } from "@/app/lib/site";

export const metadata: Metadata = {
  title: "Contact Us | CigarroElectrico Vape Shop Sri Lanka",
  description:
    "Contact CigarroElectrico for support, stock checks, and vape order help in Sri Lanka, including delivery coordination and order updates.",
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
    title: "Contact Us | CigarroElectrico Vape Shop Sri Lanka",
    description:
      "Contact CigarroElectrico for support, stock checks, and vape order help in Sri Lanka, including delivery coordination and order updates.",
    url: absoluteUrl("/contact"),
    images: [absoluteUrl(siteConfig.defaultOgImage)],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | CigarroElectrico Vape Shop Sri Lanka",
    description:
      "Contact CigarroElectrico for support, stock checks, and vape order help in Sri Lanka, including delivery coordination and order updates.",
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
    "Get in touch with CigarroElectrico for customer support, fast delivery coordination, stock availability, and all vape product inquiries in Sri Lanka.",
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
