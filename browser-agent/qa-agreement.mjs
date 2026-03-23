import { chromium } from 'playwright';
import path from 'path';

const SHOTS = 'C:/Users/twani/fadejunkie/browser-agent/shots';
const URL = 'https://arqueroco.anthonytatis.com';
let idx = 0;

async function shot(page, name) {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const file = path.join(SHOTS, `qa-agree-${idx++}-${name}-${ts}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.error(`📸 ${file}`);
  return file;
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

// Click Agreement tab
await page.click('button:has-text("AGREEMENT")');
await page.waitForTimeout(1500);
const s1 = await shot(page, 'agreement-tab-dark');

// Toggle to MONTH BY MONTH
const monthBtn = page.locator('button:has-text("MONTH BY MONTH")');
if (await monthBtn.count() > 0) {
  await monthBtn.click();
  await page.waitForTimeout(500);
  await shot(page, 'agreement-monthly-dark');
}

// Toggle back to ONE-TIME
const oneBtn = page.locator('button:has-text("ONE-TIME")');
if (await oneBtn.count() > 0) {
  await oneBtn.click();
  await page.waitForTimeout(500);
  await shot(page, 'agreement-onetime-dark');
}

// Switch to light mode
await page.click('button:has-text("LIGHT")');
await page.waitForTimeout(500);
await shot(page, 'agreement-onetime-light');

await browser.close();
console.log(JSON.stringify({ ok: true }));
