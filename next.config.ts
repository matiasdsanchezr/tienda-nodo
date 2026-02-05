import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://images.fravega.com/**"),
      new URL("https://img.freepik.com/**"),
    ],
  },
};

export default nextConfig;
