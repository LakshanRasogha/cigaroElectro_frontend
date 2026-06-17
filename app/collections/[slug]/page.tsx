import type { Metadata } from "next";
import ProductDetailClient from "./product-detail-client";
import { fetchProductBySlug } from "@/app/lib/catalog";
import { absoluteUrl, brandKeywords, productSeoHints, siteConfig } from "@/app/lib/site";
import {
  buildBreadcrumbSchema,
  buildProductSchema,
  renderJsonLd,
} from "@/app/lib/schema";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalUrl = absoluteUrl(`/collections/${product.slug || slug}`);
  const image = product.productImage?.[0] || siteConfig.defaultOgImage;
  const description =
    product.description ||
    product.tagline ||
    `Shop ${product.name} at CigarroElectrico with premium vapes, vape accessories, and curated product details.`;

  const seoHint = productSeoHints[product.slug || slug];
  const pageTitle = seoHint
    ? `${seoHint.headline} | ${product.category || "Collection"}`
    : `${product.name} | ${product.category || "Collection"}`;
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

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) {
    return <ProductDetailClient slug={slug} />;
  }

  const productSchema = buildProductSchema(product, slug);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Collections", path: "/collections" },
    { name: product.name, path: `/collections/${product.slug || slug}` },
  ]);

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: renderJsonLd(productSchema),
        }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: renderJsonLd(breadcrumbSchema),
        }}
      />
      <ProductDetailClient initialProduct={product} slug={slug} />
    </>
  );
}
