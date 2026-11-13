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
  ...(isDemoExport
    ? {
        output: "export",
        images: { unoptimized: true },
      }
    : {
        // Static export cannot set headers; the server build can.
        async headers() {
          return [
            {
              source: "/:path*",
              headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                // Nobody else may frame the site (the Google Maps embed is framed *by* us, which is unaffected).
                { key: "X-Frame-Options", value: "SAMEORIGIN" },
                // Location is used by "Trung tâm gần tôi"; everything else sensitive stays off.
                { key: "Permissions-Policy", value: "geolocation=(self), camera=(), microphone=(), payment=()" },
              ],
            },
            {
              // The admin never gets cached by the browser or a proxy, and is never indexed.
              source: "/admin/:path*",
              headers: [
                { key: "Cache-Control", value: "no-store" },
                { key: "X-Robots-Tag", value: "noindex, nofollow" },
              ],
            },
          ];
        },
      }),
};

export default nextConfig;
