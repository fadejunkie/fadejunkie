import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };

const server = http.createServer((req, res) => {
  let url = req.url.split('?')[0];
  if (url === '/') url = '/index.html';
  if (!path.extname(url)) url = url.replace(/\/?$/, '/index.html');

  const full = path.join(__dirname, url);

  try {
    const data = fs.readFileSync(full);
    const ext = path.extname(full);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<p>Not found</p>');
  }
});

const PORT = 4820;
server.listen(PORT, () => {
  console.log(`\n  wcorwin Branded Landing Pages`);
  console.log(`  http://localhost:${PORT}\n`);
  console.log('  Pages:');
  console.log(`  http://localhost:${PORT}/canyon-lake`);
  console.log(`  http://localhost:${PORT}/gruene`);
  console.log(`  http://localhost:${PORT}/spring-branch`);
  console.log(`  http://localhost:${PORT}/seguin`);
  console.log(`  http://localhost:${PORT}/va-home-loans`);
  console.log(`  http://localhost:${PORT}/first-time-buyer`);
  console.log('');
});
