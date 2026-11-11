import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

// Embed the web export so Sites can serve COOP/COEP on every response.
// No database files, native bundles, or credentials are included.
const source = path.resolve(process.argv[2] ?? 'dist');
const destination = path.resolve(process.argv[3] ?? 'artifacts/site');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css',
  '.wasm': 'application/wasm', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.ttf': 'font/ttf', '.woff': 'font/woff',
  '.woff2': 'font/woff2', '.webp': 'image/webp' };
const assets = {};
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    const relative = path.relative(source, filename).split(path.sep).join('/');
    if (entry.name.startsWith('.') || /(^|\/)(ios|android|server)(\/|$)/.test(relative)) continue;
    if (entry.isDirectory()) await walk(filename);
    else if (entry.isFile() && Object.hasOwn(types, path.extname(filename))) {
      assets['/' + relative] = [types[path.extname(filename)], (await readFile(filename)).toString('base64')];
    }
  }
}
await walk(source);
if (!assets['/index.html']) throw new Error('Build web export first');
const worker = `const assets = ${JSON.stringify(assets)};
export default { async fetch(request) {
  const headers = {
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'credentialless',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer'
  };
  if (!['GET','HEAD'].includes(request.method)) return new Response('Method not allowed', {status:405, headers:{...headers,Allow:'GET, HEAD'}});
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url).pathname); }
  catch { return new Response('Bad request', {status:400,headers}); }
  let asset = assets[pathname];
  if (!asset && !pathname.split('/').pop().includes('.')) asset = assets['/index.html'];
  if (!asset) return new Response('Not found', {status:404,headers});
  headers['Content-Type'] = asset[0];
  headers['Cache-Control'] = 'no-cache';
  return new Response(request.method === 'HEAD' ? null : Uint8Array.from(atob(asset[1]), c => c.charCodeAt(0)), {headers});
}};
`;
await mkdir(path.join(destination, 'dist/server'), { recursive: true });
await writeFile(path.join(destination, 'dist/server/index.js'), worker);
console.log(JSON.stringify({ assets: Object.keys(assets).length, workerBytes: Buffer.byteLength(worker) }));
