import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/restaurant", destination: "/", permanent: true },
      { source: "/menu", destination: "/catering", permanent: true },
      { source: "/contact", destination: "/inquiry", permanent: true },
      { source: "/spaces", destination: "/venue/spaces", permanent: true },
      { source: "/events", destination: "/", permanent: true },
      { source: "/venue", destination: "/venue/spaces", permanent: true },
      { source: "/private-venue-nevada-city", destination: "/inquiry", permanent: false },
    ];
  },
};

export default nextConfig;
