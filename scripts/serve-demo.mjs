import http from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.json': 'application/json', '.wasm': 'application/wasm', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.ttf': 'font/ttf',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.webp': 'image/webp' };

export async function createDemoServer(directory) {
  const root = await realpath(directory);
  return http.createServer(async (request, response) => {
    response.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    response.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Referrer-Policy', 'no-referrer');
    response.setHeader('Cache-Control', 'no-store');
    const finish = (status, body) => { response.writeHead(status); response.end(body); };
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.setHeader('Allow', 'GET, HEAD');
      return finish(405, 'Method not allowed');
    }
    try {
      const pathname = decodeURIComponent((request.url ?? '/').split('?')[0]);
      if (pathname.includes('\\') || pathname.includes('\0') ||
          pathname.split('/').some(segment => segment.startsWith('.'))) return finish(403, 'Forbidden');
      let candidate = path.resolve(root, '.' + pathname);
      const withinRoot = value => value.startsWith(root + path.sep);
      if (candidate !== root && !withinRoot(candidate)) return finish(403, 'Forbidden');
      if (!path.extname(candidate)) candidate = path.join(root, 'index.html'); // SPA routes
      if (!Object.hasOwn(types, path.extname(candidate))) return finish(404, 'Not found');
      const resolved = await realpath(candidate);
      if (!withinRoot(resolved)) return finish(403, 'Forbidden'); // Reject symlink escapes too.
      if (!(await stat(resolved)).isFile()) return finish(404, 'Not found');
      response.setHeader('Content-Type', types[path.extname(candidate)]);
      const body = await readFile(resolved);
      response.writeHead(200);
      response.end(request.method === 'HEAD' ? undefined : body);
    } catch (error) {
      if (error instanceof URIError) return finish(400, 'Bad request');
      finish(404, 'Not found'); // Never expose filesystem paths or exception messages.
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const port = Number(process.env.PORT ?? 4173);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be 1..65535');
  const server = await createDemoServer(path.resolve(process.argv[2] ?? 'dist'));
  server.on('error', () => { console.error('DEMO_SERVER_FAILED: check port and exported files'); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`InDer demo: http://127.0.0.1:${port}`));
}
