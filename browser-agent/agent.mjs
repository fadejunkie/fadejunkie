/**
 * browser-agent/agent.mjs — Reusable Playwright browser agent
 *
 * Usage from Claude Code:
 *   node browser-agent/agent.mjs <command> [args...]
 *
 * Commands:
 *   screenshot <url>                    — Navigate and screenshot (no login)
 *   login <project> [--screenshot]      — Login to a registered project and optionally screenshot
 *   check <project>                     — Login + full-page screenshot of dashboard
 *   run <script.mjs>                    — Run a custom Playwright script
 *
 * All screenshots saved to browser-agent/shots/ with timestamps.
 * Exit JSON: { ok, screenshots[], url, error? }
 */

import { chromium } from 'playwright';
import { mkdirSync, rmSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';

// Load .env from browser-agent directory (Node 20.12+ built-in)
try { process.loadEnvFile(new URL('.env', import.meta.url)); } catch {}

const SHOTS_DIR = resolve(import.meta.dirname, 'shots');
mkdirSync(SHOTS_DIR, { recursive: true });

// ── Project Registry ──────────────────────────────────────────────────
const PROJECTS = {
  wcorwin: {
    url: 'https://wcorwin.anthonytatis.com',
    email: process.env.WCORWIN_EMAIL,
    password: process.env.WCORWIN_PASSWORD,
    name: 'WCORWIN SEO Tracker',
  },
  fadejunkie: {
    url: 'https://fadejunkie.com',
    email: null,   // fill when needed
    password: null,
    name: 'FadeJunkie',
  },
  // Add more projects here as needed
};

// ── Helpers ───────────────────────────────────────────────────────────
function shotPath(label) {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${label}-${ts}.png`;
  return join(SHOTS_DIR, filename);
}

function output(data) {
  console.log(JSON.stringify(data));
}

async function takeScreenshot(page, label, fullPage = true) {
  const path = shotPath(label);
  await page.screenshot({ path, fullPage });
  console.error(`📸 ${path}`);
  return path;
}

// ── Commands ──────────────────────────────────────────────────────────

async function cmdScreenshot(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const screenshots = [];

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);
    screenshots.push(await takeScreenshot(page, 'screenshot'));
    output({ ok: true, screenshots, url: page.url() });
  } catch (err) {
    try { screenshots.push(await takeScreenshot(page, 'error')); } catch {}
    output({ ok: false, screenshots, error: err.message });
  } finally {
    await browser.close();
  }
}

async function cmdLogin(projectKey, doScreenshot = true) {
  const project = PROJECTS[projectKey];
  if (!project) {
    output({ ok: false, error: `Unknown project: ${projectKey}. Known: ${Object.keys(PROJECTS).join(', ')}` });
    return;
  }
  if (!project.email || !project.password) {
    output({ ok: false, error: `No credentials configured for ${projectKey}` });
    return;
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const screenshots = [];

  try {
    await page.goto(project.url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);

    // Find and fill login form
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]');
    const passwordInput = page.locator('input[type="password"], input[name="password"]');

    if (await emailInput.count() === 0) {
      // Maybe already logged in or no login form
      if (doScreenshot) screenshots.push(await takeScreenshot(page, `${projectKey}-page`));
      output({ ok: true, screenshots, url: page.url(), note: 'No login form found — may already be logged in' });
      await browser.close();
      return;
    }

    await emailInput.first().fill(project.email);
    await passwordInput.first().fill(project.password);

    // Submit
    const submitBtn = page.locator('button[type="submit"], button:has-text("Log in"), button:has-text("Sign in"), button:has-text("Login"), button:has-text("Sign In"), input[type="submit"]');
    if (await submitBtn.count() > 0) {
      await submitBtn.first().click();
    } else {
      await passwordInput.first().press('Enter');
    }

    await page.waitForTimeout(4000);
    if (doScreenshot) screenshots.push(await takeScreenshot(page, `${projectKey}-dashboard`, true));

    output({ ok: true, screenshots, url: page.url() });
  } catch (err) {
    try { screenshots.push(await takeScreenshot(page, `${projectKey}-error`)); } catch {}
    output({ ok: false, screenshots, error: err.message });
  } finally {
    await browser.close();
  }
}

async function cmdCheck(projectKey) {
  return cmdLogin(projectKey, true);
}

async function cmdClean(maxAge = 3600000) {
  // Delete screenshots older than maxAge (default 1 hour)
  let deleted = 0;
  const now = Date.now();
  try {
    for (const file of readdirSync(SHOTS_DIR)) {
      const filepath = join(SHOTS_DIR, file);
      const stat = statSync(filepath);
      if (now - stat.mtimeMs > maxAge) {
        rmSync(filepath);
        deleted++;
      }
    }
  } catch {}
  output({ ok: true, deleted, dir: SHOTS_DIR });
}

// ── CLI Router ────────────────────────────────────────────────────────
const [,, command, ...args] = process.argv;

switch (command) {
  case 'screenshot':
    await cmdScreenshot(args[0]);
    break;
  case 'login':
    await cmdLogin(args[0], args.includes('--screenshot'));
    break;
  case 'check':
    await cmdCheck(args[0]);
    break;
  case 'clean':
    await cmdClean(args[0] ? parseInt(args[0]) : undefined);
    break;
  case 'list':
    output({ ok: true, projects: Object.entries(PROJECTS).map(([k, v]) => ({ key: k, name: v.name, url: v.url })) });
    break;
  default:
    output({ ok: false, error: `Unknown command: ${command}. Use: screenshot, login, check, clean, list` });
}
