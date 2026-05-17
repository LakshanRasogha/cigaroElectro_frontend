# Product API Contract

This frontend now expects product list endpoints to support lightweight summary responses for better performance.

## List endpoint

`GET /products/get`

Supported query params:

- `limit`
- `offset`
- `q`
- `includeVariants`

Recommended response shape:

```json
{
  "products": [
    {
      "key": "elfbar-raya-d1",
      "slug": "elfbar-raya-d1",
      "name": "ELFBAR RAYA D 1",
      "tagline": "Experience the best",
      "basePrice": 8999,
      "category": "Disposable",
      "productImage": ["https://..."],
      "variantCount": 12,
      "hasStock": true
    }
  ],
  "total": 42,
  "hasMore": true,
  "nextOffset": 8
}
```

Behavior notes:

- When `includeVariants=false`, do not include full `variants` arrays in the list payload.
- `variantCount` should still be returned so cards can show the count badge.
- `hasStock` should be returned so cards can render out-of-stock state without loading variants.
- `q` should search at least `name`, `category`, and `tagline`.

## Detail endpoint

`GET /products/getOne/:slug?includeVariants=true`

Recommended behavior:

- Return the full product record with the full `variants` array.
- This endpoint is the click boundary where variant-heavy data is allowed to load.
