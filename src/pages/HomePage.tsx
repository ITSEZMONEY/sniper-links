import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SiteLayout from '@/components/SiteLayout';
import LiveDemo from '@/components/LiveDemo';

export default function HomePage() {
  return <SiteLayout>
    <div className="home-scene">
    <section className="home-intro">
      <p className="home-kicker">Free open-source widget</p>
      <h1 className="home-headline font-bold">Turn “check your inbox” into a button.</h1>
      <p className="home-description text-muted-foreground">Help people find your confirmation email. SniperLink detects eight email providers, opens webmail, and shows search instructions when a filtered link is unavailable.</p>
      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg"><Link to="/embed-generator">Create your widget</Link></Button>
        <Button asChild size="lg" variant="outline"><Link to="/docs">Installation docs</Link></Button>
      </div>
    </section>
    <section aria-label="Try the product" className="home-tool"><LiveDemo /></section>
    </div>
    <section className="home-details">
      <div><h2>Know what opens</h2><p>Gmail supports recent-sender search, including Spam. Outlook, Yahoo, iCloud, ProtonMail, AOL, HEY and Mail.ru open webmail with manual search tips.</p></div>
      <div><h2>Install where you sign up</h2><p>Use a script tag on plain HTML, a builder’s custom-code block, or your SPA. Pass an email explicitly or connect a form input.</p></div>
      <div><h2>Keep email local</h2><p>The widget does not send email addresses to SniperLink. Tracking is off by default, with no fallback interaction tracking.</p></div>
    </section>
    <section className="scope-note">
      <h2 className="text-xl font-semibold mb-3">Available today</h2>
      <p>The core widget, custom styling, generator, demo and source code are free. Accounts, paid plans, a hosted analytics dashboard and billing are not available in this release.</p>
      <p className="mt-3 text-muted-foreground">Inbox links help people search. They cannot verify delivery, open a specific message reliably on every provider, or measure confirmation lift on their own.</p>
    </section>
  </SiteLayout>;
}
