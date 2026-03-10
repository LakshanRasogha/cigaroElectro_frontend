import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Clears the cross-origin warning for your local network testing
  allowedDevOrigins: ["192.168.101.1", "localhost"],

  images: {
    remotePatterns: [
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
};

export default nextConfig;
