import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // Gzip/Brotli compression for all responses
  compress: true,

  // Never expose source maps to end-users in production
  productionBrowserSourceMaps: false,

  // Tree-shake icon/animation libraries so only the imports you use are bundled.
  // This is the single biggest JS reduction available — lucide-react bundles
  // all ~600 icons by default; this limits it to the ~10 icons actually imported.
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  // 1. Clears the cross-origin warning for your local network testing
  allowedDevOrigins: ["192.168.101.1", "localhost"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.cigarroelectrico.com",
        pathname: "/**",
      },
      // Note: If you have placeholder images from other sites (like dummyjson.com or an AWS bucket),
      // you can just add another block right here!
    ],

    // 2. CLOUDFLARE PAGES OPTIMIZATION:
    // Next.js default image optimization requires a Node.js server.
    // If your build fails on Cloudflare Pages complaining about Image Optimization,
    // uncomment the line below to disable the Node-based optimizer.
    // unoptimized: true,
  },

  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
