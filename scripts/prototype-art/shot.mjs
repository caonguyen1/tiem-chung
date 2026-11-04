// Chụp một file HTML của scripts/prototype-art ra ảnh JPG đúng khổ.
// Dùng puppeteer thay cho Chrome dòng lệnh vì Chrome không mở được cửa sổ thấp hơn ~250px.
// Usage: node shot.mjs <file.html> <query> <width> <height> <scale> <out.jpg>
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import puppeteer from "puppeteer-core";

const [file, query, width, height, scale, out] = process.argv.slice(2);
const chromePath = process.env.CHROME_PATH ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";

const browser = await puppeteer.launch({ executablePath: chromePath, args: ["--allow-file-access-from-files"] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: Number(width), height: Number(height), deviceScaleFactor: Number(scale) });
  await page.goto(`${pathToFileURL(resolve(file)).href}?${query}`, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out, type: "jpeg", quality: 86 });
} finally {
  await browser.close();
}
