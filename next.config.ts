import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  // Les images du canvas GrapesJS sont en chemin relatif, servies par l'API.
  async rewrites() {
    return [{ source: "/images/:path*", destination: `${apiUrl}/images/:path*` }];
  },
  experimental: {
    viewTransition: true,
  },
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
