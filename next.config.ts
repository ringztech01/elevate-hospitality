import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "elevateng.co",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
