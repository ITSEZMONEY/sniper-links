import { SniperLinkWidget, type WidgetConfig } from './widget';
import { detectESP, generateSniperLink } from '../lib/sniper-link';

export { SniperLinkWidget as Widget, detectESP };
export const generateLink = generateSniperLink;
export const version = '1.0.0';

declare global {
  interface Window {
    SniperLink: {
      Widget: typeof SniperLinkWidget;
      create: typeof create;
      autoInit: typeof autoInit;
      detectESP: typeof detectESP;
      generateLink: typeof generateSniperLink;
      version: string;
    };
  }
}

// Capture the script's own origin, not the embedding site's origin.
const script = document.currentScript as HTMLScriptElement | null;
const siteUrl = new URL(script?.src || import.meta.url, document.baseURI).origin;
const widgets = new Map<HTMLElement, SniperLinkWidget>();
const selector = '[data-sniperlink], #sniper-link[data-sender]';

export function create(config: WidgetConfig): SniperLinkWidget {
  return new SniperLinkWidget({ siteUrl, ...config });
}

function readConfig(element: HTMLElement, includeRecipient = true): WidgetConfig {
  return {
    container: element,
    ...(includeRecipient ? { email: element.dataset.email, emailInput: element.dataset.emailInput } : {}),
    sender: element.dataset.sender,
    buttonText: element.dataset.buttonText ?? element.dataset.text,
    buttonStyle: element.dataset.buttonStyle as WidgetConfig['buttonStyle'],
    buttonColor: element.dataset.buttonColor ?? element.dataset.color,
    buttonShape: element.dataset.shape as WidgetConfig['buttonShape'],
    showBranding: element.dataset.showBranding !== 'false',
    noTracking: element.dataset.noTracking !== 'false',
    siteUrl
  };
}

export function autoInit(root: ParentNode = document): void {
  const elements = Array.from(root.querySelectorAll<HTMLElement>(selector));
  if (root instanceof HTMLElement && root.matches(selector)) elements.unshift(root);
  for (const element of elements) {
    if (widgets.has(element)) continue;
    const widget = create(readConfig(element));
    widgets.set(element, widget);
    widget.init();
  }
}

const attributes = ['data-sniperlink', 'data-email', 'data-email-input', 'data-sender', 'data-button-text', 'data-text', 'data-button-style', 'data-button-color', 'data-color', 'data-shape', 'data-show-branding', 'data-no-tracking'];

function start(): void {
  autoInit();
  new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.target instanceof HTMLElement) {
        const element = mutation.target;
        const widget = widgets.get(element);
        if (widget && !element.matches(selector)) {
          widget.destroy();
          widgets.delete(element);
        } else if (widget) {
          const attribute = mutation.attributeName;
          const recipientChanged = (attribute === 'data-email' || attribute === 'data-email-input')
            && mutation.oldValue !== element.getAttribute(attribute);
          widget.updateConfig(readConfig(element, recipientChanged));
        } else {
          autoInit(element);
        }
      }
      for (const node of mutation.addedNodes) {
        if (node instanceof HTMLElement) autoInit(node);
      }
    }
    for (const [element, widget] of widgets) {
      if (!element.isConnected) {
        widget.destroy();
        widgets.delete(element);
      }
    }
  }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeOldValue: true, attributeFilter: attributes });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
else start();
