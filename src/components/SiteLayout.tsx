import { Link, NavLink } from 'react-router-dom';
import { Target } from 'lucide-react';
import type { ReactNode } from 'react';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return <div className="dark site-shell min-h-screen bg-background text-foreground">
    <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-card focus:text-foreground focus:p-4">Skip to content</a>
    <header className="site-header border-b bg-background/95">
      <nav aria-label="Main navigation" className="site-width flex flex-wrap items-center justify-between gap-4 py-5">
        <Link to="/" className="flex items-center gap-2 font-semibold text-xl"><Target className="text-primary" aria-hidden="true" />SniperLink</Link>
        <div className="site-nav flex flex-wrap gap-4 text-sm">
          <NavLink to="/demo">Demo</NavLink><NavLink to="/embed-generator">Generator</NavLink><NavLink to="/docs">Docs</NavLink>
          <a href="https://github.com/itsezmoney/sniper-links" target="_blank" rel="noopener noreferrer">Source</a>
        </div>
      </nav>
    </header>
    <main id="main-content" tabIndex={-1} className="site-width site-main">{children}</main>
    <footer className="site-footer border-t px-4 py-8 text-center text-sm text-muted-foreground">
      Free, open-source inbox links. <Link to="/privacy" className="underline">Privacy</Link>
    </footer>
  </div>;
}
