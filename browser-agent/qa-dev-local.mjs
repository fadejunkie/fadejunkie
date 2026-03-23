import { chromium } from 'playwright';
import path from 'path';
const SHOTS = 'C:/Users/twani/fadejunkie/browser-agent/shots';
let idx = 0;

async function shot(page, name) {
  const file = path.join(SHOTS, `devflow-${idx++}-${name}-${Date.now()}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.error(`📸 ${file}`);
  return file;
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

// Load with dev=1 param
await page.goto('http://localhost:5173/?dev=1', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

// Click Agreement tab
const agreeBtn = await page.locator('button').filter({ hasText: 'AGREEMENT' }).first();
await agreeBtn.click();
await page.waitForTimeout(1000);
await shot(page, 'paid-dark');

// Also switch to light
await page.locator('button').filter({ hasText: 'LIGHT' }).first().click();
await page.waitForTimeout(500);
await shot(page, 'paid-light');

await browser.close();
console.log(JSON.stringify({ ok: true }));
