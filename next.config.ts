import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  },
};

export default nextConfig;
