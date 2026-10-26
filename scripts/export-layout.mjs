// Exports full-page layout images of site pages for the client to review.
//
//   pnpm export:layout                     # the homepage, desktop only
//   pnpm export:layout / /vac-xin          # several pages
//   pnpm export:layout --mobile /          # also a mobile image
//
// Needs the site running (pnpm dev --port 3210, or set LAYOUT_BASE_URL).
// Writes docs/layouts/<page>-desktop.jpg (1440px wide) and, with --mobile,
// <page>-mobile.jpg (390px wide at 2x). Floating buttons are hidden so they do not land in the
// middle of a full-page image; the sticky header stays at the top.
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import puppeteer from "puppeteer-core";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "docs", "layouts");
const baseUrl = process.env.LAYOUT_BASE_URL ?? "http://localhost:3210";
const chromePath = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";

const args = process.argv.slice(2);
const withMobile = args.includes("--mobile");

const viewports = [
  { name: "desktop", width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false },
  ...(withMobile ? [{ name: "mobile", width: 390, height: 844, deviceScaleFactor: 2, isMobile: true }] : []),
];

const routeArgs = args.filter((arg) => !arg.startsWith("--"));
const routes = routeArgs.length > 0 ? routeArgs : ["/"];

function fileStem(route) {
  const clean = route.replace(/^\/+|\/+$/g, "").replace(/\//g, "-");
  return clean || "home";
}

const exportCss = `
  [data-export-hide], nextjs-portal { display: none !important; }
  *, *::before, *::after { transition: none !important; animation: none !important; }
  html { scroll-behavior: auto !important; }
`;

/** Scroll the whole page once so every lazy image loads, then wait for them. */
async function loadLazyImages(page) {
  await page.evaluate(async () => {
    document.querySelectorAll("iframe[loading=lazy]").forEach((frame) => (frame.loading = "eager"));
    const step = window.innerHeight;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
    window.scrollTo(0, 0);
    // Hidden images (the other breakpoint's banner, inactive slides) never load
    // lazily, so only wait for visible ones, and never longer than 8 seconds.
    const pending = [...document.images]
      .filter((img) => !img.complete && img.checkVisibility())
      .map(
        (img) =>
          new Promise((resolve) => {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener("error", resolve, { once: true });
          }),
      );
    await Promise.race([Promise.all(pending), new Promise((resolve) => setTimeout(resolve, 8000))]);
    await document.fonts.ready;
  });
}

/**
 * Chrome cannot capture more than ~16k device pixels in one shot (a taller page
 * comes back with its top repeated), so capture slices and stitch them.
 * The viewport is first stretched to the full page height: cross-origin iframes
 * (the Google map) are only painted while they sit inside the viewport.
 */
async function captureFullPage(page, viewport, file) {
  const scale = viewport.deviceScaleFactor;
  const { width, height } = await page.evaluate(() => ({
    width: document.documentElement.clientWidth,
    height: document.documentElement.scrollHeight,
  }));
  await page.setViewport({ ...viewport, height });
  await new Promise((resolve) => setTimeout(resolve, 2500));
  const sliceHeight = 3000;
  const slices = [];
  for (let y = 0; y < height; y += sliceHeight) {
    const h = Math.min(sliceHeight, height - y);
    const buffer = await page.screenshot({ type: "png", clip: { x: 0, y, width, height: h }, captureBeyondViewport: false });
    slices.push({ input: buffer, top: Math.round(y * scale), left: 0 });
  }
  await sharp({ create: { width: Math.round(width * scale), height: Math.round(height * scale), channels: 3, background: "#ffffff" } })
    .composite(slices)
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(file);
}

const browser = await puppeteer.launch({ executablePath: chromePath, headless: true });
try {
  await mkdir(outDir, { recursive: true });
  for (const route of routes) {
    for (const viewport of viewports) {
      const page = await browser.newPage();
      await page.setViewport(viewport);
      // Some embeds (Google Maps) render nothing for a "HeadlessChrome" user agent.
      const userAgent = (await browser.userAgent()).replace("HeadlessChrome", "Chrome");
      await page.setUserAgent({ userAgent });
      await page.goto(new URL(route, baseUrl).href, { waitUntil: "networkidle0", timeout: 60_000 });
      await page.addStyleTag({ content: exportCss });
      await loadLazyImages(page);
      // Embedded iframes (the Google map) load after images; give them a moment.
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const file = path.join(outDir, `${fileStem(route)}-${viewport.name}.jpg`);
      await captureFullPage(page, viewport, file);
      console.log(`exported ${path.relative(root, file)}`);
      await page.close();
    }
  }
} finally {
  await browser.close();
}
