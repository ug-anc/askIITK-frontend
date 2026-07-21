// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;


import type { NextConfig } from "next";
import { API_BASE_URL } from "./lib/api";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_BASE_URL}/api/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "anc-website-blond.vercel.app",
        port: "",
        pathname: "/**", // Allows all sub-paths including logo assets
      },
    ],
  },
};

export default nextConfig;