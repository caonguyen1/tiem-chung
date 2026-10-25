import type { NextConfig } from "next";

// `DEMO_EXPORT=1 pnpm build` writes a static copy of the site to `out/` so it can
// be shared with the client before a server exists.
const isDemoExport = process.env.DEMO_EXPORT === "1";

const nextConfig: NextConfig = {
  // Static export cannot run partial prerendering, so the demo build turns it off.
  cacheComponents: !isDemoExport,
  partialPrefetching: !isDemoExport,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  ...(isDemoExport && {
    output: "export",
    images: { unoptimized: true },
  }),
};

export default nextConfig;
