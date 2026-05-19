export const siteConfig = {
  name: "CigarroElectrico",
  legalName: "CigarroElectrico",
  alternateName: "Cigarro Electrico",
  description:
    "CigarroElectrico is a Sri Lanka-based online store for premium vapes, vape accessories, e-liquids, and lifestyle apparel.",
  domain: "https://cigarroelectrico.com",
  defaultOgImage: "/opengraph-image.png",
  contactEmail: "info@cigarroelectrico.com",
  contactPhone: "+94 78 969 6180",
  whatsappNumber: "94789696180",
  addressLocality: "Colombo, Sri Lanka",
} as const;

const fallbackApiBaseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "https://api.cigarroelectrico.com";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || siteConfig.domain;

function normalizeApiBaseUrl(value: string | undefined) {
  const normalizedValue = value?.trim().replace(/\/+$/, "");

  if (!normalizedValue || normalizedValue === siteConfig.domain) {
    return fallbackApiBaseUrl;
  }

  return normalizedValue;
}

export const apiBaseUrl = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API);

export const brandKeywords = [
  "CigarroElectrico",
  "Cigarro Electrico",
  "cigarroelectrico",
  "cigarro electrico",
  "vape",
  "vapes",
  "vape accessories",
  "e-liquid",
  "Sri Lanka vape store",
] as const;

export type CategoryLandingPage = {
  slug: string;
  title: string;
  headline: string;
  description: string;
  shortDescription: string;
  keywords: string[];
  categories: string[];
};

export const categoryLandingPages: CategoryLandingPage[] = [
  {
    slug: "vapes",
    title: "Vapes",
    headline: "Premium Vapes in Sri Lanka",
    description:
      "Browse premium vapes from CigarroElectrico, including disposable vape devices, refill systems, and curated essentials for everyday use.",
    shortDescription:
      "Explore premium vape devices, refill systems, and curated everyday hardware.",
    keywords: [
      "vape",
      "vapes",
      "premium vapes",
      "Sri Lanka vapes",
      "CigarroElectrico vapes",
    ],
    categories: ["Disposable", "Re-fill", "E-Liquid"],
  },
  {
    slug: "vape-accessories",
    title: "Vape Accessories",
    headline: "Vape Accessories & Add-Ons",
    description:
      "Shop vape accessories from CigarroElectrico, including add-ons and supporting essentials that complete your setup.",
    shortDescription:
      "Accessories and supporting essentials to complete your vape setup.",
    keywords: [
      "vape accessories",
      "vape accessory store",
      "CigarroElectrico accessories",
    ],
    categories: ["Accessories"],
  },
  {
    slug: "e-liquid",
    title: "E-Liquid",
    headline: "Curated E-Liquid Collection",
    description:
      "Discover curated e-liquid options from CigarroElectrico, selected to complement premium vape hardware and refill-ready setups.",
    shortDescription:
      "Curated e-liquid options to pair with refill-ready vape setups.",
    keywords: ["e-liquid", "e liquid", "vape juice", "CigarroElectrico e-liquid"],
    categories: ["E-Liquid"],
  },
  {
    slug: "disposable-vapes",
    title: "Disposable Vapes",
    headline: "Disposable Vapes",
    description:
      "Browse disposable vape options from CigarroElectrico for convenient, ready-to-use performance.",
    shortDescription:
      "Convenient disposable vape options with ready-to-use performance.",
    keywords: ["disposable vape", "disposable vapes", "CigarroElectrico disposable"],
    categories: ["Disposable"],
  },
  {
    slug: "refill-vapes",
    title: "Refill Vapes",
    headline: "Refill Vape Systems",
    description:
      "Explore refill vape systems and compatible product lines from CigarroElectrico for flexible, repeat-use setups.",
    shortDescription:
      "Flexible refill vape systems for repeat-use setups.",
    keywords: ["refill vape", "refill vapes", "pod vape", "CigarroElectrico refill"],
    categories: ["Re-fill"],
  },
];

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, siteUrl).toString();
}

export function normalizeCategory(value: string | null | undefined) {
  return String(value || "")
    .toLowerCase()
    .trim();
}

export function getCategoryLandingPage(slug: string) {
  return categoryLandingPages.find((page) => page.slug === slug) || null;
}
