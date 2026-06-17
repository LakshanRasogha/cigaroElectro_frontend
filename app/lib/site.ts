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
    ? "http://localhost:3001"
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
  /** Exact <title> tag value for this category page (overrides the generic template). */
  metaTitle?: string;
  /** Exact <meta name="description"> value for this category page. */
  metaDescription?: string;
  /** Top-priority transactional keyword; injected first in the keywords array. */
  primaryKeyword?: string;
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
      "vapes online",
      "vape store",
      "vapes near me",
      "comprar vapeador online",
    ],
    categories: ["Disposable", "Re-fill", "E-Liquid"],
    metaTitle: "Premium Vapes & Vape Devices Online | CigarroElectrico",
    metaDescription:
      "Shop premium vape devices online at the best price. Curated catalogue of disposable and refillable vapes with fast island-wide delivery in Sri Lanka.",
    primaryKeyword: "premium vapes online",
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
      "pod vapes",
      "vape coils",
      "repuestos para vapeador",
      "resistencias vape",
    ],
    categories: ["Accessories"],
    metaTitle: "Vape Accessories & Coils | CigarroElectrico Sri Lanka",
    metaDescription:
      "Find genuine vape accessories for your setup — high-performance coils, pods, and premium add-ons. Fast delivery across Sri Lanka.",
    primaryKeyword: "vape accessories Sri Lanka",
  },
  {
    slug: "e-liquid",
    title: "E-Liquid",
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
      "mejor e-liquid sin nicotina",
      "sales de nicotina",
    ],
    categories: ["E-Liquid"],
    metaTitle: "Premium E-Liquids & Nicotine Salts | CigarroElectrico",
    metaDescription:
      "Discover the best e-liquids and nicotine salts from leading brands. Intense flavour profiles with guaranteed quality — delivered across Sri Lanka.",
    primaryKeyword: "premium e-liquid Sri Lanka",
  },
  {
    slug: "disposable-vapes",
    title: "Disposable Vapes",
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
      "vape desechable",
      "vapes de sabores",
    ],
    categories: ["Disposable"],
    metaTitle: "Long-Lasting Disposable Vapes | CigarroElectrico Sri Lanka",
    metaDescription:
      "Explore our range of disposable vapes. Enjoy maximum puffs with premium flavour profiles — no charging, no refilling, just vape.",
    primaryKeyword: "disposable vapes Sri Lanka",
  },
  {
    slug: "refill-vapes",
    title: "Refill Vapes",
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
      "vapes recargables",
      "sistemas de pod",
    ],
    categories: ["Re-fill"],
    metaTitle: "Refillable Vapes & Pod Kits | CigarroElectrico Sri Lanka",
    metaDescription:
      "Optimise your vaping experience with advanced refillable vapes and modular pod systems built for long-lasting performance.",
    primaryKeyword: "refillable vapes Sri Lanka",
  },
];

// ── Per-product SEO hints ──────────────────────────────────────────────────────
// Keyed by product slug. Used to inject high-intent keyword phrases into
// product page metadata and JSON-LD without requiring a backend schema change.
export type ProductSeoHint = {
  /** Keyword-rich headline injected into the product page <title> prefix. */
  headline: string;
  /** High-intent search terms to merge into the page keywords array. */
  targetKeywords: string[];
};

export const productSeoHints: Record<string, ProductSeoHint> = {
  "elfbar-raya-d1": {
    headline: "Elfbar Raya D1 13000 Puffs — Intense Flavours",
    targetKeywords: ["elfbar raya d1", "elf bar d1 13000", "elfbar raya d1 price Sri Lanka"],
  },
  "vozol-vista-20k": {
    headline: "Vozol Vista 20K — Smart Screen Vape",
    targetKeywords: ["vozol vista 20k", "vozol vista 20000", "vozol vista Sri Lanka"],
  },
  "elfbar-raya-d3-25k": {
    headline: "Elfbar Raya D3 25K Puffs — Rechargeable Vape",
    targetKeywords: ["elfbar raya d3 25k", "elf bar raya d3", "elfbar raya d3 price Sri Lanka"],
  },
  "elfbar-planet-space-edition-25k": {
    headline: "Elfbar Planet Space Edition — Special Edition Vape",
    targetKeywords: ["elfbar planet space edition", "elfbar space edition 25k", "elf bar space edition Sri Lanka"],
  },
  "elfbar-ice-king-30k": {
    headline: "Elfbar Ice King 30K — Maximum Menthol Puffs",
    targetKeywords: ["elfbar ice king 30k", "elf bar ice king 30000", "elfbar ice king price Sri Lanka"],
  },
  "elfbar-trio-30k": {
    headline: "Elfbar Trio 30K Puffs — Three Flavours in One",
    targetKeywords: ["elfbar trio 30k", "elf bar trio 30000", "elfbar trio Sri Lanka"],
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
