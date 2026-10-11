import { Link } from 'react-router-dom';
import SiteLayout from '@/components/SiteLayout';
import { generateEmbedCode } from '@/lib/embed';
import { ESP_CONFIGS } from '@/lib/sniper-link';

const attributes = [
  ['data-sniperlink', 'Widget marker. No ID is required.'],
  ['data-email', 'Current recipient address. Omit to show an email input or read a form.'],
  ['data-email-input', 'CSS selector for an email input on this page, such as #email.'],
  ['data-sender', 'Sender email or domain, with an optional leading @. Empty opens recent Gmail search without a sender filter.'],
  ['data-button-text / data-text', 'Literal known-provider button text. data-button-text takes precedence. Unknowns keep a manual-help label.'],
  ['data-button-style', 'default, minimal or custom. Unknown values use default.'],
  ['data-button-color / data-color', 'Six-digit hex color. Text contrast adjusts automatically.'],
  ['data-shape', 'rounded (default), pill or square.'],
  ['data-show-branding', 'true by default. Set false to hide branding; no paid account required.'],
  ['data-no-tracking', 'true by default. Setting false alone does not enable analytics.']
];

export default function DocsPage() {
  const origin = window.location.origin;
  const snippet = generateEmbedCode({ containerId: 'sniperlink-widget', sender: 'noreply@example.com', emailInput: '#email' }, origin);
  const spa = `const widget = SniperLink.create({
  container: document.getElementById('confirmation-widget'),
  email: currentSignupEmail,
  sender: 'noreply@example.com'
});
widget.init();
// After your signup succeeds:
widget.setEmail(currentSignupEmail);
// When the component unmounts:
widget.destroy();`;
  return <SiteLayout>
    <article className="max-w-4xl mx-auto space-y-10">
      <div><h1 className="text-3xl font-bold mb-4">Install SniperLink</h1><p>Version 1.0 of the public widget contract is frozen. Generate links locally, then open the user’s email provider. <Link to="/embed-generator" className="underline">Create a custom snippet.</Link></p></div>
      <section><h2 className="text-2xl font-semibold mb-3">Plain HTML</h2><p className="mb-3">Put this on your confirmation screen. Replace the sender and connect your email input. The script is served by this site, so the snippet works from another origin.</p><pre className="overflow-x-auto rounded border p-4 bg-muted text-sm"><code>{snippet}</code></pre><p className="mt-3">For a separate thank-you page, set data-email using your app after signup succeeds. No-email widgets show their own labeled input. Email is not read from URLs or saved in browser storage.</p></section>
      <section><h2 className="text-2xl font-semibold mb-3">Webflow, WordPress and builders</h2><p>Use a custom HTML/code block for the container. Load the script once in footer custom code. Publish and test the page; some editors block scripts in preview. No framework is required.</p><p className="mt-3">Same-page forms are read on input, change and submit, without preventing your submit. Use data-email-input for a specific field. A cross-origin Typeform iframe cannot be inspected: use its official completion integration to pass an address your app already has. This widget does not send or confirm email.</p></section>
      <section><h2 className="text-2xl font-semibold mb-3">React and other SPAs</h2><p className="mb-3">Load <code>{origin}/widget/sniperlink.js</code> once. Data-attribute containers added later are mounted automatically; changing their attributes updates them and removal cleans up their form listeners. Or own the lifecycle yourself:</p><pre className="overflow-x-auto rounded border p-4 bg-muted text-sm"><code>{spa}</code></pre><p className="mt-3">Call init after the container mounts and destroy in the component cleanup. Use either automatic data-attribute mounting or programmatic mounting for a given container. The ESM asset is <code>/widget/sniperlink.esm.js</code>, with create, Widget, generateLink, detectESP and autoInit exports.</p></section>
      <section><h2 className="text-2xl font-semibold mb-3">Public data attributes</h2><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-3">Attribute</th><th className="p-3">Behavior</th></tr></thead><tbody>{attributes.map(([name, description]) => <tr key={name} className="border-t"><th scope="row" className="p-3 font-mono">{name}</th><td className="p-3">{description}</td></tr>)}</tbody></table></div><p className="mt-3">Existing #sniper-link containers with data-sender still mount. Canonical script: /widget/sniperlink.js. /widget/sniperlink.min.js, /sniperlink.js and /sniperlink.min.js serve the same built widget. An old external CDN hostname must be replaced with your deployed origin; this release cannot configure that hostname.</p></section>
      <section><h2 className="text-2xl font-semibold mb-3">Provider capability and mobile behavior</h2><ul className="space-y-3">{ESP_CONFIGS.map(esp => <li key={esp.name}><strong>{esp.name}:</strong> {esp.capability === 'filtered-search' ? 'Web search with from:sender, newer_than:1d and in:anywhere. Remove the recency filter for older messages.' : 'Opens the web inbox. Search by sender and check Spam/Junk manually.'} <a className="underline" href={esp.helpUrl} target="_blank" rel="noopener noreferrer">Provider help</a></li>)}</ul><p className="mt-4">Mobile uses the same HTTPS web links. There is no universal native filtered-search scheme. Gmail’s old compose scheme has been removed. A browser or OS may hand a web link to its installed app; we do not promise that behavior. Custom domains and relay addresses get manual instructions because the domain alone cannot identify their provider. Switch to the account used at signup.</p></section>
      <section><h2 className="text-2xl font-semibold mb-3">Privacy and optional analytics</h2><p>The site and widget have no default analytics requests, cookies, email logs or stored email addresses. Fallback instructions and dialog interactions are never tracked. You may supply a host-owned analytics callback with noTracking: false and analyticsConsent: true. It receives only event: inbox_click, provider and linkType: web. Configure your own analytics service and obtain consent before enabling that callback. No event includes the recipient, sender, inbox URL, page URL, referrer or user agent.</p></section>
      <section><h2 className="text-2xl font-semibold mb-3">Self-host and contribute</h2><p>Run <code>npm ci</code>, then <code>npm run build</code>. Serve dist with the supplied SPA/static routing. The widget is dependency-free in the browser and works without service keys. Strict CSP hosts must allow its script origin and generated style tag/inline styles. Do not put server credentials in a VITE_ variable.</p><p className="mt-3"><a className="underline" href="https://github.com/itsezmoney/sniper-links" target="_blank" rel="noopener noreferrer">MIT source and issue tracker</a>. Accounts, billing, hosted analytics, domain entitlement checks and the wider PRD roadmap are documented follow-on work. No paid feature is sold by this release.</p></section>
    </article>
  </SiteLayout>;
}
