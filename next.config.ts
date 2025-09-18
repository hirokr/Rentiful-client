import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com/**",
        port: "",
        pathname: "**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "uploadthing.com/**",
        port: "",
        pathname: "**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "gbyzx0ooun.ufs.sh/**",
        port: "",
        pathname: "**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
