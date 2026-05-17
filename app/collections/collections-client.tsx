"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Search, LayoutGrid, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import Navbar from "../components/navbar";
import ProductCard from "../components/product_card";
import { apiUrl } from "@/app/lib/api";
import { staticAssets } from "@/app/lib/assets";
import {
  buildProductListPath,
  resolveProductListResponse,
} from "@/app/lib/products";
import { categoryLandingPages } from "@/app/lib/site";
import type { Product } from "@/app/lib/types";

const PAGE_SIZE = 8;

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [bestsellerKeys, setBestsellerKeys] = useState<Set<string>>(new Set());
  const [totalProducts, setTotalProducts] = useState(0);
  const [nextOffset, setNextOffset] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 250);

    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    let active = true;

    const fetchProducts = async () => {
      setLoading(true);

      try {
        const response = await axios.get(
          apiUrl(
            buildProductListPath({
              limit: PAGE_SIZE,
              offset: 0,
              query: debouncedSearchQuery,
              includeVariants: false,
            }),
          ),
        );

        if (!active) return;

        const result = resolveProductListResponse(response.data, {
          limit: PAGE_SIZE,
          offset: 0,
          query: debouncedSearchQuery,
        });

        setProducts(result.products);
        setTotalProducts(result.total);
        setHasMore(result.hasMore);
        setNextOffset(result.nextOffset);
      } catch (error) {
        if (!active) return;
        console.error("Failed to fetch inventory:", error);
        setProducts([]);
        setTotalProducts(0);
        setHasMore(false);
        setNextOffset(null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      active = false;
    };
  }, [debouncedSearchQuery]);

  useEffect(() => {
    axios
      .get(apiUrl("/analytics/bestseller-keys?limit=20"))
      .then((res) => {
        const keys: string[] = Array.isArray(res.data) ? res.data : [];
        setBestsellerKeys(new Set(keys));
      })
      .catch(() => {});
  }, []);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore || nextOffset === null) {
      return;
    }

    setLoadingMore(true);

    try {
      const response = await axios.get(
        apiUrl(
          buildProductListPath({
            limit: PAGE_SIZE,
            offset: nextOffset,
            query: debouncedSearchQuery,
            includeVariants: false,
          }),
        ),
      );

      const result = resolveProductListResponse(response.data, {
        limit: PAGE_SIZE,
        offset: nextOffset,
        query: debouncedSearchQuery,
      });

      setProducts((prev) => [...prev, ...result.products]);
      setTotalProducts(result.total);
      setHasMore(result.hasMore);
      setNextOffset(result.nextOffset);
    } catch (error) {
      console.error("Failed to load more inventory:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  const resultsLabel = useMemo(() => {
    if (loading) {
      return "Syncing inventory...";
    }

    if (totalProducts === 0) {
      return "0 items found";
    }

    if (products.length >= totalProducts) {
      return `${totalProducts} ${totalProducts === 1 ? "item" : "items"} found`;
    }

    return `Showing ${products.length} of ${totalProducts} items`;
  }, [loading, products.length, totalProducts]);

  return (
    <main className="relative min-h-screen bg-[#030303] selection:bg-[#D4AF37]/30 overflow-x-hidden">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1a1a1a,_#000000)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMTBhMjAgMjAgMCAwIDEgMjAgMjAgMjAgMjAgMCAwIDEtNDAgMCAyMCAyMCAwIDAgMSAyMC0yMHoiIGZpbGw9IiNENEFGMzciIGZpbGwtb3BhY2l0eT0iMC4wMyIvPjwvc3ZnPg==')] opacity-20" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#D4AF37] rounded-full blur-[128px] opacity-10" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#D4AF37] rounded-full blur-[128px] opacity-10" />
      </div>

      <Navbar />

      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={staticAssets.backgroundPattern}
          alt="Background Pattern"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-transparent to-[#030303]" />
      </div>

      <div className="relative z-10 pt-16 sm:pt-20 md:pt-24 lg:pt-32 pb-12 sm:pb-16 px-3 sm:px-4 md:px-6 lg:px-8">
        <header className="max-w-7xl mx-auto mt-8 mb-6 sm:mb-8 md:mb-12">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[#D4AF37] mb-3 sm:mb-4">
            <div className="p-1 bg-gradient-to-br from-[#D4AF37]/20 to-transparent rounded-lg border border-[#D4AF37]/30 backdrop-blur-md">
              <Sparkles size={10} className="sm:hidden fill-current" />
              <Sparkles size={12} className="hidden sm:block fill-current" />
            </div>
            <span className="font-bold text-[6px] sm:text-[7px] md:text-[8px] lg:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] md:tracking-[0.25em] text-[#D4AF37]/80">
              Global Inventory Sync
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 sm:gap-4">
            <h1
              className="text-3xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white tracking-tighter leading-none"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Collection
            </h1>

            <div className="w-full lg:w-72 xl:w-80">
              <div className="relative group w-full">
                <Search
                  className={`absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                    isSearchFocused ? "text-[#D4AF37]" : "text-zinc-600"
                  }`}
                  size={14}
                />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full bg-gradient-to-r from-white/[0.02] to-white/[0.05] backdrop-blur-3xl border border-white/10 py-2.5 sm:py-3 pl-8 pr-8 rounded-xl outline-none focus:border-[#D4AF37]/50 transition-all text-xs text-white placeholder:text-zinc-700 font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-[#D4AF37] transition-colors text-xs"
                  >
                    x
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {categoryLandingPages.map((page) => (
              <Link
                key={page.slug}
                href={`/collections/category/${page.slug}`}
                className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-5 py-3 text-[10px] font-black uppercase tracking-[0.24em] text-[#D4AF37] transition-all hover:bg-[#D4AF37] hover:text-black"
              >
                {page.title}
              </Link>
            ))}
          </div>

          <div className="mt-3 sm:mt-4 text-[8px] sm:text-[9px] md:text-[10px] text-zinc-600 font-mono">
            {resultsLabel}
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <Loader2 className="w-10 h-10 animate-spin text-[#D4AF37] mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">
              Loading Products...
            </p>
          </div>
        ) : (
          <>
            <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
              {products.map((product) => (
                <ProductCard
                  key={product.key}
                  productKey={product.key}
                  slug={product.slug}
                  name={product.name}
                  tagline={product.tagline}
                  basePrice={product.basePrice}
                  productImage={product.productImage}
                  variants={product.variants}
                  variantCount={product.variantCount}
                  hasStock={product.hasStock}
                  category={product.category}
                  isBestSeller={bestsellerKeys.has(product.key)}
                  disableImageEffects
                />
              ))}
            </div>

            {!loading && products.length === 0 && (
              <div className="text-center py-16 sm:py-20 md:py-24">
                <div className="inline-flex p-3 sm:p-4 rounded-full bg-gradient-to-br from-white/5 to-white/[0.02] mb-3 sm:mb-4 border border-white/10 backdrop-blur-md">
                  <LayoutGrid className="text-zinc-700" size={20} />
                </div>
                <p className="text-[#D4AF37]/60 text-sm sm:text-base md:text-lg font-light">
                  No hardware found matching these coordinates.
                </p>
              </div>
            )}

            {hasMore && products.length > 0 && (
              <div className="max-w-7xl mx-auto mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="min-w-48 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-8 py-4 text-[11px] font-black uppercase tracking-[0.3em] text-[#D4AF37] transition-all hover:bg-[#D4AF37] hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loadingMore ? "Loading..." : "See More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default ProductsPage;
