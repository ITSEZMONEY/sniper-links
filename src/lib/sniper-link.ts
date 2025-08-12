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
    desktopUrl: 'https://outlook.live.com/mail/0/inbox/search/id/',
    mobileUrl: 'ms-outlook://mail/search/',
    searchParams: {
      from: '',
      newerThan: '',
      searchScope: ''
    }
  },
  {
    name: 'Yahoo',
    domains: ['yahoo.com', 'yahoo.co.uk', 'yahoo.ca', 'yahoo.com.au'],
    desktopUrl: 'https://mail.yahoo.com/d/search/keyword=',
    mobileUrl: 'ymail://mail/search/',
    searchParams: {
      from: 'from%253A',
      newerThan: '',
      searchScope: ''
    }
  },
  {
    name: 'ProtonMail',
    domains: ['protonmail.com', 'proton.me'],
    desktopUrl: 'https://mail.proton.me/u/0/all-mail#',
    mobileUrl: 'protonmail://mail/search/',
    searchParams: {
      from: 'from=',
      newerThan: '',
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
  const encodedSender = encodeURIComponent(sender);
  
  let url = esp.desktopUrl;
  
  // Build search parameters based on ESP
  if (esp.name === 'Gmail') {
    url += `${esp.searchParams.from}${encodedSender}+${esp.searchParams.searchScope}+${esp.searchParams.newerThan}`;
  } else if (esp.name === 'Outlook') {
    url += encodedSender;
  } else if (esp.name === 'Yahoo') {
    url += `${esp.searchParams.from}${encodedSender}`;
  } else if (esp.name === 'ProtonMail') {
    url += `${esp.searchParams.from}${encodedSender}`;
  } else if (esp.name === 'iCloud') {
    // iCloud doesn't support deep linking to specific emails
    url = 'https://www.icloud.com/mail/';
  }
  
  return url;
}

export function generateMobileLink(email: string, config: SniperLinkConfig = {}): string | null {
  const esp = detectESP(email);
  if (!esp?.mobileUrl) return null;
  
  const sender = config.sender || '@yourdomain.com';
  const encodedSender = encodeURIComponent(sender);
  
  return `${esp.mobileUrl}${encodedSender}`;
}

export function getFallbackInstructions(email: string): string {
  const esp = detectESP(email);
  if (!esp) {
    return `Please check your email inbox for the confirmation message. You can search for emails from your app's domain.`;
  }
  
  const instructions = {
    'Gmail': 'Check your Gmail inbox, including the Spam and Promotions folders. Search for emails from your app.',
    'Outlook': 'Check your Outlook inbox, including the Junk folder. Search for emails from your app.',
    'Yahoo': 'Check your Yahoo Mail inbox, including the Spam folder. Search for emails from your app.',
    'ProtonMail': 'Check your ProtonMail inbox, including the Spam folder. Search for emails from your app.',
    'iCloud': 'Check your iCloud Mail inbox. Search for emails from your app.'
  };
  
  return instructions[esp.name as keyof typeof instructions] || instructions['Gmail'];
}

// Analytics tracking
export function trackEvent(event: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, properties);
  }
  
  // Fallback to console for development
  if (process.env.NODE_ENV === 'development') {
    console.log('SniperLink Event:', event, properties);
  }
}
