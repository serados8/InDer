const { test: demoTest } = require('node:test');
const demoAssert = require('node:assert/strict');
const demoFs = require('node:fs/promises');
const demoPath = require('node:path');
const demoOs = require('node:os');
const demoHttp = require('node:http');

demoTest('security: demo hanya melayani artefak, menolak traversal, dan memasang header SQLite', async () => {
  const { createDemoServer } = await import('../scripts/serve-demo.mjs');
  const root = await demoFs.mkdtemp(demoPath.join(demoOs.tmpdir(), 'inder-demo-'));
  await demoFs.writeFile(demoPath.join(root, 'index.html'), '<h1>InDer</h1>');
  await demoFs.writeFile(demoPath.join(root, 'worker.wasm'), 'wasm');
  await demoFs.writeFile(demoPath.join(root, '.env'), 'secret');
  const server = await createDemoServer(root);
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = (server.address() as import('node:net').AddressInfo).port;
  async function request(url: string, method = 'GET'): Promise<any> {
    return new Promise((resolve, reject) => {
      demoHttp.request({ host: '127.0.0.1', port, path: url, method }, (response: import('node:http').IncomingMessage) => {
        let body = '';
        response.on('data', (chunk: Buffer) => body += chunk);
        response.on('end', () => resolve({ status: response.statusCode, headers: response.headers, body }));
      }).on('error', reject).end();
    });
  }
  try {
    const home = await request('/');
    demoAssert.equal(home.status, 200);
    demoAssert.equal(home.headers['cross-origin-opener-policy'], 'same-origin');
    demoAssert.equal(home.headers['cross-origin-embedder-policy'], 'credentialless');
    demoAssert.equal(home.headers['x-content-type-options'], 'nosniff');
    demoAssert.equal((await request('/notes/123')).status, 200);
    demoAssert.equal((await request('/worker.wasm')).headers['content-type'], 'application/wasm');
    for (const url of ['/../package.json', '/%2e%2e/package.json', '/.env', '/%5c..%5c.env']) {
      const response = await request(url);
      demoAssert.equal(response.status, 403);
      demoAssert.doesNotMatch(response.body, /secret|inder-demo/);
    }
    demoAssert.equal((await request('/%ZZ')).status, 400);
    demoAssert.equal((await request('/missing.js')).status, 404);
    demoAssert.equal((await request('/', 'POST')).status, 405);
    demoAssert.equal((await request('/', 'HEAD')).body, '');
  } finally {
    await new Promise<void>(resolve => server.close(() => resolve()));
    await demoFs.rm(root, { recursive: true, force: true });
  }
});
