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
  fallbackApiBaseUrl,
  getCategoryLandingPage,
  getServerApiBaseUrl,
  normalizeCategory,
  type CategoryLandingPage,
} from "@/app/lib/site";

class CatalogRequestError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
  }
}

async function fetchCatalog<T>(path: string): Promise<T> {
  const serverApiBaseUrl = getServerApiBaseUrl();
  const candidateBaseUrls = [
    serverApiBaseUrl,
    ...(serverApiBaseUrl !== fallbackApiBaseUrl ? [fallbackApiBaseUrl] : []),
    ...(apiBaseUrl !== serverApiBaseUrl && apiBaseUrl !== fallbackApiBaseUrl
      ? [apiBaseUrl]
      : []),
  ];

  let lastStatus: number | undefined;

  for (const baseUrl of candidateBaseUrls) {
    const response = await fetchCatalogFrom<T>(baseUrl, path);

    if (response.ok) {
      return response.data;
    }

    lastStatus = response.status;
  }

  throw new CatalogRequestError(
    `Catalog request failed for ${path}`,
    lastStatus,
  );
}

async function fetchCatalogFrom<T>(baseUrl: string, path: string) {
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      next: { revalidate: 600 },
    });

    if (!response.ok) {
      return {
        ok: false as const,
        status: response.status,
      };
    }

    return {
      ok: true as const,
      data: (await response.json()) as T,
    };
  } catch {
    return {
      ok: false as const,
      status: undefined,
    };
  }
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
  } catch (error) {
    if (error instanceof CatalogRequestError && error.status === 404) {
      return null;
    }

    console.error(`Failed to fetch product detail for slug "${slug}".`, error);
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
