const resolveAssetUrl = (value: string | undefined, fallback: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
};

/**
 * Inject Cloudinary optimization transforms into a raw upload URL.
 * Converts:  .../image/upload/public_id
 * Into:      .../image/upload/f_auto,q_auto:good,w_auto/public_id
 * Falls back to the original URL if it doesn't look like a Cloudinary upload URL.
 */
const optimizeCloudinaryUrl = (url: string, extraTransforms = ""): string => {
  const uploadMarker = "/image/upload/";
  const idx = url.indexOf(uploadMarker);
  if (idx === -1) return url;
  const base = url.slice(0, idx + uploadMarker.length);
  const rest = url.slice(idx + uploadMarker.length);
  // Skip if transforms are already present (starts with a Cloudinary transform letter)
  const alreadyTransformed = /^[a-z_]+_/.test(rest);
  if (alreadyTransformed) return url;
  const transforms = extraTransforms || "f_auto,q_auto:good";
  return `${base}${transforms}/${rest}`;
};

export const staticAssets = {
  brandLogo: resolveAssetUrl(
    process.env.NEXT_PUBLIC_ASSET_BRAND_LOGO,
    "/logo.png",
  ),
  /** Optimized via Cloudinary transforms — served as WebP/AVIF, sized to fit */
  brandWordmark: optimizeCloudinaryUrl(
    resolveAssetUrl(
      process.env.NEXT_PUBLIC_ASSET_BRAND_WORDMARK,
      "/logo 2 gld.png",
    ),
    "f_auto,q_auto:good,w_300",
  ),
  /** Optimized pattern — heavy PNG reduced via Cloudinary auto-format + quality */
  backgroundPattern: optimizeCloudinaryUrl(
    resolveAssetUrl(
      process.env.NEXT_PUBLIC_ASSET_BACKGROUND_PATTERN,
      "/ptern.png",
    ),
    "f_auto,q_auto:eco,w_800",
  ),
  poster: resolveAssetUrl(process.env.NEXT_PUBLIC_ASSET_POSTER, "/Poster.jpeg"),
  aboutVideo: resolveAssetUrl(
    process.env.NEXT_PUBLIC_ASSET_ABOUT_VIDEO,
    "/vape4.mp4",
  ),
  cartVideo: resolveAssetUrl(
    process.env.NEXT_PUBLIC_ASSET_CART_VIDEO,
    "/vape2.mp4",
  ),
} as const;

