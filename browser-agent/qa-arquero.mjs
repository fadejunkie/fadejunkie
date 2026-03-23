import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';

const BASE_URL = 'https://arqueroco.anthonytatis.com';
const SHOTS_DIR = path.join(import.meta.dirname, 'shots');

async function shot(page, name) {
  const file = path.join(SHOTS_DIR, `qa-${name}-${Date.now()}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`📸 ${name}: ${file}`);
  return file;
}

async function clickTab(page, label) {
  await page.click(`button:has-text("${label}")`);
  await page.waitForTimeout(400);
}

async function toggleTheme(page) {
  // click the LIGHT or DARK toggle button
  const btn = page.locator('button').filter({ hasText: /LIGHT|DARK/ }).first();
  await btn.click();
  await page.waitForTimeout(500);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  console.log('\n=== LOADING SITE ===');
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // ── DARK MODE ──
  console.log('\n=== DARK MODE ===');

  // Workflow
  await clickTab(page, 'WORKFLOW');
  await shot(page, '01-dark-workflow');

  // Expand all phase tabs and check for issues
  for (const phaseNum of [1, 2, 3, 4]) {
    const phaseBtns = page.locator('.phase-tab');
    await phaseBtns.nth(phaseNum - 1).click();
    await page.waitForTimeout(300);
  }
  await shot(page, '02-dark-workflow-phase4');

  // Scope of Work
  await clickTab(page, 'SCOPE');
  await page.waitForTimeout(500);
  await shot(page, '03-dark-scope');

  // Agreement
  await clickTab(page, 'AGREEMENT');
  await page.waitForTimeout(500);
  await shot(page, '04-dark-agreement');

  // ── LIGHT MODE ──
  console.log('\n=== LIGHT MODE ===');
  await toggleTheme(page);

  // Workflow light
  await clickTab(page, 'WORKFLOW');
  await shot(page, '05-light-workflow');

  // Phase detail light
  const phaseBtns2 = page.locator('.phase-tab');
  await phaseBtns2.first().click();
  await page.waitForTimeout(300);
  await shot(page, '06-light-workflow-phase1');

  // Scope light
  await clickTab(page, 'SCOPE');
  await page.waitForTimeout(500);
  await shot(page, '07-light-scope');

  // Agreement light
  await clickTab(page, 'AGREEMENT');
  await page.waitForTimeout(500);
  await shot(page, '08-light-agreement');

  // ── SCAN FOR TEXT ISSUES ──
  console.log('\n=== CHECKING FOR RAW UNICODE / EMOJI ISSUES ===');

  // Go back to dark, check all tabs for raw \u sequences
  await toggleTheme(page);
  await page.waitForTimeout(400);

  for (const tab of ['WORKFLOW', 'SCOPE', 'AGREEMENT']) {
    await clickTab(page, tab);
    await page.waitForTimeout(400);
    const bodyText = await page.evaluate(() => document.body.innerText);
    const rawUnicode = bodyText.match(/\\u[0-9a-fA-F]{4}/g);
    if (rawUnicode) {
      console.log(`⚠️  RAW UNICODE in ${tab}:`, [...new Set(rawUnicode)]);
    } else {
      console.log(`✅ No raw unicode in ${tab}`);
    }
  }

  // ── CHECK LIGHT MODE TEXT COLORS ──
  console.log('\n=== LIGHT MODE COLOR CHECK ===');
  await toggleTheme(page);
  await page.waitForTimeout(400);

  const rootBg = await page.evaluate(() => {
    const root = document.querySelector('[style*="minHeight"]');
    return root ? getComputedStyle(root).backgroundColor : 'unknown';
  });
  console.log('Root background in light mode:', rootBg);

  const bodyColor = await page.evaluate(() => {
    const root = document.querySelector('[style*="minHeight"]');
    return root ? getComputedStyle(root).color : 'unknown';
  });
  console.log('Root text color in light mode:', bodyColor);

  // Check if any element has light text on light background
  const contrastIssues = await page.evaluate(() => {
    const issues = [];
    const all = document.querySelectorAll('*');
    for (const el of all) {
      const style = getComputedStyle(el);
      const bg = style.backgroundColor;
      const color = style.color;
      // flag if color is near-white on near-white bg
      if (bg && color) {
        const bgMatch = bg.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        const fgMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (bgMatch && fgMatch) {
          const bgL = (parseInt(bgMatch[1]) + parseInt(bgMatch[2]) + parseInt(bgMatch[3])) / 3;
          const fgL = (parseInt(fgMatch[1]) + parseInt(fgMatch[2]) + parseInt(fgMatch[3])) / 3;
          // both light (>180) = invisible text
          if (bgL > 180 && fgL > 180 && el.innerText && el.innerText.trim().length > 0) {
            issues.push({ tag: el.tagName, text: el.innerText.trim().substring(0, 40), bg, color });
          }
        }
      }
    }
    return issues.slice(0, 20);
  });

  if (contrastIssues.length) {
    console.log('⚠️  CONTRAST ISSUES (light on light):', JSON.stringify(contrastIssues, null, 2));
  } else {
    console.log('✅ No light-on-light contrast issues detected');
  }

  // Final overview shots with scrolling
  console.log('\n=== FINAL OVERVIEW SHOTS ===');
  await clickTab(page, 'WORKFLOW');
  await shot(page, '09-light-final-workflow');
  await clickTab(page, 'SCOPE');
  await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollTo(0, 0));
  await shot(page, '10-light-final-scope-top');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await shot(page, '11-light-final-scope-bottom');

  await browser.close();
  console.log('\nDone.');
})();
