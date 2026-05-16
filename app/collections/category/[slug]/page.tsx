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

  const relatedPages = categoryLandingPages.filter(
    (page) => page.slug !== landingPage.slug,
  );

  return (
    <>
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
      <main className='min-h-screen bg-[#050505] px-4 pb-20 pt-20 text-white selection:bg-[#D4AF37]/30 sm:px-6 lg:px-10'>
        <div className='mx-auto max-w-7xl'>
          <div className='rounded-[2rem] border border-[#D4AF37]/15 bg-white/[0.03] p-6 sm:p-8 backdrop-blur-xl'>
            <p className='text-[10px] font-black uppercase tracking-[0.35em] text-[#D4AF37]'>
              Category Landing Page
            </p>
            <h1 className='mt-4 text-3xl font-black uppercase tracking-tight text-white sm:text-5xl'>
              {landingPage.headline}
            </h1>
            <p className='mt-4 max-w-4xl text-base leading-8 text-zinc-300 sm:text-xl'>
              {landingPage.description}
            </p>
          </div>
        </div>

        <div className='sticky top-20 z-40 mt-5 sm:top-24'>
          <div className='mx-auto max-w-7xl rounded-[1.5rem] border border-[#D4AF37]/15 bg-[#050505]/90 p-3 backdrop-blur-xl'>
            <div className='flex flex-nowrap gap-3 overflow-x-auto no-scrollbar sm:flex-wrap'>
              <Link
                href='/collections'
                className='rounded-full border border-[#D4AF37]/30 px-5 py-3 text-[11px] font-black uppercase tracking-[0.25em] text-[#D4AF37] transition-colors hover:bg-[#D4AF37] hover:text-black whitespace-nowrap'
              >
                View All Collections
              </Link>
              {relatedPages.map((page) => (
                <Link
                  key={page.slug}
                  href={`/collections/category/${page.slug}`}
                  className='rounded-full border border-white/10 bg-black/30 px-5 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-200 transition-colors hover:border-[#D4AF37]/40 hover:text-[#D4AF37] whitespace-nowrap'
                >
                  {page.title}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className='mx-auto mt-10 max-w-7xl'>
          <div className='flex items-center justify-between gap-4'>
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
                  disableImageEffects
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
    </>
  );
}
