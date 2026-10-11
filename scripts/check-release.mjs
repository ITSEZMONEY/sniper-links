import { readdirSync, readFileSync, statSync } from 'node:fs';
import assert from 'node:assert/strict';
import { gzipSync } from 'node:zlib';

const asset = readFileSync('dist/widget/sniperlink.js', 'utf8');
for (const path of ['dist/widget/sniperlink.min.js', 'dist/sniperlink.js', 'dist/sniperlink.min.js']) {
  assert.equal(readFileSync(path, 'utf8'), asset, `Widget delivery path differs: ${path}`);
}
assert.ok(readFileSync('dist/widget/sniperlink.esm.js', 'utf8').includes('export'));
assert.ok(asset.includes('SniperLink'));
assert.ok(!asset.includes('process.env'));
assert.ok(!asset.includes('.innerHTML'));
assert.ok(!asset.includes('sendBeacon'));
const walk = directory => readdirSync(directory).flatMap(name => {
  const path = `${directory}/${name}`;
  return statSync(path).isDirectory() ? walk(path) : [path];
});
for (const path of [...walk('dist'), ...walk('src')]) {
  // Never print matches: a failure only reports the affected filename.
  assert.ok(!/(?:re_|sk_live_|sk_test_|phc_)[A-Za-z0-9_-]{20,}/.test(readFileSync(path, 'utf8')), `Credential pattern found in ${path}`);
}
const routing = JSON.parse(readFileSync('vercel.json', 'utf8'));
for (const route of ['/demo', '/docs', '/privacy', '/embed-generator']) {
  assert.ok(routing.rewrites.some(rule => rule.source === route && rule.destination === '/index.html'));
}
assert.ok(!routing.rewrites.some(rule => /api|widget|\(\.\*\)/.test(rule.source)));
const headers = routing.headers.find(rule => rule.source === '/widget/(.*)').headers;
assert.ok(headers.some(header => header.key === 'Access-Control-Allow-Origin' && header.value === '*'));
assert.ok(!headers.some(header => header.value.includes('immutable')));
console.log(`Release check passed: all widget paths emitted; no credential patterns or default network telemetry; SPA/static routing checked. Widget ${Buffer.byteLength(asset)} bytes, gzip ${gzipSync(asset).length} bytes.`);
