import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/7.x/**',
      },
      {
        protocol: 'https',
        hostname: 'image.cnbcfm.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static2.finnhub.io',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
