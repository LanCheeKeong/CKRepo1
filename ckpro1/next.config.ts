import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true, // 307 Temporary Redirect
      },
    ];
  }
};

export default nextConfig;
