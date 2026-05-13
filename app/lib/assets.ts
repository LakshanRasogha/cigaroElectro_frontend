const resolveAssetUrl = (value: string | undefined, fallback: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
};

export const staticAssets = {
  brandLogo: resolveAssetUrl(
    process.env.NEXT_PUBLIC_ASSET_BRAND_LOGO,
    "/logo.png",
  ),
  brandWordmark: resolveAssetUrl(
    process.env.NEXT_PUBLIC_ASSET_BRAND_WORDMARK,
    "/logo 2 gld.png",
  ),
  backgroundPattern: resolveAssetUrl(
    process.env.NEXT_PUBLIC_ASSET_BACKGROUND_PATTERN,
    "/ptern.png",
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
