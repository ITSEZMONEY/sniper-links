import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';

// Independent origin used only for browser regression fixtures.
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>External install test fixture</title><body>
<form id="signup"><label for="email">Signup email</label><input id="email" name="email" type="email"><button type="submit">Continue</button></form>
<div data-sniperlink data-email-input="#email" data-sender="noreply@example.com"></div>
<script defer src="http://127.0.0.1:4173/widget/sniperlink.js"></script></body></html>`;
const fixtures = new Map();
createServer((request, response) => {
  if (request.method === 'POST' && request.url === '/fixtures') {
    let body = '';
    request.on('data', chunk => { body += chunk; });
    request.on('end', () => {
      const path = `/fixtures/${randomUUID()}`;
      fixtures.set(path, body);
      response.writeHead(201, { 'Content-Type': 'text/plain' });
      response.end(path);
    });
    return;
  }
  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  response.end(fixtures.get(request.url) || html);
}).listen(4174, '127.0.0.1');
