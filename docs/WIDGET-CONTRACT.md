# Widget contract 1.0

Canonical classic script path: `/widget/sniperlink.js`. `/widget/sniperlink.min.js`, `/sniperlink.js` and `/sniperlink.min.js` are emitted copies of the same built file. The ESM entry is `/widget/sniperlink.esm.js`. Old CDN hostnames must be changed to the chosen deployed origin; this repository cannot provision an external hostname.

Load the classic script once, with `defer` and `referrerpolicy="no-referrer"`. It defines `window.SniperLink`. There is no React or other runtime dependency in the widget bundle. `npm run build` reproduces all delivery assets.

## Data attributes

| Attribute | Default and meaning |
| --- | --- |
| data-sniperlink | Container marker. Works without an ID and with multiple widgets. |
| data-email | Recipient address; absent means form/input flow. Explicit address takes precedence over unrelated forms. |
| data-email-input | CSS selector for a same-page email input. Explicit selector enables form updates. |
| data-sender | Sender email/domain, optionally starting with @. Empty means no sender filter. Malformed values show an error. |
| data-button-text | Literal known-provider button text; provider-specific label when absent. Unknowns always say How to find your email. |
| data-text | PRD text name; data-button-text takes precedence when both exist. |
| data-button-style | default, minimal, custom. Unknown values use default. |
| data-button-color | Six-digit hex; defaults to #6d28d9. Foreground chooses black or white for contrast. Applies to all styles. |
| data-color | PRD color name; data-button-color takes precedence. |
| data-shape | rounded, pill, square. Default rounded. |
| data-show-branding | true by default; only false removes it. No entitlement is claimed. |
| data-no-tracking | true by default; false alone never initializes an analytics service. |

The historical `id="sniper-link"` with `data-sender` still auto-mounts without a marker. Do not use the competitor's `<sniper-link recipient=...>` custom element or its script; those examples have been removed from this product's docs.

New containers mount automatically after DOM ready and on later SPA additions. Attribute changes update the widget; removing the container or marker cleans it up. Same-page form input/change/submit events pass the email without preventing the host form's submission. Passing an email is not evidence that a signup succeeded: host apps should show the confirmation screen only after their own successful submit.

Internal recipient controls add no host form submission field or native validation constraint. Email validation runs only on the widget's own action or Enter key; mobile email keyboards and accessible required/error hints remain available. Host input lookup excludes every widget's internal controls, including when a selector is configured.

Appearance and other non-recipient attribute updates preserve the current recipient. Changing or removing `data-email` or `data-email-input` replaces the prior selection using the current explicit/form source (or returns to empty input when none exists). Writing an identical recipient-source attribute value again preserves the selection.

No matching address yields a labeled email input. Invalid addresses show a validation error. Unknown domains show plain search instructions and an accessible dialog with Close, Escape and native focus return. No mailto/compose link is used as an inbox fallback. Domains match exactly; custom Workspace, relay and subdomains cannot be inferred safely.

## JavaScript API

- SniperLink.version: 1.0.0.
- SniperLink.detectESP(email): provider config or null; config includes name, domains, desktopUrl, capability and helpUrl.
- SniperLink.generateLink(email, config): HTTPS web route or null.
- SniperLink.create(config): uninitialized widget instance.
- SniperLink.Widget: same widget constructor.
- SniperLink.autoInit(root = document): mount data-attribute containers; repeat calls do not duplicate a mount.
- widget.init(): initialize once after the container exists.
- widget.setEmail(email): update the recipient.
- widget.updateConfig(partial): update current settings and render.
- widget.destroy(): remove own content and form listeners; other widgets keep shared styles.

Config accepts the camelCase equivalents sender, email, emailInput, buttonText, buttonStyle, buttonColor, buttonShape, showBranding, noTracking, plus container (HTMLElement) or containerId. container takes precedence. The default containerId is sniperlink-widget. Programmatic integrations must own mount/unmount lifecycle and must not also mark that same container for auto-mount.

onLinkGenerate(link, provider) remains an optional click callback; its link contains the sender search filter and must not be logged as telemetry. onError receives a generic validation/container error, not source input or credentials. siteUrl controls branding using an HTTP(S) origin; automatic installs use the widget script's origin.

## Analytics and privacy

No email or page URL is read from location, stored, logged or submitted. The widget contains no delivery, auth or billing credential and no analytics SDK or network beacon.

Optional programmatic analytics needs all of: an analytics callback, analyticsConsent: true and noTracking: false. Only a known-provider inbox click invokes it. Payload is exactly `{ event: 'inbox_click', provider, linkType: 'web' }`. Callback failures do not block anchor navigation. No emails, sender filters, URLs, arbitrary properties, referrers or user agents are passed. Unknown-provider/manual fallback interactions never invoke it. The embedder must obtain consent and configure its own real analytics service.

## Behavior changes to public TypeScript helpers

The existing generateMobileLink export now returns the same safe HTTPS route as generateSniperLink. Unverified native URI schemes are removed, including Gmail's compose route. detectESP rejects malformed/spoofed/subdomains and exposes capability/helpUrl instead of invented mobileUrl/searchParams support. Legacy unconditional tracking helper exports were removed. Callers of those TypeScript internals must move to the documented consent callback. The data attributes and classic create/init API above are the supported public integration contract.

## Platform limits

Only Gmail supports a filtered web-search URL in this release. The other providers open webmail and describe manual search. A login may be required. Gmail uses the first signed-in account: switch accounts if needed. Mobile browser behavior is tested in Chromium/WebKit emulation; opening installed native email apps is not promised. Strict CSP hosts must permit the script origin, generated stylesheet and inline button styles. Cross-origin iframe form values require the host's official integration.
