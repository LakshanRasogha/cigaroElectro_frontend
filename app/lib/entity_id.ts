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
