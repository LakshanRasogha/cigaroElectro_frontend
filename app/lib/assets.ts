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
export const optimizeCloudinaryUrl = (url: string, extraTransforms = ""): string => {
  if (!url) return url;
  const uploadMarker = "/image/upload/";
  const idx = url.indexOf(uploadMarker);
  if (idx === -1) return url;
  const base = url.slice(0, idx + uploadMarker.length);
  const rest = url.slice(idx + uploadMarker.length);
  
  // Robust check: Split the rest of the path by '/' to see if the first segment has transforms
  const segments = rest.split("/");
  if (segments.length > 1) {
    const firstSegment = segments[0];
    const parts = firstSegment.split(",");
    
    // Check if all comma-separated parts in the first segment are known Cloudinary transforms
    const isTransform = parts.length > 0 && parts.every(part =>
      /^(f|q|w|h|c|r|e|bg|co|pg|fl|dpr|ar|x|y|a|l|u|o|dl|md)_/.test(part)
    );
    if (isTransform) {
      return url; // Already transformed
    }
  }
  
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
  poster: optimizeCloudinaryUrl(
    resolveAssetUrl(process.env.NEXT_PUBLIC_ASSET_POSTER, "/Poster.jpeg"),
    "f_auto,q_auto:good,w_1000",
  ),
  aboutVideo: resolveAssetUrl(
    process.env.NEXT_PUBLIC_ASSET_ABOUT_VIDEO,
    "/vape4.mp4",
  ),
  cartVideo: resolveAssetUrl(
    process.env.NEXT_PUBLIC_ASSET_CART_VIDEO,
    "/vape2.mp4",
  ),
} as const;

