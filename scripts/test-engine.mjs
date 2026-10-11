import { build } from 'esbuild';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

// Reuse Vite's installed compiler so these tests run on Node 18.18+.
const directory = mkdtempSync(join(tmpdir(), 'sniper-links-tests-'));
try {
  const result = await build({ entryPoints: ['tests/engine.test.ts'], bundle: true, platform: 'node', format: 'esm', write: false });
  const path = join(directory, 'engine.test.mjs');
  writeFileSync(path, result.outputFiles[0].text);
  const tests = spawnSync(process.execPath, ['--test', path], { stdio: 'inherit' });
  process.exitCode = tests.status ?? 1;
} finally {
  rmSync(directory, { recursive: true });
}
