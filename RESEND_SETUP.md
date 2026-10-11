# Email delivery is outside this release

SniperLink generates inbox links; the embedding application's existing signup flow sends its confirmation email. This repository does not send test emails, enroll a newsletter subscriber or create an account.

The former browser Resend integration has been removed because it embedded a delivery credential in client code. Its API key must not be placed in a VITE_* variable. The parent must revoke the exposed credential if it is active.

Any future account or newsletter flow needs a server-owned delivery integration, consent/subscription persistence, abuse limits and real provider-error handling. See docs/PRD-SCOPE.md for the wider service requirements. No email delivery environment variable is required now.
