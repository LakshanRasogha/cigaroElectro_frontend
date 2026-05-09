export function getEntityId(entity: {
  id?: string | null;
  _id?: string | null;
  key?: string | null;
  vKey?: string | null;
}): string {
  return entity.id || entity._id || entity.key || entity.vKey || "";
}

export function getListKey(
  entity: {
    id?: string | null;
    _id?: string | null;
    key?: string | null;
    vKey?: string | null;
    name?: string | null;
  },
  fallback: string | number,
): string {
  return getEntityId(entity) || entity.name || String(fallback);
}

/**
 * Returns the canonical URL segment for a product.
 * Prefers the backend-generated slug; falls back to key for backward compatibility.
 */
export function getProductSlug(product: {
  slug?: string | null;
  key?: string | null;
}): string {
  return product.slug || product.key || "";
}
