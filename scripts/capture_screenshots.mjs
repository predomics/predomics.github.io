#!/usr/bin/env node
/**
 * Capture dark-themed screenshots of PredomicsApp for the GitHub Pages website.
 *
 * Usage:
 *   node scripts/capture_screenshots.mjs                     # default: localhost:8001
 *   node scripts/capture_screenshots.mjs --base http://host:port
 *   node scripts/capture_screenshots.mjs --out assets/screenshots
 *
 * Prerequisites:
 *   npm install playwright    (or: npx playwright install chromium)
 *   The app must be running at the base URL.
 *
 * The script authenticates, navigates to each page, waits for charts to render,
 * and saves high-quality PNG screenshots with consistent dark theme.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// ── Configuration ──────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (flag, fallback) => {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
};

const BASE = getArg('--base', 'http://localhost:8001');
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(getArg('--out', resolve(__dirname, '..', 'assets', 'screenshots')));
const CREDS = { email: 'edi.prifti@gmail.com', password: 'editest' };

// These IDs must match your local data — update if needed
const PROJECT_ID = 'd0810056bcc1';
const JOB_ID     = '4180f1e459ac';

const WIDTH  = 1440;
const HEIGHT = 900;

// ── Helpers ────────────────────────────────────────────────────────
async function dismissOverlays(page) {
  await page.evaluate(() => {
    document.querySelectorAll(
      '.tour-overlay, .tour-backdrop, [class*="tour"], .notification-toast'
    ).forEach(el => el.remove());
    localStorage.setItem('tour_completed', 'true');
    localStorage.setItem('tourDone', 'true');
    localStorage.setItem('predomics_tour_done', 'true');
  });
  for (const sel of ['button:has-text("Skip")', 'button:has-text("Close")', 'button:has-text("Got it")', '.tour-skip']) {
    const btn = await page.$(sel);
    if (btn) await btn.click({ force: true }).catch(() => {});
  }
  await page.waitForTimeout(300);
}

async function clickSubTab(page, label) {
  await page.evaluate((lbl) => {
    const btns = [...document.querySelectorAll('button')];
    const btn = btns.find(b => b.textContent.trim() === lbl);
    if (btn) { btn.click(); btn.scrollIntoView({ block: 'start' }); }
  }, label);
}

async function capture(page, name, description) {
  const path = `${OUT}/${name}.png`;
  await dismissOverlays(page);
  await page.screenshot({ path, type: 'png' });
  console.log(`  ${description}`);
  return path;
}

// ── Screenshot definitions ─────────────────────────────────────────
const SCREENSHOTS = [
  {
    name: 'landing',
    desc: 'Landing page',
    url: '/',
    wait: 2000,
  },
  {
    name: 'login',
    desc: 'Login page',
    url: '/login',
    wait: 1000,
    noAuth: true,
  },
  {
    name: 'dashboard',
    desc: 'Dashboard overview',
    url: '/dashboard',
    wait: 3000,
  },
  {
    name: 'projects',
    desc: 'Projects list',
    url: '/projects',
    wait: 3000,
  },
  {
    name: 'data',
    desc: 'Data explorer with prevalence charts',
    url: `/project/${PROJECT_ID}/data`,
    wait: 4000,
  },
  {
    name: 'parameters',
    desc: 'Parameter configuration',
    url: `/project/${PROJECT_ID}/parameters`,
    wait: 3000,
  },
  {
    name: 'results',
    desc: 'Results summary with job table',
    url: `/project/${PROJECT_ID}/results/${JOB_ID}`,
    wait: 6000,
    scrollDown: 600,
  },
  {
    name: 'best_model',
    desc: 'Best model with feature importance',
    url: `/project/${PROJECT_ID}/results/${JOB_ID}`,
    wait: 4000,
    subTab: 'Best Model',
    subWait: 4000,
  },
  {
    name: 'population',
    desc: 'Population of models with heatmap',
    url: `/project/${PROJECT_ID}/results/${JOB_ID}`,
    wait: 3000,
    subTab: 'Population',
    subWait: 4000,
  },
  {
    name: 'jury',
    desc: 'Jury voting with confusion matrices',
    url: `/project/${PROJECT_ID}/results/${JOB_ID}`,
    wait: 3000,
    subTab: 'Jury',
    subWait: 5000,
  },
  {
    name: 'copresence',
    desc: 'Co-presence network',
    url: `/project/${PROJECT_ID}/results/${JOB_ID}`,
    wait: 3000,
    subTab: 'Co-presence',
    subWait: 6000,
    scrollDown: 900,
  },
  {
    name: 'comparative',
    desc: 'Comparative analysis',
    url: `/project/${PROJECT_ID}/results/${JOB_ID}`,
    wait: 3000,
    subTab: 'Comparative',
    subWait: 4000,
  },
];

// ── Main ───────────────────────────────────────────────────────────
async function main() {
  mkdirSync(OUT, { recursive: true });
  console.log(`\nCapturing screenshots from ${BASE}`);
  console.log(`Output: ${OUT}\n`);

  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    colorScheme: 'dark',
    deviceScaleFactor: 2,   // Retina-quality screenshots
  });
  const page = await ctx.newPage();

  // ── Authenticate ──
  console.log('Authenticating...');
  await page.goto(`${BASE}/login`);
  await page.waitForTimeout(1000);
  await page.evaluate(async (creds) => {
    const resp = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creds),
    });
    if (!resp.ok) throw new Error(`Login failed: ${resp.status}`);
    const data = await resp.json();
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('tour_completed', 'true');
    localStorage.setItem('tourDone', 'true');
    localStorage.setItem('predomics_tour_done', 'true');
    localStorage.setItem('locale', 'en');
  }, CREDS);
  console.log('  Authenticated\n');

  // ── Capture each screenshot ──
  let count = 0;
  const total = SCREENSHOTS.length;
  for (const shot of SCREENSHOTS) {
    count++;
    const prefix = `[${String(count).padStart(2, ' ')}/${total}]`;
    try {
      await page.goto(`${BASE}${shot.url}`);
      await page.waitForTimeout(shot.wait);

      if (shot.subTab) {
        await clickSubTab(page, shot.subTab);
        await page.waitForTimeout(shot.subWait || 3000);
        await page.evaluate(() => window.scrollBy(0, -60));
      }

      if (shot.scrollDown) {
        await page.evaluate((px) => window.scrollBy(0, px), shot.scrollDown);
        await page.waitForTimeout(1000);
      }

      await capture(page, shot.name, `${prefix} ${shot.desc}`);
    } catch (e) {
      console.log(`${prefix} ${shot.desc} — SKIPPED (${e.message})`);
    }
  }

  await browser.close();
  console.log(`\nDone! ${count} screenshots saved to ${OUT}/\n`);
}

main().catch(e => { console.error(e); process.exit(1); });
