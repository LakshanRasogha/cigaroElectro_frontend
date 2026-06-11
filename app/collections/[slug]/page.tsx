import type { Metadata } from "next";
import ProductDetailClient from "./product-detail-client";
import { fetchProductBySlug } from "@/app/lib/catalog";
import { absoluteUrl, brandKeywords, siteConfig } from "@/app/lib/site";

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

  return {
    title: `${product.name} | ${product.category || "Collection"}`,
    description,
    keywords: [
      ...brandKeywords,
      product.name,
      product.category || "",
      `${product.name} price Sri Lanka`,
    ],
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

  const productUrl = absoluteUrl(`/collections/${product.slug || slug}`);
  const productImage = product.productImage?.[0]
    ? absoluteUrl(product.productImage[0])
    : absoluteUrl(siteConfig.defaultOgImage);
  const productDescription =
    product.description ||
    product.tagline ||
    `${product.name} from CigarroElectrico.`;
  const hasStock =
    product.variants?.some(
      (variant) => Number(variant.stock || 0) > 0 && variant.availability,
    ) ?? false;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: productDescription,
    image: [productImage],
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
      price: Number(product.basePrice || 0),
      availability: hasStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: productUrl,
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
        name: "Collections",
        item: absoluteUrl("/collections"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: productUrl,
      },
    ],
  };

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <ProductDetailClient initialProduct={product} slug={slug} />
    </>
  );
}
