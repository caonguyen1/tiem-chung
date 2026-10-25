import type { Metadata, Viewport } from "next";
import { Google_Sans_Flex } from "next/font/google";

import { siteSettings } from "@/content/site";

import "./globals.css";

const googleSansFlex = Google_Sans_Flex({
  variable: "--font-google-sans-flex",
  subsets: ["latin", "vietnamese"],
  weight: "variable",
  axes: ["ROND", "opsz"],
  display: "swap",
  // next/font has no metric overrides for this family yet, so skip the generated fallback.
  adjustFontFallback: false,
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteSettings.name} – ${siteSettings.slogan}`,
    template: `%s | ${siteSettings.shortName}`,
  },
  description: siteSettings.description,
  applicationName: siteSettings.shortName,
  icons: { icon: "/images/logo-mark.png" },
};

export const viewport: Viewport = {
  themeColor: "#283c96",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${googleSansFlex.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
