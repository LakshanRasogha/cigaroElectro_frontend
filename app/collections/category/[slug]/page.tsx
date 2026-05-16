import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/app/components/navbar";
import ProductCard from "@/app/components/product_card";
import { fetchProductsForCategorySlug } from "@/app/lib/catalog";
import { getListKey } from "@/app/lib/entity_id";
import {
  absoluteUrl,
  brandKeywords,
  categoryLandingPages,
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
  const { landingPage } = await fetchProductsForCategorySlug(slug);

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

  const canonicalUrl = absoluteUrl(`/collections/category/${landingPage.slug}`);

  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: landingPage.title,
    description: landingPage.description,
    url: canonicalUrl,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/collections/${product.slug || product.key}`),
        name: product.name,
      })),
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
        name: landingPage.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <main className='min-h-screen bg-[#050505] px-4 pb-20 pt-32 text-white selection:bg-[#D4AF37]/30 sm:px-6 lg:px-10'>
      <Navbar />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(categorySchema),
        }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <div className='mx-auto max-w-7xl'>
        <div className='rounded-[2rem] border border-[#D4AF37]/15 bg-white/[0.03] p-8 backdrop-blur-xl'>
          <p className='text-[10px] font-black uppercase tracking-[0.35em] text-[#D4AF37]'>
            Category Landing Page
          </p>
          <h1 className='mt-4 text-3xl font-black uppercase tracking-tight text-white sm:text-5xl'>
            {landingPage.headline}
          </h1>
          <p className='mt-4 max-w-3xl text-sm leading-7 text-zinc-300 sm:text-base'>
            {landingPage.description}
          </p>

          <div className='mt-6 flex flex-wrap gap-3'>
            <Link
              href='/collections'
              className='rounded-full border border-[#D4AF37]/30 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#D4AF37] transition-colors hover:bg-[#D4AF37] hover:text-black'
            >
              View All Collections
            </Link>
            {categoryLandingPages
              .filter((page) => page.slug !== landingPage.slug)
              .slice(0, 3)
              .map((page) => (
                <Link
                  key={page.slug}
                  href={`/collections/category/${page.slug}`}
                  className='rounded-full border border-white/10 bg-black/30 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-200 transition-colors hover:border-[#D4AF37]/40 hover:text-[#D4AF37]'
                >
                  {page.title}
                </Link>
              ))}
          </div>
        </div>

        <div className='mt-10 flex items-center justify-between gap-4'>
          <p className='text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500'>
            {products.length} Products
          </p>
          <Link
            href='/contact'
            className='text-[10px] font-black uppercase tracking-[0.25em] text-[#D4AF37] hover:underline'
          >
            Need help choosing?
          </Link>
        </div>

        {products.length > 0 ? (
          <div className='mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {products.map((product) => (
              <ProductCard
                key={getListKey(product, product.key)}
                productKey={product.key}
                slug={product.slug}
                name={product.name}
                tagline={product.tagline}
                basePrice={product.basePrice}
                productImage={product.productImage}
                variants={product.variants}
                category={product.category}
              />
            ))}
          </div>
        ) : (
          <div className='mt-10 rounded-[2rem] border border-white/10 bg-white/[0.02] p-10 text-center text-zinc-400'>
            No products are published in this category yet.
          </div>
        )}
      </div>
    </main>
  );
}
