"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
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

    axios
      .get(apiUrl("/users/wishlist"), { headers: getAuthHeaders() })
      .then((res) => {
        if (!active) return;
        const data = Array.isArray(res.data) ? res.data : [];
        setWishlist(data);
      })
      .catch(() => {
        if (active) {
          setWishlist([]);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
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
        const res = await axios.post(
          apiUrl("/users/wishlist/toggle"),
          { productKey },
          { headers: getAuthHeaders() },
        );
        const confirmed: string[] = Array.isArray(res.data) ? res.data : next;
        setWishlist(confirmed);
        window.dispatchEvent(
          new CustomEvent<string[]>(WISHLIST_EVENT, { detail: confirmed }),
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
