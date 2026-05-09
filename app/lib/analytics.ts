/**
 * Analytics tracking helpers.
 * All calls are fire-and-forget — errors are silently swallowed so they
 * never block the user's primary action (click / add-to-cart).
 */
import { apiUrl } from "./api";

function fireAndForget(url: string) {
  fetch(url, { method: "POST" }).catch(() => {
    // intentionally ignored
  });
}

/** Call when a product card is clicked/viewed */
export function trackProductClick(productKey: string) {
  if (!productKey) return;
  fireAndForget(apiUrl(`/analytics/click/${encodeURIComponent(productKey)}`));
}

/** Call when a product variant is added to cart */
export function trackCartAdd(productKey: string) {
  if (!productKey) return;
  fireAndForget(apiUrl(`/analytics/cart/${encodeURIComponent(productKey)}`));
}
