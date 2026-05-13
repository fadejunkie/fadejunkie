import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from '../node_modules/marked/lib/marked.esm.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PAGES = [
  { file: 'landing-page-first-time-buyer.md', slug: 'first-time-home-buyer-new-braunfels', label: 'First-Time Home Buyer Guide' },
  { file: 'landing-page-va-home-loans.md',    slug: 'va-home-loans-new-braunfels',         label: 'VA Home Loans' },
  { file: 'neighborhood-canyon-lake.md',       slug: 'canyon-lake-neighborhood-guide',      label: 'Canyon Lake Neighborhood Guide' },
  { file: 'neighborhood-gruene.md',            slug: 'gruene-neighborhood-guide',           label: 'Gruene Neighborhood Guide' },
  { file: 'neighborhood-spring-branch.md',     slug: 'spring-branch-neighborhood-guide',   label: 'Spring Branch Neighborhood Guide' },
  { file: 'neighborhood-seguin.md',            slug: 'seguin-neighborhood-guide',          label: 'Seguin Neighborhood Guide' },
];

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Georgia, serif; color: #1a1a1a; background: #f9f7f4; }
  .topbar { background: #1a3a5c; color: white; padding: 12px 32px; display: flex; align-items: center; gap: 16px; font-family: sans-serif; font-size: 13px; }
  .topbar a { color: #acd4f5; text-decoration: none; }
  .topbar a:hover { color: white; }
  .topbar .sep { opacity: 0.4; }
  .badge { background: #e8a020; color: white; padding: 2px 8px; border-radius: 3px; font-size: 11px; font-weight: 600; letter-spacing: .5px; }
  .content { max-width: 780px; margin: 48px auto; padding: 0 24px 80px; }
  h1 { font-size: 2rem; line-height: 1.2; margin-bottom: 8px; color: #111; }
  h2 { font-size: 1.3rem; margin: 36px 0 12px; color: #1a3a5c; }
  h3 { font-size: 1.05rem; margin: 24px 0 8px; color: #333; }
  p { line-height: 1.75; margin-bottom: 16px; font-size: 1.02rem; }
  ul, ol { margin: 0 0 16px 24px; line-height: 1.75; }
  li { margin-bottom: 4px; }
  table { width: 100%; border-collapse: collapse; margin: 20px 0; font-family: sans-serif; font-size: 0.9rem; }
  th { background: #1a3a5c; color: white; padding: 10px 12px; text-align: left; }
  td { padding: 9px 12px; border-bottom: 1px solid #ddd; }
  tr:nth-child(even) td { background: #f0f0f0; }
  .meta-box { background: #eef4fb; border-left: 4px solid #1a3a5c; padding: 16px 20px; border-radius: 4px; margin-bottom: 32px; font-family: sans-serif; font-size: 0.88rem; line-height: 1.8; }
  .meta-box strong { color: #1a3a5c; }
  hr { border: none; border-top: 1px solid #ddd; margin: 32px 0; }
  a { color: #1a3a5c; }

  /* Index page */
  .index-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 32px; }
  .index-card { background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px 24px; text-decoration: none; color: inherit; transition: box-shadow .15s; }
  .index-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,.1); border-color: #1a3a5c; }
  .index-card .type { font-family: sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .8px; color: #888; margin-bottom: 6px; }
  .index-card .title { font-size: 1.05rem; font-weight: 600; color: #1a3a5c; margin-bottom: 4px; }
  .index-card .url { font-family: monospace; font-size: 12px; color: #888; }
  .index-card .status { display: inline-block; margin-top: 10px; font-family: sans-serif; font-size: 11px; background: #d4edda; color: #155724; padding: 2px 8px; border-radius: 3px; }
  @media (max-width: 600px) { .index-grid { grid-template-columns: 1fr; } }
`;

function wrapHtml(title, body, metaHtml = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} — wcorwin M2 Preview</title>
  <style>${css}</style>
</head>
<body>
  <div class="topbar">
    <a href="/">← All Pages</a>
    <span class="sep">|</span>
    <span>wcorwin.com M2 Content Preview</span>
    <span class="sep">|</span>
    <span class="badge">DRAFT</span>
  </div>
  ${metaHtml}
  <div class="content">
    ${body}
  </div>
</body>
</html>`;
}

function renderIndex() {
  const cards = PAGES.map(p => {
    const type = p.file.startsWith('landing') ? 'Landing Page' : 'Neighborhood Guide';
    return `<a class="index-card" href="/${p.slug}">
      <div class="type">${type}</div>
      <div class="title">${p.label}</div>
      <div class="url">wcorwin.com/${p.slug}</div>
      <span class="status">Ready to publish</span>
    </a>`;
  }).join('\n');

  const body = `
    <h1>wcorwin.com — Month 2 Content</h1>
    <p style="font-family:sans-serif;color:#666;margin-top:8px;">6 pages ready to publish · 1 missing (buyer rebate)</p>
    <div class="index-grid">${cards}</div>
  `;
  return wrapHtml('M2 Content Index', body);
}

function renderPage(page) {
  const filePath = path.join(__dirname, page.file);
  const raw = fs.readFileSync(filePath, 'utf-8');

  // Extract SEO metadata block (everything between first --- and the first H1)
  const lines = raw.split('\n');
  let metaLines = [];
  let contentLines = [];
  let inMeta = false;
  let metaDone = false;

  for (const line of lines) {
    if (!metaDone && line.startsWith('## SEO metadata')) { inMeta = true; continue; }
    if (inMeta && !metaDone && line.startsWith('---')) { metaDone = true; inMeta = false; continue; }
    if (inMeta) { metaLines.push(line); continue; }
    contentLines.push(line);
  }

  const metaHtml = metaLines.length ? `
    <div class="meta-box" style="max-width:780px;margin:24px auto 0;padding-left:32px;">
      <strong>SEO Metadata</strong><br>
      ${metaLines.filter(l => l.trim()).map(l => l.replace(/^- /, '')).join('<br>')}
    </div>` : '';

  const body = marked(contentLines.join('\n'));
  return wrapHtml(page.label, body, metaHtml);
}

const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0].replace(/\/$/, '') || '/';

  if (url === '' || url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(renderIndex());
    return;
  }

  const slug = url.replace(/^\//, '');
  const page = PAGES.find(p => p.slug === slug);

  if (!page) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
    return;
  }

  try {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(renderPage(page));
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end(`Error: ${e.message}`);
  }
});

const PORT = 4820;
server.listen(PORT, () => {
  console.log(`\n  wcorwin M2 Preview Server`);
  console.log(`  http://localhost:${PORT}\n`);
  console.log('  Pages:');
  PAGES.forEach(p => console.log(`  http://localhost:${PORT}/${p.slug}`));
  console.log('');
});
