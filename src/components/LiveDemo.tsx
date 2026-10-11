import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import WidgetPreview from './WidgetPreview';
import { detectESP, generateSniperLink, isValidEmail, normalizeSender, type SniperLinkConfig } from '@/lib/sniper-link';

export default function LiveDemo() {
  const [email, setEmail] = useState('user@gmail.com');
  const [sender, setSender] = useState('noreply@example.com');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ email: string; config: SniperLinkConfig } | null>(null);
  const run = (event: FormEvent) => {
    event.preventDefault();
    if (!isValidEmail(email) || normalizeSender(sender) === null) {
      setError('Enter a valid email and a sender email address or domain.');
      setResult(null);
      return;
    }
    setError('');
    setResult({ email: email.trim(), config: { sender } });
  };
  const provider = result ? detectESP(result.email) : null;
  const link = result ? generateSniperLink(result.email, result.config) : null;
  return <Card>
    <CardHeader>
      <CardTitle>Live inbox-link demo</CardTitle>
      <CardDescription>Example addresses are illustrative. This generates a real link; it does not send an email or confirm a signup.</CardDescription>
    </CardHeader>
    <CardContent className="space-y-6">
      <form onSubmit={run} className="grid gap-4">
        <div><label htmlFor="demo-email" className="block mb-2 font-medium">Recipient email</label><Input id="demo-email" type="email" required maxLength={254} value={email} onChange={e => { setEmail(e.target.value); setResult(null); }} /></div>
        <div><label htmlFor="demo-sender" className="block mb-2 font-medium">Sender email or domain</label><Input id="demo-sender" value={sender} onChange={e => { setSender(e.target.value); setResult(null); }} /></div>
        <Button type="submit">Generate inbox link</Button>
        {error && <p role="alert" className="text-red-700">{error}</p>}
      </form>
      {result && <section aria-label="Generated inbox link" className="space-y-4 border-t pt-6">
        <p role="status">{provider ? `${provider.name}: ${provider.capability === 'filtered-search' ? 'filtered web search' : 'inbox with manual search'}` : 'Unknown provider: manual instructions'}</p>
        <WidgetPreview email={result.email} config={result.config} />
        {link && <p className="break-all text-xs text-muted-foreground">Generated URL: <code>{link}</code></p>}
      </section>}
    </CardContent>
  </Card>;
}
