import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/app/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/admin",
          "/profile",
          "/wishlist",
          "/checkout",
          "/api",
          "/search",
          // Block internal search routing, sorting, and pagination parameters
          "/*?*query=",
          "/*?*limit=",
          "/*?*offset=",
          "/*?*categories=",
          // Prevent duplicate indexing from social and marketing attribution tracking
          "/*?*utm_*",
          "/*?*fbclid",
          "/*?*gclid",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}