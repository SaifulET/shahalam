import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "real-estate-projects-s3.s3.eu-north-1.amazonaws.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
