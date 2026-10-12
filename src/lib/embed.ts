import { isValidEmail, normalizeSender, normalizeColor, type SniperLinkConfig } from './sniper-link.ts';

export interface EmbedConfig extends SniperLinkConfig {
  containerId: string;
  email?: string;
  emailInput?: string;
}

export function escapeAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function generateEmbedCode(config: EmbedConfig, origin: string): string {
  const url = new URL(origin);
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Use an HTTPS or local HTTP widget origin.');
  if (!/^[a-zA-Z][\w-]*$/.test(config.containerId)) throw new Error('Container ID must start with a letter and contain only letters, numbers, underscores or hyphens.');
  if (normalizeSender(config.sender) === null) throw new Error('Enter a valid sender email address or domain.');
  if (config.email && !isValidEmail(config.email)) throw new Error('Enter a valid recipient email address.');
  const attributes: Record<string, string> = {
    id: config.containerId,
    'data-sender': config.sender?.trim() || '',
    'data-button-text': config.buttonText || 'Open Inbox',
    'data-button-style': config.buttonStyle || 'default',
    'data-button-color': normalizeColor(config.buttonColor),
    'data-shape': config.buttonShape || 'rounded',
    'data-show-branding': String(config.showBranding !== false),
    'data-no-tracking': 'true'
  };
  if (config.email) attributes['data-email'] = config.email.trim();
  else if (config.emailInput) attributes['data-email-input'] = config.emailInput;
  return `<div data-sniperlink\n${Object.entries(attributes).map(([key, value]) => `  ${key}="${escapeAttribute(value)}"`).join('\n')}></div>\n<script defer src="${escapeAttribute(url.origin)}/widget/sniperlink.js" referrerpolicy="no-referrer"></script>`;
}
