import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  images: {
    unoptimized: isDev,
    domains: ["127.0.0.1", "localhost", "api.helene-massage.fr", "massln.varascundo.com"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/images/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/images/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8001",
        pathname: "/images/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8001",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "api.helene-massage.fr",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "massln.varascundo.com",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
