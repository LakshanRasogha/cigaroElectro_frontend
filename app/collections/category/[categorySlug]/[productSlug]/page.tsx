import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import ProductDetailClient from "@/app/collections/[slug]/product-detail-client";
import { fetchProductBySlug } from "@/app/lib/catalog";
import {
  absoluteUrl,
  brandKeywords,
  getCategoryLandingPage,
  getProductCanonicalPath,
  normalizeMetaDescription,
  productSeoHints,
  siteConfig,
} from "@/app/lib/site";
import {
  buildBreadcrumbSchema,
  buildProductSchema,
  renderJsonLd,
} from "@/app/lib/schema";

type CategoryProductPageProps = {
  params: Promise<{
    categorySlug: string;
    productSlug: string;
  }>;
};

export async function generateMetadata({
  params,
}: CategoryProductPageProps): Promise<Metadata> {
  const { productSlug } = await params;
  const product = await fetchProductBySlug(productSlug);

  if (!product) {
    return {
      title: "Product Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalPath = getProductCanonicalPath(product, productSlug);
  const canonicalUrl = absoluteUrl(canonicalPath);
  const image = product.productImage?.[0] || siteConfig.defaultOgImage;
  const description = normalizeMetaDescription(
    product.description || product.tagline,
    `Shop ${product.name} at CigarroElectrico with premium vapes, accessories, and fast island-wide delivery across Sri Lanka.`,
  );
  const seoHint = productSeoHints[product.slug || productSlug];
  const pageTitle = seoHint
    ? `${seoHint.headline} | CigarroElectrico Sri Lanka`
    : `${product.name} | CigarroElectrico Sri Lanka`;
  const keywords = [
    ...(seoHint ? seoHint.targetKeywords : []),
    ...brandKeywords,
    product.name,
    product.category || "",
    `${product.name} price Sri Lanka`,
  ];

  return {
    title: pageTitle,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${product.name} | CigarroElectrico`,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: siteConfig.name,
      locale: "en_US",
      images: [absoluteUrl(image)],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | CigarroElectrico`,
      description,
      images: [absoluteUrl(image)],
    },
  };
}

export default async function CategoryProductPage({
  params,
}: CategoryProductPageProps) {
  const { categorySlug, productSlug } = await params;
  const product = await fetchProductBySlug(productSlug);
  const fallbackTitle = productSlug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  if (!product) {
    return (
      <ProductDetailClient slug={productSlug} fallbackTitle={fallbackTitle} />
    );
  }

  const canonicalPath = getProductCanonicalPath(product, productSlug);
  const requestedPath = `/collections/category/${categorySlug}/${productSlug}`;

  if (requestedPath !== canonicalPath) {
    permanentRedirect(canonicalPath);
  }

  const categoryPage = getCategoryLandingPage(categorySlug);
  const productSchema = buildProductSchema(product, productSlug);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Collections", path: "/collections" },
    {
      name: categoryPage?.title || "Vapes",
      path: `/collections/category/${categorySlug}`,
    },
    { name: product.name, path: canonicalPath },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: renderJsonLd(productSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: renderJsonLd(breadcrumbSchema),
        }}
      />
      <ProductDetailClient
        initialProduct={product}
        slug={productSlug}
        fallbackTitle={fallbackTitle}
      />
    </>
  );
}
