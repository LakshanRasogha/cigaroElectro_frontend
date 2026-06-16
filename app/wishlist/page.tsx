"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/navbar";
import { apiUrl, apiFetch } from "@/app/lib/api";
import { useWishlist } from "@/app/lib/wishlist";
import { getProductSlug } from "@/app/lib/entity_id";
import {
  buildProductListPath,
  collectAllProductPages,
  type ProductListResponse,
} from "@/app/lib/products";
import type { Product } from "@/app/lib/types";

const WishlistPage = () => {
  const router = useRouter();
  const { wishlist, toggle, loading: wishlistLoading } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadedWishlistKey, setLoadedWishlistKey] = useState("");

  // Auth guard
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) router.push("/auth/login");
  }, [router]);

  // Fetch full product details for all wishlisted keys
  useEffect(() => {
    if (wishlistLoading) return;
    if (wishlist.length === 0) return;

    let active = true;
    const requestKey = [...wishlist].sort().join("|");

    collectAllProductPages(
      async (options) => {
        const response = await apiFetch<ProductListResponse>(
          apiUrl(buildProductListPath(options)),
        );
        return response.data;
      },
      {
        includeVariants: false,
        pageSize: 50,
      },
    )
      .then((result) => {
        if (!active) return;
        setProducts(result.products.filter((product) => wishlist.includes(product.key)));
        setLoadedWishlistKey(requestKey);
      })
      .catch(() => {
        if (active) {
          setProducts([]);
          setLoadedWishlistKey(requestKey);
        }
      });

    return () => {
      active = false;
    };
  }, [wishlist, wishlistLoading]);

  const currentWishlistKey = [...wishlist].sort().join("|");
  const visibleProducts = products.filter((product) =>
    wishlist.includes(product.key),
  );
  const isLoading =
    wishlistLoading ||
    (wishlist.length > 0 && loadedWishlistKey !== currentWishlistKey);

  return (
    <main className="min-h-screen bg-[#030303] text-white selection:bg-[#D4AF37]/30 overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1a1a1a,_#000000)]" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#D4AF37] rounded-full blur-[128px] opacity-5" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#D4AF37] rounded-full blur-[128px] opacity-5" />
      </div>

      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 text-[#D4AF37] mb-3">
            <div className="p-1.5 bg-[#D4AF37]/10 rounded-lg border border-[#D4AF37]/30">
              <Sparkles size={12} className="fill-current" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#D4AF37]/80">
              Your Collection
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F2D37D] to-[#AA771C]">
              Wishlist
            </span>
          </h1>
          {!isLoading && (
            <p className="text-zinc-600 text-[10px] font-mono mt-2 uppercase tracking-widest">
              {visibleProducts.length} {visibleProducts.length === 1 ? "item" : "items"} saved
            </p>
          )}
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="animate-spin text-[#D4AF37]" size={32} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">
              Loading Wishlist...
            </span>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && visibleProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mb-6">
              <Heart size={32} className="text-[#D4AF37]/50" />
            </div>
            <h2 className="text-xl font-black text-white mb-2">Nothing saved yet</h2>
            <p className="text-zinc-500 text-sm mb-8 max-w-xs">
              Tap the heart icon on any product to add it to your wishlist.
            </p>
            <button
              onClick={() => router.push("/collections")}
              className="flex items-center gap-2 px-8 py-3 bg-[#D4AF37] text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#c9a432] transition-colors"
            >
              Browse Collection <ArrowRight size={14} />
            </button>
          </motion.div>
        )}

        {/* Products grid */}
        {!isLoading && visibleProducts.length > 0 && (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
          >
            <AnimatePresence mode="popLayout">
              {visibleProducts.map((product, idx) => (
                <WishlistCard
                  key={product.key}
                  product={product}
                  idx={idx}
                  onRemove={() => toggle(product.key)}
                  onView={() =>
                    router.push(`/collections/${getProductSlug(product)}`)
                  }
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </main>
  );
};

// ── Wishlist product card ───────────────────────────────────────────────────────
const WishlistCard = ({
  product,
  idx,
  onRemove,
  onView,
}: {
  product: Product;
  idx: number;
  onRemove: () => void;
  onView: () => void;
}) => {
  const [removing, setRemoving] = useState(false);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRemoving(true);
    setTimeout(() => onRemove(), 200);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: removing ? 0 : 1, scale: removing ? 0.9 : 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: idx * 0.04 }}
      onClick={onView}
      className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 hover:border-[#D4AF37]/30 cursor-pointer shadow-lg hover:shadow-[0_10px_30px_rgba(212,175,55,0.1)] transition-all duration-300"
    >
      {/* Image */}
      <img
        src={product.productImage?.[0] || "/placeholder.jpg"}
        alt={product.name}
        className="w-full h-full object-cover opacity-70 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/60 to-transparent" />

      {/* Remove (heart) button */}
      <button
        onClick={handleRemove}
        className="absolute top-3 right-3 w-9 h-9 bg-black/70 backdrop-blur-xl rounded-full flex items-center justify-center border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 transition-all z-10 active:scale-90"
      >
        <Heart size={15} className="fill-[#D4AF37] text-[#D4AF37]" />
      </button>

      {/* Category badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="px-2 py-0.5 bg-black/70 backdrop-blur-md text-[#D4AF37] rounded-full text-[6px] font-black uppercase tracking-wider border border-[#D4AF37]/30">
          {product.category?.slice(0, 8)}
        </span>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
        <h3 className="text-xs font-bold text-white mb-0.5 line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-black text-zinc-300">
            Rs. {Number(product.basePrice).toLocaleString()}
          </span>
          <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">
            View <ArrowRight size={10} />
          </div>
        </div>
      </div>

      {/* Remove overlay on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4AF37]/0 via-[#D4AF37]/30 to-[#D4AF37]/0" />
      </div>
    </motion.div>
  );
};

export default WishlistPage;
