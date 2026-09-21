## 2025-02-18 - XSS in widget DOM injection
**Vulnerability:** A cross-site scripting (XSS) vulnerability was found in `src/widget/index.ts` because user-supplied configuration settings like `buttonStyle`, `buttonText`, `buttonColor` were injected directly into `.innerHTML` and `<style>` attributes without sanitization.
**Learning:** Pure client-side widgets built with raw DOM manipulation are highly susceptible to XSS. This widget generates elements based on data attributes or initialized configuration objects which can be tampered with.
**Prevention:** Introduced an `escapeHTML` utility to sanitize dynamic values before they are used in `innerHTML` or template literals that are injected into the DOM.
