// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   experimental: {
//     viewTransition: true,
//   },
//   allowedDevOrigins: ["*"],
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },

  // allow dev origins
  allowedDevOrigins: ["*"],

  // 🔥 This is the fix: prevent old chunk caching
  headers: async () => [
    {
      source: "/_next/static/:path*",
      headers: [
        { key: "Cache-Control", value: "no-store, must-revalidate" },
      ],
    },
    {
      // optional: prevent caching HTML pages
      source: "/:path*",
      headers: [
        { key: "Cache-Control", value: "no-store, must-revalidate" },
      ],
    },
  ],
};

export default nextConfig;
