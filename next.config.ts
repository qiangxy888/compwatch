import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  // better-sqlite3 is server-only
  serverExternalPackages: ['better-sqlite3', 'playwright-core'],
};

export default nextConfig;
