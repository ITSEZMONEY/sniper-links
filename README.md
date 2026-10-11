# SniperLink

A free, MIT-licensed inbox-link widget for signup confirmation screens. The generator, demo and documentation are included. No backend or service key is required.

## What works

Eight providers are recognized by exact email domain: Gmail, Outlook, Yahoo, iCloud, ProtonMail, AOL, HEY and Mail.ru. Gmail opens web search for the sender, the last day and all folders, including Spam. The other seven open their real webmail with manual search instructions. Desktop and mobile use HTTPS links. Unknown providers and custom domains receive accessible manual instructions.

Links cannot confirm delivery, verify a signup, or establish a confirmation lift. Native filtered search is not a universal capability. Accounts, paid plans, hosted analytics, billing and domain entitlement enforcement are unavailable in this release. Styling and the branding toggle are free.

## Run locally

Use Node 18.18+ and npm. Node 22 or 24 is recommended for new hosting projects.

```sh
npm ci
npm run dev
```

For a production artifact:

```sh
npm run type-check
npm run lint
npm test
npm run build:widget
npm run build
npm run check:release
npx playwright install chromium webkit
npm run test:browser
```

The app build includes the widget build. Output is `dist/`; generated widget assets are gitignored and reproduced by the build. `npm run dev` serves emitted assets after `npm run build:widget`.

## Install

Use the generator at `/embed-generator` on your local or deployed site. Its snippet uses that site's actual origin, so it can be pasted on a different website. Replace the sender and pass the recipient after signup succeeds.

```html
<div data-sniperlink
  data-email="user@gmail.com"
  data-sender="noreply@example.com"
  data-button-text="Open Inbox"
  data-no-tracking="true"></div>
```

Load `/widget/sniperlink.js` from your deployed SniperLink origin with `defer` and `referrerpolicy="no-referrer"`. Use the generator for the complete absolute script URL; a relative URL on another host would load from the wrong website. Download and self-host the asset if preferred.

For same-page forms, omit `data-email` and set `data-email-input="#email"`. Input, change and submit update the widget without blocking the form. With neither attribute, the widget reads a matching same-page field or presents its own labeled email input. Cross-origin forms such as embedded Typeform need their official integration to pass the address. No email is read from the URL, logged or stored.

Plain HTML, builder custom-code blocks and SPA mounts work. A MutationObserver mounts new data-attribute containers, updates changed attributes and cleans up removed containers. Programmatic use is available through `SniperLink.create`, `init`, `setEmail`, `updateConfig` and `destroy`.

See [widget contract](docs/WIDGET-CONTRACT.md), [PRD scope](docs/PRD-SCOPE.md) and [deployment handoff](DEPLOYMENT.md).

## Privacy and security

The widget uses DOM nodes and textContent, with encoded HTML attributes for exported snippets. It accepts only fixed HTTPS inbox routes, validated sender filters, hex colors and known style/shape values. There is no HTML interpolation of user input.

No analytics SDK is initialized, and there is no default telemetry. A programmatic caller can supply an explicitly consented analytics callback receiving only `{ event: 'inbox_click', provider, linkType: 'web' }`. Unknown-provider and manual-help interactions never call analytics. URLs, email addresses, sender, referrer and user agent are excluded.

The former browser email delivery integration and a credential repeated in a historical security note have been removed from the working tree. The parent must revoke the exposed credential if active; this code change cannot revoke it or erase Git history. Never put delivery secrets in VITE_* variables.

## Source and contributions

Repository: [itsezmoney/sniper-links](https://github.com/itsezmoney/sniper-links). Open a reproducible issue without credentials or real email addresses. Add a meaningful regression test for provider changes. The [MIT license](LICENSE) permits self-hosting and reuse.
