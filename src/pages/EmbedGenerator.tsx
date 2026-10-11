import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SiteLayout from '@/components/SiteLayout';
import WidgetPreview from '@/components/WidgetPreview';
import { generateEmbedCode, type EmbedConfig } from '@/lib/embed';
import { isValidEmail, normalizeColor } from '@/lib/sniper-link';

export default function EmbedGenerator() {
  const [config, setConfig] = useState<EmbedConfig>({ sender: 'noreply@example.com', buttonText: 'Open Inbox', buttonStyle: 'default', buttonColor: '#6d28d9', buttonShape: 'rounded', showBranding: true, containerId: 'sniperlink-widget' });
  const [email, setEmail] = useState('user@gmail.com');
  const [mode, setMode] = useState<'prompt' | 'form' | 'fixed'>('prompt');
  const [emailInput, setEmailInput] = useState('#email');
  const [status, setStatus] = useState('');
  let code = '';
  let error = '';
  try {
    if (mode === 'form') document.querySelector(emailInput);
    code = generateEmbedCode({ ...config, email: mode === 'fixed' ? email : undefined, emailInput: mode === 'form' ? emailInput : undefined }, window.location.origin);
    if (mode === 'form' && !emailInput.trim()) error = 'Enter the selector of your signup email input.';
  } catch (issue) {
    error = issue instanceof Error && issue.name !== 'SyntaxError' ? issue.message : 'Enter a valid CSS selector for the email input.';
  }
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setStatus('Code copied.'); }
    catch { setStatus('Clipboard unavailable. Select and copy the code below.'); }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SniperLink widget</title><body>${code}</body></html>`], { type: 'text/html' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'sniperlink-embed.html';
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const update = <K extends keyof EmbedConfig>(key: K, value: EmbedConfig[K]) => { setConfig(current => ({ ...current, [key]: value })); setStatus(''); };
  return <SiteLayout>
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-3">Generate your widget</h1>
      <p className="text-muted-foreground mb-8">Preview uses the actual widget. Copied snippets load its script from this site. Replace the example sender with your own.</p>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card><CardHeader><CardTitle>Configuration</CardTitle></CardHeader><CardContent className="space-y-4">
            <div><label htmlFor="sender" className="block mb-2">Sender email or domain</label><Input id="sender" value={config.sender} onChange={e => update('sender', e.target.value)} /></div>
            <div><label htmlFor="containerId" className="block mb-2">Container ID</label><Input id="containerId" value={config.containerId} onChange={e => update('containerId', e.target.value)} /></div>
            <div><label htmlFor="email-mode" className="block mb-2">Recipient integration</label><select id="email-mode" className="w-full border rounded p-2 bg-background" value={mode} onChange={e => { setMode(e.target.value as typeof mode); setStatus(''); }}><option value="prompt">Ask for email in the widget</option><option value="form">Read my signup email input</option><option value="fixed">Use the preview email in this snippet</option></select></div>
            {mode === 'form' && <div><label htmlFor="emailInput" className="block mb-2">Email input CSS selector</label><Input id="emailInput" value={emailInput} onChange={e => { setEmailInput(e.target.value); setStatus(''); }} /><p className="text-sm text-muted-foreground mt-2">The input must be on the same page. For embedded Typeform iframes or a redirect, pass the email with your own app integration.</p></div>}
            {mode === 'fixed' && <p className="text-sm">This exports the preview address. In production, set data-email to the current signup address using your application.</p>}
          </CardContent></Card>
          <Card><CardHeader><CardTitle>Style</CardTitle></CardHeader><CardContent className="space-y-4">
            <div><label htmlFor="buttonText" className="block mb-2">Button text</label><Input id="buttonText" value={config.buttonText} maxLength={160} onChange={e => update('buttonText', e.target.value)} /></div>
            <div><label htmlFor="buttonStyle" className="block mb-2">Button style</label><select id="buttonStyle" className="w-full border rounded p-2 bg-background" value={config.buttonStyle} onChange={e => update('buttonStyle', e.target.value as EmbedConfig['buttonStyle'])}><option value="default">Default</option><option value="minimal">Minimal</option><option value="custom">Custom</option></select></div>
            <div><label htmlFor="buttonColor" className="block mb-2">Button color</label><div className="flex gap-3"><input aria-label="Choose button color" type="color" value={normalizeColor(config.buttonColor)} onChange={e => update('buttonColor', e.target.value)} /><Input id="buttonColor" value={config.buttonColor} onChange={e => update('buttonColor', e.target.value)} /></div><p className="text-sm text-muted-foreground mt-2">Use six-digit hex. Invalid colors use purple. Text adjusts for contrast.</p></div>
            <div><label htmlFor="buttonShape" className="block mb-2">Button shape</label><select id="buttonShape" className="w-full border rounded p-2 bg-background" value={config.buttonShape} onChange={e => update('buttonShape', e.target.value as EmbedConfig['buttonShape'])}><option value="rounded">Rounded</option><option value="pill">Pill</option><option value="square">Square</option></select></div>
            <label className="flex gap-3 items-center"><input type="checkbox" checked={config.showBranding} onChange={e => update('showBranding', e.target.checked)} />Show “Powered by SniperLink”</label>
            <p className="text-sm text-muted-foreground">Styling and the branding toggle are free in this open-source release.</p>
          </CardContent></Card>
        </div>
        <div className="space-y-6">
          <Card><CardHeader><CardTitle>Live preview</CardTitle></CardHeader><CardContent className="space-y-4">
            <div><label htmlFor="previewEmail" className="block mb-2">Preview email</label><Input id="previewEmail" type="email" value={email} onChange={e => { setEmail(e.target.value); setStatus(''); }} /></div>
            {!isValidEmail(email) ? <p role="alert">Enter a valid preview email.</p> : <WidgetPreview email={email} config={config} />}
            <p className="text-sm text-muted-foreground">This opens real webmail. It does not send a message. Unknown providers show manual instructions.</p>
          </CardContent></Card>
          <Card><CardHeader><CardTitle>Install code</CardTitle></CardHeader><CardContent className="space-y-4">
            {error ? <p role="alert" className="text-red-700">{error}</p> : <textarea aria-label="Embed code" readOnly value={code} rows={15} className="w-full border rounded p-3 font-mono text-xs bg-muted" />}
            <div className="flex flex-wrap gap-3"><Button onClick={copy} disabled={!!error}>Copy code</Button><Button variant="outline" onClick={download} disabled={!!error}>Download HTML</Button><Button variant="outline" asChild><a href="/widget/sniperlink.js" download>Download widget JS</a></Button></div>
            <p role="status" className="text-sm">{status}</p>
            <p className="text-sm">Paste on your confirmation screen, after your signup succeeds. No account or service key is required. <Link to="/docs" className="underline">See HTML, builder and SPA instructions.</Link></p>
          </CardContent></Card>
        </div>
      </div>
    </div>
  </SiteLayout>;
}
