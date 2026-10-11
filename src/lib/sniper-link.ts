export interface SniperLinkConfig {
  sender?: string;
  showBranding?: boolean;
  buttonText?: string;
  buttonStyle?: 'default' | 'minimal' | 'custom';
  buttonColor?: string;
  buttonShape?: 'rounded' | 'pill' | 'square';
}

export interface ESPConfig {
  name: string;
  domains: readonly string[];
  desktopUrl: string;
  capability: 'filtered-search' | 'inbox';
  helpUrl: string;
}

// Only Gmail has a sender/recency/all-folders search URL in this release.
// Other providers open their real webmail and show manual search instructions.
export const ESP_CONFIGS: readonly ESPConfig[] = [
  { name: 'Gmail', domains: ['gmail.com', 'googlemail.com'], desktopUrl: 'https://mail.google.com/mail/u/0/', capability: 'filtered-search', helpUrl: 'https://support.google.com/mail/answer/7190' },
  { name: 'Outlook', domains: ['outlook.com', 'live.com', 'hotmail.com', 'msn.com', 'outlook.fr', 'outlook.de'], desktopUrl: 'https://outlook.live.com/mail/0/inbox', capability: 'inbox', helpUrl: 'https://support.microsoft.com/office/search-mail-and-people-in-outlook-com-88108edf-028e-4306-b87e-7400bbb40aa7' },
  { name: 'Yahoo', domains: ['yahoo.com', 'yahoo.co.uk', 'yahoo.ca', 'yahoo.com.au', 'yahoo.fr', 'yahoo.de', 'ymail.com', 'rocketmail.com'], desktopUrl: 'https://mail.yahoo.com/', capability: 'inbox', helpUrl: 'https://help.yahoo.com/kb/SLN28067.html' },
  { name: 'iCloud', domains: ['icloud.com', 'me.com', 'mac.com'], desktopUrl: 'https://www.icloud.com/mail/', capability: 'inbox', helpUrl: 'https://support.apple.com/guide/icloud/search-for-emails-mm6b1a88a194/icloud' },
  { name: 'ProtonMail', domains: ['protonmail.com', 'protonmail.ch', 'proton.me', 'pm.me'], desktopUrl: 'https://mail.proton.me/', capability: 'inbox', helpUrl: 'https://proton.me/support/search' },
  { name: 'AOL', domains: ['aol.com', 'aim.com', 'verizon.net'], desktopUrl: 'https://mail.aol.com/', capability: 'inbox', helpUrl: 'https://help.aol.com/articles/search-for-emails-in-aol-mail' },
  { name: 'HEY', domains: ['hey.com'], desktopUrl: 'https://app.hey.com/', capability: 'inbox', helpUrl: 'https://help.hey.com/article/903-how-can-i-see-all-my-emails' },
  { name: 'Mail.ru', domains: ['mail.ru', 'bk.ru', 'inbox.ru', 'list.ru', 'internet.ru'], desktopUrl: 'https://e.mail.ru/', capability: 'inbox', helpUrl: 'https://help.mail.ru/mail/letters/inbox/search/' }
];

const DOMAIN = /^(?:[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?\.)+[a-z]{2,63}$/i;
const LOCAL_PART = /^[a-z\d.!#$%&'*+/=?^_`{|}~-]+$/i;

export function isValidEmail(email: string): boolean {
  const value = email.trim();
  const parts = value.split('@');
  const local = parts[0];
  return value.length <= 254 && parts.length === 2 && local.length > 0 && local.length <= 64
    && LOCAL_PART.test(local) && !local.startsWith('.') && !local.endsWith('.')
    && !local.includes('..') && DOMAIN.test(parts[1]);
}

export function normalizeSender(sender = ''): string | null {
  const value = sender.trim().replace(/^@/, '');
  if (!value) return '';
  return (DOMAIN.test(value) && value.length <= 253) || isValidEmail(value) ? value : null;
}

export function detectESP(email: string): ESPConfig | null {
  if (!isValidEmail(email)) return null;
  const domain = email.trim().split('@')[1].toLowerCase();
  // Do not treat attacker.gmail.com or custom Workspace domains as Gmail.
  return ESP_CONFIGS.find(esp => esp.domains.includes(domain)) ?? null;
}

export function getSearchQuery(email: string, sender?: string): string {
  const normalized = normalizeSender(sender);
  if (normalized === null) return '';
  if (detectESP(email)?.name === 'Gmail') {
    return `${normalized ? `from:${normalized} ` : ''}newer_than:1d in:anywhere`;
  }
  return normalized;
}

export function generateSniperLink(email: string, config: SniperLinkConfig = {}): string | null {
  const esp = detectESP(email);
  if (!esp || normalizeSender(config.sender) === null) return null;
  return esp.capability === 'filtered-search'
    ? `${esp.desktopUrl}#search/${encodeURIComponent(getSearchQuery(email, config.sender))}`
    : esp.desktopUrl;
}

// The old googlegmail://co?to= path composed a message. Native filtered search
// is not a verified cross-platform capability; use the working HTTPS route.
export function generateMobileLink(email: string, config: SniperLinkConfig = {}): string | null {
  return generateSniperLink(email, config);
}

export function getFallbackInstructions(email: string, sender?: string): string {
  const esp = detectESP(email);
  const normalized = normalizeSender(sender);
  if (normalized === null) return 'Enter a valid sender email address or domain.';
  const target = normalized || 'the service you signed up for';
  if (esp?.name === 'Gmail') {
    return `In the correct Gmail account, search for ${getSearchQuery(email, sender)}. This includes Spam and Trash. If the message is older, remove newer_than:1d. Check Promotions too.`;
  }
  if (esp?.name === 'HEY') {
    return `Open the HEY account you signed up with. Search for ${target} in Everything, then check Spam and Screened out.`;
  }
  return `Open ${esp?.name ?? 'the email app or webmail'} for the address you signed up with. Search for ${target}, or use the From filter if available. Check recent messages and Spam or Junk separately. Inbox links do not guarantee a filtered result.`;
}

export function normalizeColor(value?: string): string {
  return value && /^#[a-f\d]{6}$/i.test(value) ? value : '#6d28d9';
}

// Pick the text color with the higher WCAG contrast against the chosen color.
export function contrastingText(color: string): '#ffffff' | '#000000' {
  const channels = normalizeColor(color).slice(1).match(/../g)!.map(hex => {
    const n = parseInt(hex, 16) / 255;
    return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
  });
  const luminance = channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  return 1.05 / (luminance + 0.05) >= (luminance + 0.05) / 0.05 ? '#ffffff' : '#000000';
}
