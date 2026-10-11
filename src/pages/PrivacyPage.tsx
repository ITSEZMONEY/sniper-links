import SiteLayout from '@/components/SiteLayout';

export default function PrivacyPage() {
  return <SiteLayout><article className="max-w-3xl mx-auto space-y-6">
    <h1 className="text-3xl font-bold">Privacy in this release</h1>
    <p>Recipient addresses and sender filters are processed in your browser. The widget does not send them to SniperLink, log them, save them in browser storage, or read them from page URLs. Preview and demo state disappear when the page is closed.</p>
    <p>When you choose an inbox link, you navigate to that provider. Gmail receives the sender search filter in the link. Other providers receive their inbox URL. Those providers control their own login, cookies and data handling. Links use no-referrer and a new tab with opener protection.</p>
    <p>The site has no analytics scripts, email delivery endpoint or newsletter subscription form. The widget has no default telemetry. An embedder can explicitly supply a consented analytics callback receiving only a known provider and web-link click event. Manual fallback interactions never invoke it.</p>
    <p>Hosting services may keep ordinary request logs for the site and widget assets. Generated installation snippets suppress the embedding page’s referrer. Keep email addresses and secrets out of asset URLs. A host site’s own scripts, forms and analytics are governed by its privacy policy.</p>
    <p>Accounts, payment processing and a hosted analytics dashboard are not available in this release. Any future data collection needs a separate policy and consent flow before it is enabled.</p>
    <p>For source questions or privacy bugs, use the <a className="underline" href="https://github.com/itsezmoney/sniper-links/issues" target="_blank" rel="noopener noreferrer">repository issue tracker</a>. Do not include real email addresses or credentials in a public issue.</p>
  </article></SiteLayout>;
}
