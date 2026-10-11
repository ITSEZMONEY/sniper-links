import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ESP_CONFIGS, contrastingText, detectESP, generateMobileLink, generateSniperLink, getFallbackInstructions, isValidEmail, normalizeColor, normalizeSender } from '../src/lib/sniper-link.ts';
import { generateEmbedCode } from '../src/lib/embed.ts';

for (const provider of ESP_CONFIGS) {
  test(`${provider.name}: exact-domain detection and safe desktop/mobile inbox route`, () => {
    const email = `test@${provider.domains[0]}`;
    assert.equal(detectESP(` TEST@${provider.domains[0].toUpperCase()} `)?.name, provider.name);
    const link = generateSniperLink(email, { sender: 'noreply@example.com' })!;
    assert.equal(new URL(link).protocol, 'https:');
    assert.equal(generateMobileLink(email, { sender: 'noreply@example.com' }), link);
    assert.doesNotMatch(link, /mailto:|googlegmail:|\/co\?|compose|ms-outlook:|ymail:/i);
    if (provider.capability === 'inbox') assert.equal(link, provider.desktopUrl);
    assert.ok(getFallbackInstructions(email, 'noreply@example.com').includes('noreply@example.com'));
  });
}

test('Gmail search encodes once and includes sender, last day and Spam', () => {
  const link = generateSniperLink('test@gmail.com', { sender: 'support+signup@example.com' })!;
  assert.equal(decodeURIComponent(new URL(link).hash.slice('#search/'.length)), 'from:support+signup@example.com newer_than:1d in:anywhere');
  assert.ok(getFallbackInstructions('test@gmail.com').includes('remove newer_than:1d'));
});

test('Empty sender opens a useful inbox search without a fictitious domain filter', () => {
  assert.equal(decodeURIComponent(new URL(generateSniperLink('test@gmail.com')!).hash), '#search/newer_than:1d in:anywhere');
  assert.equal(normalizeSender('@example.com'), 'example.com');
});

test('Unknown and spoofed domains get manual instructions, never a compose link', () => {
  for (const email of ['user@example.com', 'user@attacker.gmail.com', 'user@gmail.com.attacker.com']) {
    assert.equal(detectESP(email), null);
    assert.equal(generateSniperLink(email), null);
    assert.equal(generateMobileLink(email), null);
    assert.match(getFallbackInstructions(email, 'example.com'), /Spam or Junk/);
  }
});

test('Malformed email and sender payloads are rejected', () => {
  for (const value of ['bad', 'a@@gmail.com', 'a b@gmail.com', 'a@-gmail.com', 'a@gmail.com/x', '.a@gmail.com', 'a..b@gmail.com', 'a@gmail.com\n<script>', '<img>@gmail.com']) {
    assert.equal(isValidEmail(value), false);
    assert.equal(generateSniperLink(value), null);
  }
  for (const sender of ['example.com in:anywhere', 'javascript:alert(1)', '"><img src=x onerror=alert(1)>', 'a@example.com\nBcc:a@gmail.com']) {
    assert.equal(normalizeSender(sender), null);
    assert.equal(generateSniperLink('test@gmail.com', { sender }), null);
  }
  assert.ok(isValidEmail('a+signup@gmail.com'));
});

test('Snippet encodes HTML boundaries, uses actual origin and keeps email out unless requested', () => {
  const snippet = generateEmbedCode({ containerId: 'signup-widget', sender: '@example.com', buttonText: '"><img src=x onerror=alert(1)>' }, 'https://release.example.com/some-page');
  assert.ok(snippet.includes('https://release.example.com/widget/sniperlink.js'));
  assert.ok(snippet.includes('&quot;&gt;&lt;img'));
  assert.ok(snippet.includes('data-no-tracking="true"'));
  assert.ok(!snippet.includes('data-email='));
  assert.ok(!snippet.includes('<img'));
  const fixed = generateEmbedCode({ containerId: 'signup-widget', email: "o'brien@gmail.com" }, 'https://release.example.com');
  assert.ok(fixed.includes('o&#39;brien@gmail.com'));
  assert.throws(() => generateEmbedCode({ containerId: '"><img>' }, 'https://release.example.com'));
  assert.throws(() => generateEmbedCode({ containerId: 'widget' }, 'javascript:alert(1)'));
});

test('CSS payloads are rejected and foreground contrast adapts', () => {
  assert.equal(normalizeColor('red; background:url(https://evil.example.com)'), '#6d28d9');
  assert.equal(contrastingText('#ffffff'), '#000000');
  assert.equal(contrastingText('#000000'), '#ffffff');
});
