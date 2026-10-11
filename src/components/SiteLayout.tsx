import { Link, NavLink } from 'react-router-dom';
import { Target } from 'lucide-react';
import type { ReactNode } from 'react';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-background">
    <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-4">Skip to content</a>
    <header className="border-b bg-background/95">
      <nav aria-label="Main navigation" className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-xl"><Target className="text-purple-700" aria-hidden="true" />SniperLink</Link>
        <div className="flex flex-wrap gap-4 text-sm">
          <NavLink to="/demo">Demo</NavLink><NavLink to="/embed-generator">Generator</NavLink><NavLink to="/docs">Docs</NavLink>
          <a href="https://github.com/itsezmoney/sniper-links" target="_blank" rel="noopener noreferrer">Source</a>
        </div>
      </nav>
    </header>
    <main id="main-content" className="container mx-auto px-4 py-12">{children}</main>
    <footer className="border-t px-4 py-6 text-center text-sm text-muted-foreground">
      Free, open-source inbox links. <Link to="/privacy" className="underline">Privacy</Link>
    </footer>
  </div>;
}
