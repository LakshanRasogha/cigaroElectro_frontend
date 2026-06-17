import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/app/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/profile",
          "/wishlist",
          "/checkout",
          "/api",
          "/search",
          // Block internal search, pagination, and filter query parameters to protect crawl budget
          "/*?*query=",
          "/*?*limit=",
          "/*?*offset=",
          "/*?*categories=",
          // Block common tracking query parameters to prevent duplicate page indexing
          "/*?*utm_*",
          "/*?*fbclid",
          "/*?*gclid",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}