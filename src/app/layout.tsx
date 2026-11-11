import type { Metadata, Viewport } from "next";
import { Google_Sans_Flex } from "next/font/google";
import localFont from "next/font/local";

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

// SVN-Aptima is the brand font the client sent (2026-11-01). It ships only 400 and 700.
const aptima = localFont({
  variable: "--font-aptima",
  src: [
    { path: "../../public/fonts/svn-aptima-regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/svn-aptima-bold.ttf", weight: "700", style: "normal" },
  ],
  display: "swap",
  fallback: ["Google Sans Flex", "system-ui", "Segoe UI", "Arial", "sans-serif"],
});

// The site holds sample prices and placeholder doctors until launch, so search
// engines stay out unless the deployment sets SITE_INDEXABLE=1.
const indexable = process.env.SITE_INDEXABLE === "1";

// Absolute address of the site for canonical and social-share URLs; set SITE_URL on the server.
const siteUrl = process.env.SITE_URL ?? "http://localhost:3210";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: siteSettings.name,
    images: [{ url: "/images/cover.jpg", alt: siteSettings.name }],
  },
  robots: indexable ? undefined : { index: false, follow: false },
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
    <html lang="vi" className={`${aptima.variable} ${googleSansFlex.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
