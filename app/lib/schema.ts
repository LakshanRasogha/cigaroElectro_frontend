import type { Product } from "@/app/lib/types";
import { getProductSlug } from "@/app/lib/entity_id";
import {
  absoluteUrl,
  getProductCanonicalPath,
  siteConfig,
  type CategoryLandingPage,
} from "@/app/lib/site";

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    "@id": absoluteUrl("/#organization"),
    name: siteConfig.legalName,
    alternateName: [
      siteConfig.alternateName,
      "cigarroelectrico.com",
      "CigarroElectrico Sri Lanka",
    ],
    url: absoluteUrl("/"),
    logo: absoluteUrl("/icon.png"),
    email: siteConfig.contactEmail,
    telephone: siteConfig.contactPhone,
    description: siteConfig.description,
    sameAs: [absoluteUrl("/")],
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.addressLocality,
      addressCountry: "LK",
    },
    areaServed: {
      "@type": "Country",
      name: "Sri Lanka",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: siteConfig.contactPhone,
      email: siteConfig.contactEmail,
      areaServed: "LK",
      availableLanguage: ["en"],
    },
  };
}

export function buildWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: siteConfig.name,
    alternateName: [
      siteConfig.alternateName,
      "CigarroElectrico vapes Sri Lanka",
      "Cigarro Electrico vape shop",
    ],
    url: absoluteUrl("/"),
    description: siteConfig.description,
    publisher: { "@id": absoluteUrl("/#organization") },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl("/collections?search={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildBreadcrumbSchema(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildCollectionPageSchema(
  landingPage: CategoryLandingPage,
  products: Product[],
) {
  const canonicalUrl = absoluteUrl(
    `/collections/category/${landingPage.slug}`,
  );

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: landingPage.title,
    description: landingPage.description,
    url: canonicalUrl,
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
    mainEntity: buildItemListSchema(products, canonicalUrl),
  };
}

export function buildCollectionsIndexSchema(products: Product[]) {
  const canonicalUrl = absoluteUrl("/collections");

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "CigarroElectrico Collections",
    description:
      "Browse premium vapes, disposable vapes, vape accessories, e-liquids, pod systems, and apparel from CigarroElectrico in Sri Lanka.",
    url: canonicalUrl,
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
    mainEntity: buildItemListSchema(products, canonicalUrl),
  };
}

export function buildItemListSchema(products: Product[], listUrl: string) {
  return {
    "@type": "ItemList",
    url: listUrl,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.name,
      url: absoluteUrl(getProductCanonicalPath(product)),
    })),
  };
}

function getProductStockStatus(product: Product) {
  return (
    product.variants?.some(
      (variant) => Number(variant.stock || 0) > 0 && variant.availability,
    ) ?? false
  );
}

export function buildProductSchema(product: Product, slug: string) {
  const productSlug = getProductSlug(product) || slug;
  const productUrl = absoluteUrl(getProductCanonicalPath(product, productSlug));
  const productDescription =
    product.description ||
    product.tagline ||
    `${product.name} from CigarroElectrico.`;
  const hasStock = getProductStockStatus(product);

  const baseImages = Array.isArray(product.productImage)
    ? product.productImage
    : [];
  const variantImages =
    product.variants?.flatMap((variant) =>
      Array.isArray(variant.variantImage) ? variant.variantImage : [],
    ) ?? [];
  const allImages = [...new Set([...baseImages, ...variantImages])]
    .filter(Boolean)
    .map((image) => absoluteUrl(image));

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: productDescription,
    image: allImages.length > 0 ? allImages : [absoluteUrl(siteConfig.defaultOgImage)],
    category: product.category,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    sku: product.key,
    url: productUrl,
    offers: {
      "@type": "Offer",
      priceCurrency: "LKR",
      price: Number(product.basePrice || 0).toFixed(2),
      availability: hasStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      url: productUrl,
      seller: {
        "@type": "Organization",
        name: siteConfig.name,
        url: absoluteUrl("/"),
      },
    },
  };

  if (product.tagline) {
    schema.disambiguatingDescription = product.tagline;
  }

  return schema;
}

export function renderJsonLd(data: unknown) {
  return JSON.stringify(data);
}
