import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { fetchProductBySlug } from "@/app/lib/catalog";
import {
  absoluteUrl,
  getProductCanonicalPath,
} from "@/app/lib/site";

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

  return {
    title: `${product.name} | CigarroElectrico Sri Lanka`,
    alternates: {
      canonical: absoluteUrl(getProductCanonicalPath(product, slug)),
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (product) {
    permanentRedirect(getProductCanonicalPath(product, slug));
  }

  permanentRedirect("/collections");
}
