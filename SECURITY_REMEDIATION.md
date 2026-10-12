# Security notes for the first release

The former browser-side delivery integration contained a hardcoded delivery credential, and an older remediation note repeated it. Both paths have been removed from the working tree. No delivery credential is needed by this product's core.

The parent must revoke or rotate the previously exposed credential if it is still active. Removing code does not revoke a credential or erase Git history. This implementation did not access a delivery account or change any live service.

Widget rendering uses DOM nodes and textContent. Sender/email validation rejects markup and search-operator injection. Snippet attributes are HTML encoded. Style inputs accept six-digit hex values and documented enums only. Inbox links come from a fixed HTTPS provider map, with opener and referrer protection.

Tracking is disabled by default. Only explicitly consented known-provider clicks can reach a host analytics callback; payloads exclude email, sender, URLs, page/referrer and user agent. Unknown-provider interactions are never tracked. There are no browser SDKs for billing or email delivery.

Regression checks: npm test, npm run lint, npm run test:browser and npm run check:release. The release scan reports filenames only if a credential pattern is found. Do not print historical diffs of credential-bearing files or paste raw provider logs into reports.
