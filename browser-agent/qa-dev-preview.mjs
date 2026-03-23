import { chromium } from 'playwright';
import path from 'path';

const SHOTS = 'C:/Users/twani/fadejunkie/browser-agent/shots';
let idx = 0;

async function shot(page, name) {
  const ts = Date.now();
  const file = path.join(SHOTS, `dev-${idx++}-${name}-${ts}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.error(`📸 ${file}`);
  return file;
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

// Dev mode URL — pre-paid state
await page.goto('https://arquero-90ewn1z9v-anthony-tatis-projects.vercel.app/?dev=1', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

// Click Agreement tab
await page.click('button:has-text("AGREEMENT")');
await page.waitForTimeout(1500);
await shot(page, 'dev-paid-state-dark');

// Light mode
await page.click('button:has-text("LIGHT")');
await page.waitForTimeout(500);
await shot(page, 'dev-paid-state-light');

await browser.close();
console.log(JSON.stringify({ ok: true }));
