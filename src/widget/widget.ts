import {
  contrastingText, detectESP, generateSniperLink, getFallbackInstructions,
  getSearchQuery, isValidEmail, normalizeColor, normalizeSender,
  type SniperLinkConfig
} from '../lib/sniper-link';

export interface WidgetConfig extends SniperLinkConfig {
  containerId?: string;
  container?: HTMLElement;
  email?: string;
  emailInput?: string;
  siteUrl?: string;
  noTracking?: boolean;
  analyticsConsent?: boolean;
  analytics?: (event: { event: 'inbox_click'; provider: string; linkType: 'web' }) => void;
  onLinkGenerate?: (link: string, esp: string) => void;
  onError?: (error: string) => void;
}

function node<K extends keyof HTMLElementTagNameMap>(tag: K, text?: string): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = text;
  return element;
}

let nextId = 0;

export class SniperLinkWidget {
  private config: WidgetConfig;
  private container: HTMLElement | null = null;
  private initialized = false;
  private followsForm: boolean;
  private id = `sniperlink-${++nextId}`;

  constructor(config: WidgetConfig = {}) {
    this.config = { showBranding: true, noTracking: true, ...config };
    this.followsForm = !config.email || Boolean(config.emailInput);
  }

  init(): void {
    if (this.initialized) return;
    this.container = this.config.container ?? document.getElementById(this.config.containerId || 'sniperlink-widget');
    if (!this.container) {
      this.config.onError?.('Widget container not found.');
      return;
    }
    this.initialized = true;
    this.addStyles();
    if (!this.config.email) this.config.email = this.formInput()?.value.trim();
    document.addEventListener('input', this.readForm);
    document.addEventListener('change', this.readForm);
    document.addEventListener('submit', this.readForm, true);
    this.render();
  }

  private formInput(): HTMLInputElement | null {
    let inputs: NodeListOf<HTMLInputElement>;
    try {
      inputs = document.querySelectorAll<HTMLInputElement>(this.config.emailInput || '#email, input[name="email"], input[type="email"]');
    } catch {
      return null;
    }
    return Array.from(inputs).find(input => input instanceof HTMLInputElement
      && !this.container?.contains(input) && !input.closest('.sniperlink-email-input')) ?? null;
  }

  private readForm = (event: Event): void => {
    if (!this.followsForm) return;
    if (this.container?.contains(event.target as Node)) return;
    const input = this.formInput();
    if (!input) return;
    if (event.target === input || (event.target instanceof HTMLFormElement && event.target.contains(input))) {
      this.setEmail(input.value.trim());
    }
  };

  private button(text: string): HTMLButtonElement {
    const button = node('button', text);
    button.type = 'button';
    this.styleButton(button);
    return button;
  }

  private styleButton(button: HTMLButtonElement | HTMLAnchorElement): void {
    button.className = `sniperlink-button${this.config.buttonStyle === 'minimal' ? ' sniperlink-minimal' : ''}`;
    const color = normalizeColor(this.config.buttonColor);
    button.style.backgroundColor = color;
    button.style.color = contrastingText(color);
    button.style.borderRadius = this.config.buttonShape === 'pill' ? '999px' : this.config.buttonShape === 'square' ? '0' : '8px';
  }

  private render(): void {
    if (!this.container) return;
    const body = node('div');
    body.className = 'sniperlink-container';
    const email = this.config.email?.trim() || '';
    if (normalizeSender(this.config.sender) === null) {
      const error = node('p', 'Enter a valid sender email address or domain.');
      error.setAttribute('role', 'alert');
      body.append(error);
      this.config.onError?.('Invalid sender.');
    } else if (!isValidEmail(email)) {
      this.renderInput(body, email);
    } else {
      const esp = detectESP(email);
      const link = generateSniperLink(email, this.config);
      if (esp && link) {
        const anchor = node('a', this.config.buttonText || `Open ${esp.name}`);
        anchor.href = link;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.referrerPolicy = 'no-referrer';
        this.styleButton(anchor);
        anchor.setAttribute('aria-describedby', `${this.id}-capability`);
        anchor.addEventListener('click', () => {
          // Only a known-provider inbox click may be counted, after opt-in.
          // Do not forward URLs, emails, sender, page/referrer, or arbitrary props.
          if (!this.config.noTracking && this.config.analyticsConsent && this.config.analytics) {
            try { this.config.analytics({ event: 'inbox_click', provider: esp.name, linkType: 'web' }); }
            catch { /* Optional callbacks must not block opening webmail. */ }
          }
          try { this.config.onLinkGenerate?.(link, esp.name); }
          catch { /* Preserve the anchor's native navigation if a host callback fails. */ }
        });
        const info = node('p', esp.capability === 'filtered-search'
          ? 'Searches Gmail on the web for recent messages, including Spam. Switch accounts if needed.'
          : `Opens ${esp.name} webmail. Search for the sender manually; check Spam or Junk separately.`);
        info.id = `${this.id}-capability`;
        body.append(anchor, info);
        const details = node('details');
        details.append(node('summary', 'Email not showing up?'), node('p', getFallbackInstructions(email, this.config.sender)));
        const query = node('code', getSearchQuery(email, this.config.sender));
        if (query.textContent) details.append(query);
        const help = node('a', `${esp.name} search help`);
        help.href = esp.helpUrl;
        help.target = '_blank';
        help.rel = 'noopener noreferrer';
        details.append(help);
        body.append(details);
      } else {
        this.renderFallback(body, email);
      }
    }
    if (this.config.showBranding !== false) {
      const branding = node('a', 'Powered by SniperLink');
      let url = location.origin;
      try {
        const configured = new URL(this.config.siteUrl || url);
        if (configured.protocol === 'https:' || configured.protocol === 'http:') url = configured.origin;
      } catch { /* Use the current site if an invalid branding URL was supplied. */ }
      branding.href = url;
      branding.target = '_blank';
      branding.rel = 'noopener noreferrer';
      branding.className = 'sniperlink-branding';
      body.append(branding);
    }
    this.container.replaceChildren(body);
  }

  private renderInput(body: HTMLElement, email: string): void {
    // A widget can live inside a host form. Keep its control nameless and free
    // of native constraints; only its own action validates it or handles Enter.
    const form = node('div');
    form.className = 'sniperlink-email-input';
    form.setAttribute('role', 'group');
    form.setAttribute('aria-label', 'Find your email inbox');
    const label = node('label', 'Email address');
    label.htmlFor = `${this.id}-email`;
    const input = node('input');
    input.id = label.htmlFor;
    input.type = 'text';
    input.inputMode = 'email';
    input.autocomplete = 'email';
    input.setAttribute('aria-required', 'true');
    input.value = email;
    const error = node('p', email ? 'Enter a valid email address.' : '');
    error.id = `${this.id}-error`;
    error.setAttribute('role', 'alert');
    input.setAttribute('aria-describedby', error.id);
    input.setAttribute('aria-invalid', email ? 'true' : 'false');
    const submit = this.button('Find my inbox');
    const generate = () => {
      if (!isValidEmail(input.value)) {
        error.textContent = 'Enter a valid email address.';
        input.setAttribute('aria-invalid', 'true');
        input.focus();
        return;
      }
      this.setEmail(input.value.trim());
      this.container?.querySelector<HTMLElement>('.sniperlink-button')?.focus();
    };
    submit.addEventListener('click', generate);
    input.addEventListener('keydown', event => {
      if (event.key !== 'Enter') return;
      event.preventDefault();
      event.stopPropagation();
      generate();
    });
    form.append(label, input, submit, error);
    body.append(form);
  }

  private renderFallback(body: HTMLElement, email: string): void {
    body.append(node('p', 'Your provider could not be detected. Custom email domains need a manual search.'));
    const instructions = getFallbackInstructions(email, this.config.sender);
    const trigger = this.button('How to find your email');
    const dialog = node('dialog');
    dialog.className = 'sniperlink-dialog';
    const title = node('h3', 'Find your confirmation email');
    title.id = `${this.id}-title`;
    dialog.setAttribute('aria-labelledby', title.id);
    const close = this.button('Close');
    close.addEventListener('click', () => dialog.close());
    dialog.append(title, node('p', instructions), close);
    trigger.addEventListener('click', () => dialog.showModal());
    body.append(trigger, node('p', instructions), dialog);
  }

  private addStyles(): void {
    if (document.getElementById('sniperlink-styles')) return;
    const style = node('style');
    style.id = 'sniperlink-styles';
    style.textContent = `
      .sniperlink-container{font-family:system-ui,sans-serif;color:#1f2937;background:#fff;padding:16px;border-radius:12px;max-width:420px;box-sizing:border-box;line-height:1.5;text-align:center;overflow-wrap:anywhere}
      .sniperlink-container p{font-size:14px;margin:12px 0}
      .sniperlink-container a:not(.sniperlink-button){color:#5b21b6;text-decoration:underline}
      .sniperlink-button{display:inline-block;padding:12px 20px;border:1px solid transparent;font:600 16px/1.5 system-ui,sans-serif;text-decoration:none;cursor:pointer;max-width:100%;box-sizing:border-box;overflow-wrap:anywhere}
      .sniperlink-minimal{padding:8px 12px;font-size:14px}
      .sniperlink-container :is(a,button,input,summary):focus-visible,.sniperlink-dialog button:focus-visible{outline:3px solid #1d4ed8;outline-offset:3px}
      .sniperlink-email-input{display:grid;gap:12px;text-align:left}
      .sniperlink-container input{font:inherit;min-width:0;width:100%;padding:10px;box-sizing:border-box;border:1px solid #6b7280;border-radius:6px;color:#111827;background:#fff}
      .sniperlink-container summary{cursor:pointer;color:#5b21b6;text-decoration:underline}
      .sniperlink-container code{display:block;white-space:pre-wrap;font-size:13px;margin:10px 0}
      .sniperlink-branding{display:block;font-size:12px;margin-top:16px}
      .sniperlink-dialog{font:16px/1.5 system-ui,sans-serif;color:#1f2937;background:#fff;width:min(420px,80vw);border:1px solid #6b7280;border-radius:12px;padding:24px;overflow-wrap:anywhere}
      .sniperlink-dialog::backdrop{background:rgba(0,0,0,.5)}
    `;
    document.head.append(style);
  }

  updateConfig(config: Partial<WidgetConfig>): void {
    this.config = { ...this.config, ...config };
    if ('email' in config || 'emailInput' in config) {
      this.followsForm = !config.email || Boolean(config.emailInput);
      if (this.followsForm && !this.config.email) this.config.email = this.formInput()?.value.trim();
    }
    if (this.initialized) this.render();
  }

  setEmail(email: string): void {
    this.config.email = email;
    if (this.initialized) this.render();
  }

  destroy(): void {
    document.removeEventListener('input', this.readForm);
    document.removeEventListener('change', this.readForm);
    document.removeEventListener('submit', this.readForm, true);
    this.container?.replaceChildren();
    this.initialized = false;
    // Shared styles stay available for the other widgets on the page.
  }
}
