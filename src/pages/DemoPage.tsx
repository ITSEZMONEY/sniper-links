import SiteLayout from '@/components/SiteLayout';
import LiveDemo from '@/components/LiveDemo';
import { ESP_CONFIGS } from '@/lib/sniper-link';

export default function DemoPage() {
  return <SiteLayout>
    <div className="demo-page mx-auto max-w-4xl space-y-10">
      <div><h1 className="page-title font-bold mb-4">Try the inbox-link engine</h1><p className="text-muted-foreground">Links open webmail on desktop and mobile. Native filtered search is not promised. Sign in to the right email account, then follow the search instructions.</p></div>
      <LiveDemo />
      <section><h2 className="text-xl font-semibold mb-4">Provider capabilities</h2><div className="site-table overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-3">Provider</th><th className="p-3">This release</th></tr></thead><tbody>{ESP_CONFIGS.map(esp => <tr key={esp.name} className="border-t"><th scope="row" className="p-3">{esp.name}</th><td className="p-3">{esp.capability === 'filtered-search' ? 'Gmail web search: sender, last day, all folders' : 'Web inbox and manual sender search'}</td></tr>)}</tbody></table></div></section>
    </div>
  </SiteLayout>;
}
