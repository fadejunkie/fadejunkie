import { chromium } from 'playwright';
import path from 'path';
const SHOTS = 'C:/Users/twani/fadejunkie/browser-agent/shots';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto('https://arquero-90ewn1z9v-anthony-tatis-projects.vercel.app/?dev=1', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

// Take initial shot to see what's there
const f1 = path.join(SHOTS, `dev-initial-${Date.now()}.png`);
await page.screenshot({ path: f1, fullPage: true });
console.error(`📸 ${f1}`);

// Get all button text
const btns = await page.$$eval('button', bs => bs.map(b => b.textContent?.trim()));
console.log('Buttons:', JSON.stringify(btns));

await browser.close();
