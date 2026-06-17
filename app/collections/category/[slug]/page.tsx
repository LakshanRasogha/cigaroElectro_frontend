import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CollectionsClient from "../../collections-client";
import { fetchProductsForCategorySlug } from "@/app/lib/catalog";
import {
  absoluteUrl,
  brandKeywords,
  categoryLandingPages,
  getCategoryLandingPage,
  type CategoryLandingPage,
} from "@/app/lib/site";
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  renderJsonLd,
} from "@/app/lib/schema";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function buildCategoryMetadata(landingPage: CategoryLandingPage) {
  const canonicalUrl = absoluteUrl(`/collections/category/${landingPage.slug}`);

  const title = landingPage.metaTitle ?? `${landingPage.title} | CigarroElectrico`;
  const description = landingPage.metaDescription ?? landingPage.description;
  const keywords = [
    ...(landingPage.primaryKeyword ? [landingPage.primaryKeyword] : []),
    ...brandKeywords,
    ...landingPage.keywords,
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      images: [absoluteUrl("/opengraph-image.png")],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/opengraph-image.png")],
    },
  } satisfies Metadata;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const landingPage = getCategoryLandingPage(slug);

  if (!landingPage) {
    return {
      title: "Category Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return buildCategoryMetadata(landingPage);
}

export function generateStaticParams() {
  return categoryLandingPages.map((page) => ({
    slug: page.slug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const { landingPage, products } = await fetchProductsForCategorySlug(slug);

  if (!landingPage) {
    notFound();
  }

  const categorySchema = buildCollectionPageSchema(landingPage, products);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Collections", path: "/collections" },
    { name: landingPage.title, path: `/collections/category/${landingPage.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: renderJsonLd(categorySchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: renderJsonLd(breadcrumbSchema),
        }}
      />
      <CollectionsClient initialCategorySlug={landingPage.slug} />
    </>
  );
}
