import "server-only";

import type { Product } from "@/app/lib/types";
import {
  buildProductListPath,
  collectAllProductPages,
  resolveProductListResponse,
  type ProductListOptions,
  type ProductListResponse,
} from "@/app/lib/products";
import {
  apiBaseUrl,
  getCategoryLandingPage,
  normalizeCategory,
  type CategoryLandingPage,
} from "@/app/lib/site";

async function fetchCatalog<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    next: { revalidate: 600 },
  });

  if (!response.ok) {
    throw new Error(`Catalog request failed for ${path}`);
  }

  return (await response.json()) as T;
}

export async function fetchProductSummaries(
  options: ProductListOptions = {},
) {
  const data = await fetchCatalog<ProductListResponse>(
    buildProductListPath({
      ...options,
      includeVariants: false,
    }),
  );

  return resolveProductListResponse(data, options);
}

export async function fetchAllProducts(): Promise<Product[]> {
  const { products } = await collectAllProductPages((options) =>
    fetchCatalog<ProductListResponse>(buildProductListPath(options)),
  );
  return products;
}

export async function fetchAllProductsSafe(): Promise<Product[]> {
  try {
    return await fetchAllProducts();
  } catch {
    return [];
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    return await fetchCatalog<Product>(
      `/products/getOne/${encodeURIComponent(slug)}?includeVariants=true`,
    );
  } catch {
    return null;
  }
}

export function getProductsForCategoryPage(
  products: Product[],
  landingPage: CategoryLandingPage,
) {
  const allowedCategories = new Set(
    landingPage.categories.map((category) => normalizeCategory(category)),
  );

  return products.filter((product) =>
    allowedCategories.has(normalizeCategory(product.category)),
  );
}

export async function fetchProductsForCategorySlug(slug: string) {
  const landingPage = getCategoryLandingPage(slug);

  if (!landingPage) {
    return { landingPage: null, products: [] as Product[] };
  }

  const products = await fetchAllProductsSafe();
  return {
    landingPage,
    products: getProductsForCategoryPage(products, landingPage),
  };
}
