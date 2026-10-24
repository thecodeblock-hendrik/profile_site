import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [],
    localPatterns: [{ pathname: "/_next/static/media/**" }],
    qualities: [75],
    dangerouslyAllowSVG: false,
  },
};

export default nextConfig;
