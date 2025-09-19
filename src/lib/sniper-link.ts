export interface SniperLinkConfig {
  sender?: string;
  showBranding?: boolean;
  buttonText?: string;
  buttonStyle?: 'default' | 'minimal' | 'custom';
}

export interface ESPConfig {
  name: string;
  domains: string[];
  desktopUrl: string;
  mobileUrl?: string;
  searchParams: {
    from: string;
    newerThan: string;
    searchScope: string;
  };
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (command: string, event: string, properties?: Record<string, any>) => void;
  }
}

// ESP configurations for deep linking
const ESP_CONFIGS: ESPConfig[] = [
  {
    name: 'Gmail',
    domains: ['gmail.com', 'googlemail.com'],
    desktopUrl: 'https://mail.google.com/mail/u/0/#search/',
    mobileUrl: 'googlegmail://co?to=',
    searchParams: {
      from: 'from%3A',
      newerThan: 'newer_than%3A1d',
      searchScope: 'in%3Aanywhere'
    }
  },
  {
    name: 'Outlook',
    domains: ['outlook.com', 'live.com', 'hotmail.com', 'msn.com'],
    desktopUrl: 'https://outlook.live.com/mail/0/search/query/',
    mobileUrl: 'ms-outlook://search?query=',
    searchParams: {
      from: 'from:',
      newerThan: 'received:>=1d',
      searchScope: ''
    }
  },
  {
    name: 'Yahoo',
    domains: ['yahoo.com', 'yahoo.co.uk', 'yahoo.ca', 'yahoo.com.au', 'yahoo.fr', 'yahoo.de'],
    desktopUrl: 'https://mail.yahoo.com/d/search/keyword=',
    mobileUrl: 'ymail://mail/search?query=',
    searchParams: {
      from: 'from%3A',
      newerThan: 'after%3A1d',
      searchScope: ''
    }
  },
  {
    name: 'ProtonMail',
    domains: ['protonmail.com', 'proton.me', 'pm.me'],
    desktopUrl: 'https://mail.proton.me/u/0/all-mail#keyword=',
    mobileUrl: 'protonmail://search?query=',
    searchParams: {
      from: 'from:',
      newerThan: 'begin:1d',
      searchScope: ''
    }
  },
  {
    name: 'iCloud',
    domains: ['icloud.com', 'me.com', 'mac.com'],
    desktopUrl: 'https://www.icloud.com/mail/',
    mobileUrl: 'message://',
    searchParams: {
      from: '',
      newerThan: '',
      searchScope: ''
    }
  },
  {
    name: 'AOL',
    domains: ['aol.com', 'aim.com', 'verizon.net'],
    desktopUrl: 'https://mail.aol.com/webmail-std/en-us/suite#search=',
    mobileUrl: 'aol://mail/search?query=',
    searchParams: {
      from: 'from:',
      newerThan: 'after:1d',
      searchScope: ''
    }
  },
  {
    name: 'HEY',
    domains: ['hey.com'],
    desktopUrl: 'https://app.hey.com/search?q=',
    mobileUrl: 'hey://search?query=',
    searchParams: {
      from: 'from:',
      newerThan: 'after:1d',
      searchScope: ''
    }
  },
  {
    name: 'Mail.ru',
    domains: ['mail.ru', 'bk.ru', 'inbox.ru', 'list.ru'],
    desktopUrl: 'https://e.mail.ru/messages/search/',
    mobileUrl: 'mailru://search?query=',
    searchParams: {
      from: 'from:',
      newerThan: 'date:1d',
      searchScope: ''
    }
  }
];

export function detectESP(email: string): ESPConfig | null {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return null;
  
  return ESP_CONFIGS.find(esp => 
    esp.domains.some(espDomain => domain.includes(espDomain))
  ) || null;
}

export function generateSniperLink(email: string, config: SniperLinkConfig = {}): string | null {
  const esp = detectESP(email);
  if (!esp) return null;

  const sender = config.sender || '@yourdomain.com';
  const cleanSender = sender.startsWith('@') ? sender.slice(1) : sender;

  let url = esp.desktopUrl;

  // Build search parameters based on ESP
  switch (esp.name) {
    case 'Gmail':
      const gmailQuery = `${esp.searchParams.from}${encodeURIComponent(cleanSender)}+${esp.searchParams.searchScope}+${esp.searchParams.newerThan}`;
      url += gmailQuery;
      break;

    case 'Outlook':
      const outlookQuery = `${esp.searchParams.from}${cleanSender} ${esp.searchParams.newerThan}`;
      url += encodeURIComponent(outlookQuery);
      break;

    case 'Yahoo':
      const yahooQuery = `${esp.searchParams.from}${encodeURIComponent(cleanSender)} ${esp.searchParams.newerThan}`;
      url += yahooQuery;
      break;

    case 'ProtonMail':
      const protonQuery = `${esp.searchParams.from}${cleanSender} ${esp.searchParams.newerThan}`;
      url += encodeURIComponent(protonQuery);
      break;

    case 'AOL':
      const aolQuery = `${esp.searchParams.from}${cleanSender} ${esp.searchParams.newerThan}`;
      url += encodeURIComponent(aolQuery);
      break;

    case 'HEY':
      const heyQuery = `${esp.searchParams.from}${cleanSender} ${esp.searchParams.newerThan}`;
      url += encodeURIComponent(heyQuery);
      break;

    case 'Mail.ru':
      const mailruQuery = `${esp.searchParams.from}${cleanSender} ${esp.searchParams.newerThan}`;
      url += encodeURIComponent(mailruQuery);
      break;

    case 'iCloud':
      // iCloud doesn't support deep linking to specific emails, just open mail
      url = 'https://www.icloud.com/mail/';
      break;

    default:
      // Generic fallback
      url += encodeURIComponent(cleanSender);
  }

  return url;
}

export function generateMobileLink(email: string, config: SniperLinkConfig = {}): string | null {
  const esp = detectESP(email);
  if (!esp?.mobileUrl) return null;

  const sender = config.sender || '@yourdomain.com';
  const cleanSender = sender.startsWith('@') ? sender.slice(1) : sender;

  // Build mobile-specific search queries
  switch (esp.name) {
    case 'Gmail':
      return `${esp.mobileUrl}${encodeURIComponent(cleanSender)}`;

    case 'Outlook':
      return `${esp.mobileUrl}${encodeURIComponent(`from:${cleanSender}`)}`;

    case 'Yahoo':
      return `${esp.mobileUrl}${encodeURIComponent(`from:${cleanSender}`)}`;

    case 'ProtonMail':
      return `${esp.mobileUrl}${encodeURIComponent(`from:${cleanSender}`)}`;

    case 'AOL':
      return `${esp.mobileUrl}${encodeURIComponent(`from:${cleanSender}`)}`;

    case 'HEY':
      return `${esp.mobileUrl}${encodeURIComponent(`from:${cleanSender}`)}`;

    case 'Mail.ru':
      return `${esp.mobileUrl}${encodeURIComponent(`from:${cleanSender}`)}`;

    default:
      return `${esp.mobileUrl}${encodeURIComponent(cleanSender)}`;
  }
}

export function getFallbackInstructions(email: string, sender?: string): string {
  const esp = detectESP(email);
  const senderDomain = sender ? (sender.startsWith('@') ? sender.slice(1) : sender) : 'your app';

  if (!esp) {
    return `Please check your email inbox for the confirmation message from ${senderDomain}. Try searching for emails from this domain in your inbox, including spam/junk folders.`;
  }

  const instructions = {
    'Gmail': `Open Gmail and search for "from:${senderDomain}" - check your Inbox, Spam, and Promotions tabs.`,
    'Outlook': `Open Outlook and search for "from:${senderDomain}" - check your Inbox and Junk Email folder.`,
    'Yahoo': `Open Yahoo Mail and search for "from:${senderDomain}" - check your Inbox and Spam folder.`,
    'ProtonMail': `Open ProtonMail and search for "from:${senderDomain}" - check All Mail including Spam folder.`,
    'iCloud': `Open iCloud Mail and search for emails from ${senderDomain} - check all folders including Junk.`,
    'AOL': `Open AOL Mail and search for "from:${senderDomain}" - check your Inbox and Spam folder.`,
    'HEY': `Open HEY and search for "from:${senderDomain}" - check The Feed and Screener sections.`,
    'Mail.ru': `Open Mail.ru and search for "from:${senderDomain}" - check your Inbox and Spam folder.`
  };

  return instructions[esp.name as keyof typeof instructions] || instructions['Gmail'];
}

// Analytics tracking with multiple providers
export function trackEvent(event: string, properties?: Record<string, any>) {
  const trackingData = {
    event,
    timestamp: new Date().toISOString(),
    url: typeof window !== 'undefined' ? window.location.href : '',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    ...properties
  };

  // Google Analytics (gtag)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, {
      event_category: 'SniperLink',
      event_label: properties?.esp || properties?.emailDomain || 'unknown',
      value: properties?.linkType === 'mobile' ? 1 : 0,
      custom_parameters: properties
    });
  }

  // PostHog tracking
  if (typeof window !== 'undefined' && (window as any).posthog) {
    (window as any).posthog.capture(event, trackingData);
  }

  // Mixpanel tracking
  if (typeof window !== 'undefined' && (window as any).mixpanel) {
    (window as any).mixpanel.track(event, trackingData);
  }

  // Console logging for development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 SniperLink Analytics:', {
      event,
      properties: trackingData
    });
  }

  // Optional: Send to custom analytics endpoint
  if (typeof window !== 'undefined' && properties?.sendToAPI !== false) {
    sendAnalyticsBeacon(event, trackingData);
  }
}

// Send analytics beacon (non-blocking)
function sendAnalyticsBeacon(event: string, data: Record<string, any>) {
  try {
    // Use sendBeacon for non-blocking analytics
    if (navigator.sendBeacon) {
      const payload = JSON.stringify({
        event,
        data,
        source: 'sniperlink-widget'
      });

      // In production, this would go to your analytics endpoint
      // navigator.sendBeacon('https://api.sniperlinks.com/analytics', payload);
    }
  } catch (error) {
    console.warn('Analytics beacon failed:', error);
  }
}

// Enhanced analytics functions for specific events
export function trackWidgetLoad(config: SniperLinkConfig) {
  trackEvent('widget_load', {
    sender: config.sender?.replace(/[^@\w.-]/g, ''), // Sanitized sender
    buttonStyle: config.buttonStyle,
    showBranding: config.showBranding,
    loadTime: performance.now()
  });
}

export function trackLinkGeneration(email: string, esp: any, success: boolean, config: SniperLinkConfig) {
  trackEvent('link_generation', {
    emailDomain: email.split('@')[1]?.toLowerCase(),
    esp: esp?.name || 'unknown',
    success,
    sender: config.sender,
    buttonStyle: config.buttonStyle,
    mobileSupported: !!esp?.mobileUrl
  });
}

export function trackLinkClick(link: string, esp: string, linkType: 'desktop' | 'mobile' | 'fallback') {
  trackEvent('link_click', {
    esp,
    linkType,
    hasQuery: link.includes('?'),
    domain: new URL(link).hostname
  });
}

export function trackError(error: string, context?: Record<string, any>) {
  trackEvent('widget_error', {
    error: error.substring(0, 100), // Limit error message length
    context,
    userAgent: navigator.userAgent,
    timestamp: Date.now()
  });
}
