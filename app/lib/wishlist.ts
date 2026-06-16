"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiUrl, getAuthHeaders } from "@/app/lib/api";

/** Fires whenever the wishlist changes so other components can react */
export const WISHLIST_EVENT = "wishlistUpdated";

export function useWishlist() {
  const router = useRouter();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(() => {
    if (typeof window === "undefined") return true;
    return !!localStorage.getItem("token");
  });

  const isLoggedIn = () => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("token");
  };

  /** Load wishlist from backend on mount */
  useEffect(() => {
    if (!isLoggedIn()) return;

    let active = true;

    fetch(apiUrl("/users/wishlist"), { headers: getAuthHeaders() })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch wishlist");
        return res.json() as Promise<string[]>;
      })
      .then((data) => {
        if (!active) return;
        setWishlist(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active) setWishlist([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  /** Sync across tabs / components */
  useEffect(() => {
    const sync = (e: Event) => {
      const detail = (e as CustomEvent<string[]>).detail;
      if (Array.isArray(detail)) setWishlist(detail);
    };
    window.addEventListener(WISHLIST_EVENT, sync);
    return () => window.removeEventListener(WISHLIST_EVENT, sync);
  }, []);

  const toggle = useCallback(
    async (productKey: string) => {
      if (!isLoggedIn()) {
        router.push("/auth/login");
        return;
      }
      // Optimistic update
      const next = wishlist.includes(productKey)
        ? wishlist.filter((k) => k !== productKey)
        : [...wishlist, productKey];
      setWishlist(next);
      window.dispatchEvent(
        new CustomEvent<string[]>(WISHLIST_EVENT, { detail: next }),
      );

      try {
        const res = await fetch(apiUrl("/users/wishlist/toggle"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({ productKey }),
        });
        if (!res.ok) throw new Error("Toggle failed");
        const confirmed: string[] = await res.json();
        const finalList = Array.isArray(confirmed) ? confirmed : next;
        setWishlist(finalList);
        window.dispatchEvent(
          new CustomEvent<string[]>(WISHLIST_EVENT, { detail: finalList }),
        );
      } catch {
        // rollback on error
        setWishlist(wishlist);
        window.dispatchEvent(
          new CustomEvent<string[]>(WISHLIST_EVENT, { detail: wishlist }),
        );
      }
    },
    [wishlist, router],
  );

  const isWishlisted = useCallback(
    (productKey: string) => wishlist.includes(productKey),
    [wishlist],
  );

  return { wishlist, toggle, isWishlisted, loading };
}
