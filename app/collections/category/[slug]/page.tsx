import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CollectionsClient from "../../collections-client";
import {
  absoluteUrl,
  brandKeywords,
  categoryLandingPages,
  getCategoryLandingPage,
  type CategoryLandingPage,
} from "@/app/lib/site";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function buildCategoryMetadata(landingPage: CategoryLandingPage) {
  const canonicalUrl = absoluteUrl(`/collections/category/${landingPage.slug}`);

  return {
    title: `${landingPage.title} | CigarroElectrico`,
    description: landingPage.description,
    keywords: [...brandKeywords, ...landingPage.keywords],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${landingPage.title} | CigarroElectrico`,
      description: landingPage.description,
      url: canonicalUrl,
      images: [absoluteUrl("/opengraph-image.png")],
    },
    twitter: {
      card: "summary_large_image",
      title: `${landingPage.title} | CigarroElectrico`,
      description: landingPage.description,
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
  const landingPage = getCategoryLandingPage(slug);

  if (!landingPage) {
    notFound();
  }

  const canonicalUrl = absoluteUrl(`/collections/category/${landingPage.slug}`);
  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: landingPage.title,
    description: landingPage.description,
    url: canonicalUrl,
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
        name: landingPage.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(categorySchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <CollectionsClient initialCategorySlug={landingPage.slug} />
    </>
  );
}
