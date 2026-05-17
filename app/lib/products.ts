import type { Product } from "@/app/lib/types";

export interface ProductListOptions {
  limit?: number;
  offset?: number;
  query?: string;
  includeVariants?: boolean;
}

export interface ProductListPayload {
  products?: Product[];
  total?: number;
  hasMore?: boolean;
  nextOffset?: number | null;
}

export interface ProductListResult {
  products: Product[];
  total: number;
  hasMore: boolean;
  nextOffset: number | null;
}

export type ProductListResponse = Product[] | ProductListPayload;
export type ProductListPageFetcher = (
  options: ProductListOptions,
) => Promise<ProductListResponse>;

export const DEFAULT_PRODUCT_PAGE_SIZE = 24;

function matchesProductQuery(product: Product, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return [product.name, product.category, product.tagline]
    .filter((value): value is string => typeof value === "string")
    .some((value) => value.toLowerCase().includes(normalizedQuery));
}

export function buildProductListPath({
  limit,
  offset,
  query,
  includeVariants = false,
}: ProductListOptions = {}) {
  const searchParams = new URLSearchParams();

  if (typeof limit === "number") {
    searchParams.set("limit", String(limit));
  }

  if (typeof offset === "number") {
    searchParams.set("offset", String(offset));
  }

  if (query?.trim()) {
    searchParams.set("q", query.trim());
  }

  searchParams.set("includeVariants", includeVariants ? "true" : "false");

  const queryString = searchParams.toString();
  return queryString ? `/products/get?${queryString}` : "/products/get";
}

export function resolveProductListResponse(
  response: ProductListResponse,
  { limit, offset = 0, query }: ProductListOptions = {},
): ProductListResult {
  if (Array.isArray(response)) {
    const filteredProducts = query?.trim()
      ? response.filter((product) => matchesProductQuery(product, query))
      : response;
    const sliceLimit = typeof limit === "number" ? limit : filteredProducts.length;
    const products = filteredProducts.slice(offset, offset + sliceLimit);
    const total = filteredProducts.length;
    const hasMore = offset + products.length < total;

    return {
      products,
      total,
      hasMore,
      nextOffset: hasMore ? offset + products.length : null,
    };
  }

  const products = Array.isArray(response.products) ? response.products : [];
  const total =
    typeof response.total === "number" ? response.total : offset + products.length;
  const hasMore =
    typeof response.hasMore === "boolean"
      ? response.hasMore
      : typeof limit === "number"
        ? products.length >= limit
        : false;

  return {
    products,
    total,
    hasMore,
    nextOffset:
      typeof response.nextOffset === "number"
        ? response.nextOffset
        : hasMore
          ? offset + products.length
          : null,
  };
}

export async function collectAllProductPages(
  fetchPage: ProductListPageFetcher,
  {
    query,
    includeVariants = false,
    pageSize = DEFAULT_PRODUCT_PAGE_SIZE,
  }: {
    query?: string;
    includeVariants?: boolean;
    pageSize?: number;
  } = {},
): Promise<ProductListResult> {
  const products: Product[] = [];
  const seenOffsets = new Set<number>();
  let offset = 0;
  let total = 0;

  while (!seenOffsets.has(offset)) {
    seenOffsets.add(offset);

    const page = resolveProductListResponse(
      await fetchPage({
        limit: pageSize,
        offset,
        query,
        includeVariants,
      }),
      {
        limit: pageSize,
        offset,
        query,
      },
    );

    products.push(...page.products);
    total = Math.max(total, page.total, products.length);

    if (!page.hasMore || page.nextOffset === null || page.products.length === 0) {
      break;
    }

    offset = page.nextOffset;
  }

  return {
    products,
    total,
    hasMore: false,
    nextOffset: null,
  };
}

export function getProductVariantCount(product: Product) {
  if (typeof product.variantCount === "number") {
    return product.variantCount;
  }

  return Array.isArray(product.variants) ? product.variants.length : 0;
}

export function getProductHasStock(product: Product) {
  if (typeof product.hasStock === "boolean") {
    return product.hasStock;
  }

  if (Array.isArray(product.variants) && product.variants.length > 0) {
    return product.variants.some(
      (variant) => Number(variant.stock || 0) > 0 && variant.availability,
    );
  }

  return true;
}
