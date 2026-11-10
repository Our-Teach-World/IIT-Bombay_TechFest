import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('./public', import.meta.url)));
const mimeTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.webp', 'image/webp'],
]);

const server = createServer((request, response) => {
  const requestPath = new URL(request.url || '/', 'http://localhost').pathname;
  const decodedPath = decodeURIComponent(requestPath);
  const safePath = normalize(decodedPath).replace(/^([/\\]*\.\.[/\\])+/, '');
  const relativePath = safePath.replace(/^[/\\]+/, '') || 'index.html';
  const filePath = resolve(join(root, relativePath));

  if (!filePath.startsWith(`${root}/`) && filePath !== join(root, 'index.html')) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
    return;
  }

  response.writeHead(200, {
    'Content-Type': mimeTypes.get(extname(filePath)) || 'application/octet-stream',
    'Cache-Control': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
  });
  createReadStream(filePath).pipe(response);
});

const port = Number(process.env.PORT || 3000);
server.listen(port, '0.0.0.0', () => console.log(`Elsewhere is listening on ${port}`));
