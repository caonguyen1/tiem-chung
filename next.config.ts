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
  // Khách đã chọn layout C (2026-11-04): trang chủ "/" hiển thị bản layout C
  // (public/prototypes/layout-c.html); trang chủ Next.js cũ chuyển sang /trang-chu-cu
  // để khách so sánh. Bỏ rewrite này khi layout C được dựng lại bằng component.
  ...(!isDemoExport && {
    async rewrites() {
      return { beforeFiles: [{ source: "/", destination: "/prototypes/layout-c.html" }] };
    },
  }),
};

export default nextConfig;
