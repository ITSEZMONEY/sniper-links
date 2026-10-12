# Deployment handoff

The parent owns Vercel project creation, linking, deployment and any secrets provisioning. No deployment or live-service change is part of this implementation.

## Project settings

- Repository root: this standalone sniper-links repository.
- Framework: Vite.
- Install command: npm ci.
- Build command: npm run build.
- Output directory: dist.
- Environment variables required by this release: none.
- Preferred runtime: Node 22 or 24. The existing CI remains unchanged on Node 18; source/test tooling supports Node 18.18+.

`npm run build` first emits the widget to public/widget, then Vite copies it into dist. Canonical public asset: `/widget/sniperlink.js`. Also emitted: `/widget/sniperlink.min.js`, `/widget/sniperlink.esm.js`, `/sniperlink.js`, `/sniperlink.min.js`. The classic aliases contain the same minified bytes. External CDN names from old documentation are not controlled by this release; replace them with the selected deployed origin.

## Routing

`vercel.json` rewrites only `/demo`, `/docs`, `/privacy` and `/embed-generator` to the SPA. Static widget files and hashed app assets are served directly. `/home` and `/generator` retain their redirects. There is no API in this first release, so `/api/*` is not rewritten to a successful HTML response.

Widget paths receive public CORS and JavaScript content type. Unversioned widget filenames use a short, revalidated cache policy. Only hashed app assets use year-long immutable caching. Response headers include nosniff, no-referrer and frame protection for site pages. Script-based embedding is supported; embedding the full hosted application in an iframe is not the installation method.

A strict CSP on an embedding site must allow the script origin and generated style tag/inline styles. HTTPS links need an email provider login and the correct account. They do not promise a native filtered-search screen.

## Parent checks after deployment

1. Open each SPA URL directly and refresh it.
2. Request every emitted widget path. Confirm 200, JavaScript MIME type, CORS and cache policy; missing JS and /api paths should be real 404s.
3. Generate a snippet on the deployed origin, paste it into a plain HTML page on another origin and click through. Check same-page forms and an SPA mount.
4. Exercise Gmail on desktop and mobile, then the seven inbox-only providers. Confirm manual search and unknown-provider dialog/focus behavior.
5. Revoke or rotate the previously exposed email-delivery credential if active. No delivery credential is required by the core.

No billing, delivery or authentication secrets should be configured for this release. The wider service roadmap needs a separately provisioned backend before its flows can be enabled.
