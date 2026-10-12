# PRD scope and follow-on requirements

Source: Obsidian wiki, “SniperLinks – Instantly Recover Lost Signups”, Detailed PRD v1.0. This release follows the authorized core-first scope and keeps the broader fourteen stories visible. Source contained a thin widget/site and no auth, data model or billing service. No repo environment keys were present. No live service accounts or credential stores were accessed, and no secrets were provisioned.

The released core is free and open source, with no fabricated plan limits, signup state, paid entitlement, analytics dataset or confirmation-lift claim. The hosted demo is visibly labeled as a real link generator; it does not send email or simulate signup success.

| Story | First release | Remaining scope |
| --- | --- | --- |
| US-001 Generate basic widget | Validated sender/email, live real widget preview, safe snippets, copy/download. | One-domain plan/session entitlement is not enforced or claimed. |
| US-002 Detect ESP and craft links | Eight exact-domain providers; Gmail sender/last-day/all-folder search; other providers' actual webmail routes. | Universal filtered-message links, arbitrary-domain provider inference and detection telemetry are not claimed. Unknowns use manual tips, never compose. |
| US-003 Customize appearance | Live text, style, hex color, shape and branding controls via documented attributes. Contrast-adaptive text. | Styling is free in the open-source release; no paid gate exists. |
| US-004 Track dashboard clicks | Optional consented, non-PII known-provider click callback for a host's real analytics. | Hosted persistence, authenticated aggregates, CTR denominator, date filters and dashboard. |
| US-005 Mobile links | HTTPS web route and explicit manual fallback. Gmail compose bug reproduced and removed. | Native inbox/search schemes require current provider evidence and physical/native-app tests. Browser tests are emulation only. |
| US-006 Domain plan validation | No misleading limit or upsell. | Server-owned domain verification, tenant ownership, RLS and entitlement enforcement; client-only restrictions are not trusted. |
| US-007 Unknown-provider fallback | Visible search tips and keyboard/ARIA dialog with Escape/focus return. No tracking of fallback interactions. | Rare provider additions can be contributed to the static map. |
| US-008 Secure authentication | Account/signup CTAs removed; availability is explicit. | Auth backend, password/magic-link/reset, abuse/rate limits, tenant RLS, authorized dashboard and logout. |
| US-009 Referral badge | Optional plain attribution badge, without invented percentage lift. | Real referral attribution, measured baseline/outcome, credit ledger and abuse prevention. |
| US-010 A/B variants | Manual text/style customization works. | Stable variant assignment, consented exposure/click collection, real significance calculations and controlled winner rollout. |
| US-011 Signup forms | Same-page input/change/submit integration, explicit data-email for app success screens, dynamic SPA mounting and cleanup. | Cross-origin Typeform/post-payment integrations require the host's official API; no access to unrelated form data or webhook is fabricated. |
| US-012 Analytics export | No fake sample rows or dead export action. | Authenticated tenant-scoped exports with limits, retention and a privacy-safe schema. Do not include recipient or inbox URL in telemetry. |
| US-013 Graceful errors | Local static engine works offline after script load, validated errors, callback isolation on click; form lifecycle does not block the page. | CDN/live outage exercises and consented non-PII operational monitoring. Queued PII logs are deliberately excluded. |
| US-014 Dynamic ESP admin | Checked static eight-provider map, documented capabilities and meaningful provider regressions. | Authenticated admin management, versioning/rollback and safe update distribution. |

## Wider service foundation

Paid Pro/Team/Enterprise pricing remains a PRD proposal, not an available checkout. A later service needs a separately provisioned auth/database backend with schema and tenant RLS, server-only delivery where needed, a payment backend with signature-verified webhooks and durable entitlements, real consented analytics, measured outcomes, and abuse/retention controls. The public site names these features as unavailable. No keys are required to ship the current widget.

Additional post-MVP ideas stay deferred: extension, generate API, AI sender inference, managed custom domains, enterprise SSO, bulk API, webhooks, referrals and team collaboration. Do not enable them with placeholder success paths.

## Material differences from the PRD

- Filtered search works for Gmail; seven providers have honest inbox/manual behavior. Native filtered search is not universal and no compose URI is used.
- Existing public snippet attributes and classic API are retained and documented. TypeScript helper telemetry exports and unsupported mobile configuration were removed; callers need the new documented consent callback.
- The PRD's uncompressed 2–5KB target is not met. The emitted classic widget is about 12.6KB minified and 4.7KB gzip; keep this distinction explicit.
- Account, dashboard, billing, plan/domain enforcement, referral/A/B/exports and dynamic administration are follow-on service work, not delivered features. This is intentional under the human-authorized core-first scope.
- Browser automation covers desktop and mobile emulations; native installed apps, authenticated mailbox content and deployed Vercel headers still require parent/live checks.

Provider behavior references: [Gmail search operators](https://support.google.com/mail/answer/7190), [Outlook search](https://support.microsoft.com/office/search-mail-and-people-in-outlook-com-88108edf-028e-4306-b87e-7400bbb40aa7), [Proton search](https://proton.me/support/search), [HEY Everything](https://help.hey.com/article/903-how-can-i-see-all-my-emails), [Mail.ru search](https://help.mail.ru/mail/letters/inbox/search/). Routing reference: [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite).
