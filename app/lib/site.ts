import type { MetadataRoute } from "next";

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
  whatsappNumber: "94750547703",
  addressLocality: "Colombo, Sri Lanka",
} as const;

export const fallbackApiBaseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000" // Standard local development port configuration
    : "https://api.cigarroelectrico.com";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || siteConfig.domain;

function isLocalDevelopmentHost(hostname: string) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1"
  );
}

function normalizeApiBaseUrl(value: string | undefined) {
  const normalizedValue = value?.trim().replace(/\/+$/, "");

  if (!normalizedValue) {
    return fallbackApiBaseUrl;
  }

  try {
    const hostname = new URL(normalizedValue).hostname.toLowerCase();

    if (
      hostname === "cigarroelectrico.com" ||
      hostname === "www.cigarroelectrico.com"
    ) {
      return fallbackApiBaseUrl;
    }

    if (
      process.env.NODE_ENV === "production" &&
      isLocalDevelopmentHost(hostname)
    ) {
      return fallbackApiBaseUrl;
    }
  } catch {
    return fallbackApiBaseUrl;
  }

  return normalizedValue;
}

export const apiBaseUrl = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API);

export function getServerApiBaseUrl() {
  const runtimeApiUrl = process.env.API_URL?.trim();

  if (runtimeApiUrl) {
    return normalizeApiBaseUrl(runtimeApiUrl);
  }

  return apiBaseUrl;
}

export const brandKeywords = [
  "vape price Sri Lanka | CigarroElectrico",
  "vape price Sri Lanka | ",
  "vape price Sri Lanka | Cigarro Electrico",
  "vape price Sri Lanka | cigarroelectrico",
  "vape price Sri Lanka |cigarro electrico",
  "vape price Sri Lanka |vape",
  "vape price Sri Lanka |vapes",
  "vape price Sri Lanka |vape accessories",
  "vape price Sri Lanka |e-liquid",
  "vape price Sri Lanka |Sri Lanka vape store",
] as const;

// ── Indexable Category Pages ──────────────────────────────────────────────────
export type CategoryLandingPage = {
  slug: string;
  title: string;
  headline: string;
  description: string;
  shortDescription: string;
  keywords: string[];
  categories: string[];
  metaTitle?: string;
  metaDescription?: string;
  primaryKeyword?: string;
};

export const categoryLandingPages: CategoryLandingPage[] = [
  {
    slug: "vapes",
    title: "Vapes with golden quality | Sri Lanka's Best Vapes",
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
      "vapes online",
      "vape store",
      "vapes near me",
    ],
    categories: ["Disposable", "Re-fill", "E-Liquid"],
    metaTitle: "Vapes with golden quality | Sri Lanka's Best Vapes",
    metaDescription:
      "Shop premium vape devices online at the best price. Curated catalogue of disposable and refillable vapes with fast island-wide delivery in Sri Lanka.",
    primaryKeyword: "premium vapes online",
  },
  {
    slug: "vape-accessories",
    title: "Vapes with golden quality | Sri Lanka's Best Vapes",
    headline: "Vape Accessories & Add-Ons",
    description:
      "Shop vape accessories from CigarroElectrico, including add-ons and supporting essentials that complete your setup.",
    shortDescription:
      "Accessories and supporting essentials to complete your vape setup.",
    keywords: [
      "vape accessories",
      "vape accessory store",
      "CigarroElectrico accessories",
      "pod vapes",
      "vape coils",
    ],
    categories: ["Accessories"],
    metaTitle: "Vapes with golden quality | Sri Lanka's Best Vapes",
    metaDescription:
      "Find genuine vape accessories for your setup — high-performance coils, pods, and premium add-ons. Fast delivery across Sri Lanka.",
    primaryKeyword: "vape accessories Sri Lanka",
  },
  {
    slug: "e-liquid",
    title: "Vapes with golden quality | Sri Lanka's Best Vapes",
    headline: "Curated E-Liquid Collection",
    description:
      "Discover curated e-liquid options from CigarroElectrico, selected to complement premium vape hardware and refill-ready setups.",
    shortDescription:
      "Curated e-liquid options to pair with refill-ready vape setups.",
    keywords: [
      "e-liquid",
      "e liquid",
      "vape juice",
      "CigarroElectrico e-liquid",
      "e-juice",
      "nicotine salts",
      "nasty vapes",
    ],
    categories: ["E-Liquid"],
    metaTitle: "Vapes with golden quality | Sri Lanka's Best Vapes",
    metaDescription:
      "Discover the best e-liquids and nicotine salts from leading brands. Intense flavour profiles with guaranteed quality — delivered across Sri Lanka.",
    primaryKeyword: "premium e-liquid Sri Lanka",
  },
  {
    slug: "disposable-vapes",
    title: "Vapes with golden quality | Sri Lanka's Best Vapes",
    headline: "Disposable Vapes",
    description:
      "Browse disposable vape options from CigarroElectrico for convenient, ready-to-use performance.",
    shortDescription:
      "Convenient disposable vape options with ready-to-use performance.",
    keywords: [
      "disposable vape",
      "disposable vapes",
      "CigarroElectrico disposable",
      "flavoured vapes",
    ],
    categories: ["Disposable"],
    metaTitle: "Vapes with golden quality | Sri Lanka's Best Vapes",
    metaDescription:
      "Explore our range of disposable vapes. Enjoy maximum puffs with premium flavour profiles — no charging, no refilling, just vape.",
    primaryKeyword: "disposable vapes Sri Lanka",
  },
  {
    slug: "refill-vapes",
    title: "Vapes with golden quality | Sri Lanka's Best Vapes",
    headline: "Refill Vape Systems",
    description:
      "Explore refill vape systems and compatible product lines from CigarroElectrico for flexible, repeat-use setups.",
    shortDescription:
      "Flexible refill vape systems for repeat-use setups.",
    keywords: [
      "refill vape",
      "refill vapes",
      "pod vape",
      "CigarroElectrico refill",
      "refillable vapes",
      "pod systems",
      "vape kits",
    ],
    categories: ["Re-fill"],
    metaTitle: "Vapes with golden quality | Sri Lanka's Best Vapes",
    metaDescription:
      "Optimise your vaping experience with advanced refillable vapes and modular pod systems built for long-lasting performance.",
    primaryKeyword: "refillable vapes Sri Lanka",
  },
];

// ── Non-Indexable Utility Pages (Auth & Checkout Pipelines) ──────────────────
export type UtilityPageSeo = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  robots: {
    index: false;
    follow: boolean;
  };
};

export const utilityPages: UtilityPageSeo[] = [
  {
    slug: "cart",
    title: "Vapes with golden quality | Sri Lanka's Best Vapes",
    metaTitle: "Vapes with golden quality | Sri Lanka's Best Vapes",
    metaDescription: "Verify your items, adjust product counts, and proceed to secure checkout for premium alternative hardware and culture essentials.",
    robots: { index: false, follow: false },
  },
  {
    slug: "auth/login",
    title: "Vapes with golden quality | Sri Lanka's Best Vapes",
    metaTitle: "Vapes with golden quality | Sri Lanka's Best Vapes",
    metaDescription: "Log in to your secure client terminal to manage configurations, monitor purchase tracking, and modify system wishlists.",
    robots: { index: false, follow: true },
  },
  {
    slug: "auth/Signin",
    title: "Sign Up",
    metaTitle: "Vapes with golden quality | Sri Lanka's Best Vapes",
    metaDescription: "Establish a secure user profile to initiate checkout permissions and review system access arrays.",
    robots: { index: false, follow: true },
  },
  {
    slug: "auth/login/free-membership-agreement",
    title: "Free Membership Agreement",
    metaTitle: "Vapes with golden quality | Sri Lanka's Best Vapes",
    metaDescription: "Read our Free Membership Agreement guidelines and terms of service for utilizing the CigarroElectrico platform.",
    robots: { index: false, follow: true },
  },
  {
    slug: "auth/login/privacy-policy",
    title: "Privacy Policy",
    metaTitle: "Vapes with golden quality | Sri Lanka's Best Vapes",
    metaDescription: "Review the CigarroElectrico privacy policy regarding security, user data protection, and localized data handling processes.",
    robots: { index: false, follow: true },
  },
];

// ── Per-product SEO hints ──────────────────────────────────────────────────────
export type ProductSeoHint = {
  headline: string;
  targetKeywords: string[];
  metaTitle?: string;
};

export const productSeoHints: Record<string, ProductSeoHint> = {
  "elfbar-raya-d1": {
    headline: "Elfbar Raya D1 13000 Puffs — Intense Flavours",
    targetKeywords: ["elfbar raya d1", "elf bar d1 13000", "elfbar raya d1 price Sri Lanka"],
    metaTitle: "Vapes with golden quality | Sri Lanka's Best Vapes",
  },
  "vozol-vista-20k": {
    headline: "Vozol Vista 20K — Smart Screen Vape",
    targetKeywords: ["vozol vista 20k", "vozol vista 20000", "vozol vista Sri Lanka"],
    metaTitle: "Vapes with golden quality | Sri Lanka's Best Vapes",
  },
  "elfbar-raya-d3-25k": {
    headline: "Elfbar Raya D3 25K Puffs — Rechargeable Vape",
    targetKeywords: ["elfbar raya d3 25k", "elf bar raya d3", "elfbar raya d3 price Sri Lanka"],
    metaTitle: "Vapes with golden quality | Sri Lanka's Best Vapes",
  },
  "elfbar-planet-space-edition-25k": {
    headline: "Elfbar Planet Space Edition — Special Edition Vape",
    targetKeywords: ["elfbar planet space edition", "elfbar space edition 25k", "elf bar space edition Sri Lanka"],
    metaTitle: "Vapes with golden quality | Sri Lanka's Best Vapes",
  },
  "elfbar-ice-king-30k": {
    headline: "Elfbar Ice King 30K — Maximum Menthol Puffs",
    targetKeywords: ["elfbar ice king 30k", "elf bar ice king 30000", "elfbar ice king price Sri Lanka"],
    metaTitle: "Vapes with golden quality | Sri Lanka's Best Vapes",
  },
  "elfbar-trio-30k": {
    headline: "Elfbar Trio 30K Puffs — Three Flavours in One",
    targetKeywords: ["elfbar trio 30k", "elf bar trio 30000", "elf bar trio Sri Lanka"],
    metaTitle: "Vapes with golden quality | Sri Lanka's Best Vapes",
  },
  // ── New High-Trending Catalog Additions ──────────────────────────────────────
  "nasty-bolt-50k": {
    headline: "NASTY Bolt 50K Puffs — High Performance Disposable",
    targetKeywords: ["nasty bolt 50k", "nasty bolt 50000 price", "nasty bolt vape sri lanka"],
    metaTitle: "Vapes with golden quality | Sri Lanka's Best Vapes",
  },
  "vozol-gear-ice-sweet-50k": {
    headline: "VOZOL Gear ICE & SWEET 50K — Premium Puffs Dual Flavor",
    targetKeywords: ["vozol gear ice sweet 50k", "vozol 50k puffs price", "vozol ice sweet vape"],
    metaTitle: "Vapes with golden quality | Sri Lanka's Best Vapes",
  },
  "sonder-q2-geek-vape": {
    headline: "Sonder Q2 Geek Vape — Professional Pod System Kit",
    targetKeywords: ["sonder q2 geekvape", "sonder q2 price sri lanka", "geekvape sonder q2"],
    metaTitle: "Vapes with golden quality | Sri Lanka's Best Vapes",
  },
  "wenex-q-geekvape": {
    headline: "Wenax Q GeekVape — Adjustable Airflow Smart Pod Kit",
    targetKeywords: ["wenax q geekvape", "wenax q price sri lanka", "geekvape wenax q"],
    metaTitle: "Vapes with golden quality | Sri Lanka's Best Vapes",
  },
  "qpods": {
    headline: "QPods Replacement Cartridges — Maximum Leak-Proof Design",
    targetKeywords: ["qpods cartridges", "qpods price sri lanka", "replacement qpods"],
    metaTitle: "Vapes with golden quality | Sri Lanka's Best Vapes",
  },
  "nasty-liquids": {
    headline: "NASTY Liquids — Award Winning Premium E-Juice Profiles",
    targetKeywords: ["nasty liquids", "nasty vape juice price sri lanka", "nasty freebase liquid"],
    metaTitle: "Vapes with golden quality | Sri Lanka's Best Vapes",
  },
  "vozol-salt-liquids": {
    headline: "VOZOL Salt Liquids — Intense Flavor Nicotine Salts",
    targetKeywords: ["vozol salt liquids", "vozol nic salts price", "vozol salt e-liquid"],
    metaTitle: "Vapes with golden quality | Sri Lanka's Best Vapes",
  },
  "silvaper-salt-liquids": {
    headline: "SILVAPER Salt Liquids — Ultra Smooth Nicotine Salts",
    targetKeywords: ["silvaper salt liquids", "silvaper e-liquid price", "silvaper juice sri lanka"],
    metaTitle: "Vapes with golden quality | Sri Lanka's Best Vapes",
  },
  "i-love-salt-liquids": {
    headline: "I Love Salt Liquids — Mad Hatter Premium Nic Salts",
    targetKeywords: ["i love salt liquids", "i love salts price sri lanka", "mad hatter nicotine salts"],
    metaTitle: "Vapes with golden quality | Sri Lanka's Best Vapes",
  },
  "vgod-salt-liquids": {
    headline: "VGod Salt Liquids — Premium Cubano Cigar & Fruit Nic Salts",
    targetKeywords: ["vgod salt liquids", "vgod e-liquid price sri lanka", "vgod cubano salt"],
    metaTitle: "Vapes with golden quality | Sri Lanka's Best Vapes",
  },
  "tokyo-classic-liquids": {
    headline: "TOKYO Classic Liquids — Refreshing High-Fidelity E-Liquid",
    targetKeywords: ["tokyo classic liquids", "tokyo classic vape juice", "tokyo e-liquid price sri lanka"],
    metaTitle: "Vapes with golden quality | Sri Lanka's Best Vapes",
  },
};

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