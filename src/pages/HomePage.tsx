import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SiteLayout from '@/components/SiteLayout';
import LiveDemo from '@/components/LiveDemo';

export default function HomePage() {
  return <SiteLayout>
    <section className="mx-auto max-w-4xl text-center mb-12">
      <Badge className="mb-6">Free open-source widget</Badge>
      <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">Turn “check your inbox” into a button.</h1>
      <p className="text-lg text-muted-foreground mx-auto max-w-2xl mb-8">Help people find your confirmation email. SniperLink detects eight email providers, opens webmail, and shows search instructions when a filtered link is unavailable.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild size="lg"><Link to="/embed-generator">Create your widget</Link></Button>
        <Button asChild size="lg" variant="outline"><Link to="/docs">Installation docs</Link></Button>
      </div>
    </section>
    <section aria-label="Try the product" className="mx-auto max-w-xl mb-16"><LiveDemo /></section>
    <section className="mx-auto max-w-5xl grid gap-6 md:grid-cols-3">
      <Card><CardHeader><CardTitle>Know what opens</CardTitle></CardHeader><CardContent>Gmail supports recent-sender search, including Spam. Outlook, Yahoo, iCloud, ProtonMail, AOL, HEY and Mail.ru open webmail with manual search tips.</CardContent></Card>
      <Card><CardHeader><CardTitle>Install where you sign up</CardTitle></CardHeader><CardContent>Use a script tag on plain HTML, a builder’s custom-code block, or your SPA. Pass an email explicitly or connect a form input.</CardContent></Card>
      <Card><CardHeader><CardTitle>Keep email local</CardTitle></CardHeader><CardContent>The widget does not send email addresses to SniperLink. Tracking is off by default, with no fallback interaction tracking.</CardContent></Card>
    </section>
    <section className="mx-auto max-w-3xl mt-16 p-6 border rounded-xl">
      <h2 className="text-xl font-semibold mb-3">Available today</h2>
      <p>The core widget, custom styling, generator, demo and source code are free. Accounts, paid plans, a hosted analytics dashboard and billing are not available in this release.</p>
      <p className="mt-3 text-muted-foreground">Inbox links help people search. They cannot verify delivery, open a specific message reliably on every provider, or measure confirmation lift on their own.</p>
    </section>
  </SiteLayout>;
}
