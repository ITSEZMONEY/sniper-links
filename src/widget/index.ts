/**
 * SniperLink Widget - Standalone Embeddable Script
 * Generates deep links to email inboxes to recover lost signups
 */

// Import core functionality
import {
  detectESP,
  generateSniperLink,
  generateMobileLink,
  getFallbackInstructions,
  trackEvent,
  SniperLinkConfig,
  ESPConfig
} from '../lib/sniper-link';

// Widget configuration interface
interface WidgetConfig extends SniperLinkConfig {
  containerId?: string;
  email?: string;
  buttonStyle?: 'default' | 'minimal' | 'custom';
  buttonColor?: string;
  buttonText?: string;
  showBranding?: boolean;
  debug?: boolean;
  onLinkGenerate?: (link: string, esp: string) => void;
  onError?: (error: string) => void;
}

class SniperLinkWidget {
  private config: WidgetConfig;
  private container: HTMLElement | null = null;
  private isInitialized: boolean = false;

  constructor(config: WidgetConfig) {
    this.config = {
      buttonText: 'Open Inbox',
      buttonStyle: 'default',
      showBranding: true,
      debug: false,
      ...config
    };
  }

  init(): void {
    if (this.isInitialized) {
      console.warn('SniperLink widget already initialized');
      return;
    }

    // Find container element
    const containerId = this.config.containerId || 'sniperlink-widget';
    this.container = document.getElementById(containerId);

    if (!this.container) {
      const error = `Container element with ID "${containerId}" not found`;
      this.handleError(error);
      return;
    }

    this.render();
    this.isInitialized = true;

    if (this.config.debug) {
      console.log('SniperLink widget initialized:', this.config);
    }

    // Track widget initialization
    trackEvent('widget_initialize', {
      buttonStyle: this.config.buttonStyle,
      showBranding: this.config.showBranding
    });
  }

  private render(): void {
    if (!this.container) return;

    const email = this.config.email || this.extractEmailFromForm();

    if (!email) {
      this.renderEmailInput();
      return;
    }

    const esp = detectESP(email);

    if (!esp) {
      this.renderFallback(email);
      return;
    }

    this.renderSniperButton(email, esp);
  }

  private extractEmailFromForm(): string | null {
    // Try to extract email from common form fields
    const emailInputs = [
      '#email',
      'input[name="email"]',
      'input[type="email"]',
      '[data-email]'
    ];

    for (const selector of emailInputs) {
      const input = document.querySelector(selector) as HTMLInputElement;
      if (input && input.value) {
        return input.value.trim();
      }
    }

    return null;
  }

  private renderEmailInput(): void {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="sniperlink-email-input">
        <input
          type="email"
          id="sniperlink-email"
          placeholder="Enter your email address"
          class="sniperlink-input"
        />
        <button
          id="sniperlink-submit"
          class="sniperlink-button sniperlink-button-${this.config.buttonStyle}"
        >
          Generate Link
        </button>
      </div>
      ${this.config.showBranding ? this.getBrandingHTML() : ''}
    `;

    // Add event listeners
    const submitBtn = this.container.querySelector('#sniperlink-submit') as HTMLButtonElement;
    const emailInput = this.container.querySelector('#sniperlink-email') as HTMLInputElement;

    submitBtn?.addEventListener('click', () => {
      const email = emailInput.value.trim();
      if (email) {
        this.config.email = email;
        this.render();
      }
    });

    emailInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        submitBtn?.click();
      }
    });

    this.applyStyles();
  }

  private renderSniperButton(email: string, esp: ESPConfig): void {
    if (!this.container) return;

    const isMobile = this.isMobileDevice();
    const link = isMobile
      ? generateMobileLink(email, this.config) || generateSniperLink(email, this.config)
      : generateSniperLink(email, this.config);

    if (!link) {
      this.renderFallback(email);
      return;
    }

    const buttonText = this.config.buttonText || `Open ${esp.name}`;

    this.container.innerHTML = `
      <div class="sniperlink-container">
        <button
          id="sniperlink-button"
          class="sniperlink-button sniperlink-button-${this.config.buttonStyle}"
          data-link="${link}"
          data-esp="${esp.name}"
        >
          <span class="sniperlink-icon">📧</span>
          ${buttonText}
        </button>
        <div class="sniperlink-info">
          <small>Opens ${esp.name} to find your confirmation email</small>
        </div>
        ${this.config.showBranding ? this.getBrandingHTML() : ''}
      </div>
    `;

    // Add click event listener
    const button = this.container.querySelector('#sniperlink-button') as HTMLButtonElement;
    button?.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleLinkClick(link, esp.name);
    });

    this.applyStyles();
  }

  private renderFallback(email: string): void {
    if (!this.container) return;

    const instructions = getFallbackInstructions(email, this.config.sender);

    this.container.innerHTML = `
      <div class="sniperlink-fallback">
        <div class="sniperlink-fallback-icon">⚠️</div>
        <h4>Manual Instructions</h4>
        <p>${instructions}</p>
        ${this.config.showBranding ? this.getBrandingHTML() : ''}
      </div>
    `;

    this.applyStyles();

    trackEvent('widget_fallback_shown', {
      emailDomain: email.split('@')[1]?.toLowerCase()
    });
  }

  private handleLinkClick(link: string, espName: string): void {
    try {
      // Track the click
      trackEvent('widget_link_click', {
        esp: espName,
        sender: this.config.sender
      });

      // Call custom handler if provided
      if (this.config.onLinkGenerate) {
        this.config.onLinkGenerate(link, espName);
      }

      // Open the link
      window.open(link, '_blank', 'noopener,noreferrer');

      if (this.config.debug) {
        console.log('SniperLink opened:', { link, esp: espName });
      }

    } catch (error) {
      const errorMsg = 'Failed to open inbox link';
      this.handleError(errorMsg);
      console.error('SniperLink error:', error);
    }
  }

  private handleError(error: string): void {
    if (this.config.onError) {
      this.config.onError(error);
    } else {
      console.error('SniperLink Error:', error);
    }

    trackEvent('widget_error', {
      error: error,
      config: this.config
    });
  }

  private isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }

  private getBrandingHTML(): string {
    return `
      <div class="sniperlink-branding">
        <a href="https://sniperlinks.com" target="_blank" rel="noopener">
          Powered by SniperLink
        </a>
      </div>
    `;
  }

  private applyStyles(): void {
    // Check if styles already exist
    if (document.getElementById('sniperlink-styles')) {
      return;
    }

    const styleSheet = document.createElement('style');
    styleSheet.id = 'sniperlink-styles';
    styleSheet.textContent = `
      .sniperlink-container {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        max-width: 320px;
        margin: 0 auto;
        text-align: center;
      }

      .sniperlink-button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%);
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        text-decoration: none;
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
      }

      .sniperlink-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4);
      }

      .sniperlink-button:active {
        transform: translateY(0);
      }

      .sniperlink-button-minimal {
        background: #6366F1;
        padding: 8px 16px;
        font-size: 14px;
        box-shadow: none;
      }

      .sniperlink-button-custom {
        background: ${this.config.buttonColor || '#6366F1'};
      }

      .sniperlink-icon {
        font-size: 18px;
      }

      .sniperlink-info {
        margin-top: 8px;
        color: #6B7280;
        font-size: 13px;
      }

      .sniperlink-branding {
        margin-top: 12px;
        text-align: center;
      }

      .sniperlink-branding a {
        color: #9CA3AF;
        text-decoration: none;
        font-size: 12px;
      }

      .sniperlink-branding a:hover {
        color: #6B7280;
      }

      .sniperlink-email-input {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
        flex-wrap: wrap;
      }

      .sniperlink-input {
        flex: 1;
        min-width: 200px;
        padding: 12px;
        border: 2px solid #E5E7EB;
        border-radius: 8px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s ease;
      }

      .sniperlink-input:focus {
        border-color: #8B5CF6;
        box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
      }

      .sniperlink-fallback {
        text-align: center;
        padding: 20px;
        background: #FEF3C7;
        border-radius: 8px;
        border: 1px solid #F59E0B;
      }

      .sniperlink-fallback-icon {
        font-size: 24px;
        margin-bottom: 12px;
      }

      .sniperlink-fallback h4 {
        margin: 0 0 12px 0;
        color: #92400E;
        font-size: 16px;
      }

      .sniperlink-fallback p {
        margin: 0;
        color: #78350F;
        font-size: 14px;
        line-height: 1.5;
      }

      @media (max-width: 480px) {
        .sniperlink-email-input {
          flex-direction: column;
        }

        .sniperlink-input {
          min-width: auto;
        }
      }
    `;

    document.head.appendChild(styleSheet);
  }

  // Public methods for programmatic control
  updateConfig(newConfig: Partial<WidgetConfig>): void {
    this.config = { ...this.config, ...newConfig };
    if (this.isInitialized) {
      this.render();
    }
  }

  setEmail(email: string): void {
    this.config.email = email;
    if (this.isInitialized) {
      this.render();
    }
  }

  destroy(): void {
    if (this.container) {
      this.container.innerHTML = '';
    }

    // Remove styles
    const styleSheet = document.getElementById('sniperlink-styles');
    styleSheet?.remove();

    this.isInitialized = false;
  }
}

// Global API
declare global {
  interface Window {
    SniperLink: {
      Widget: typeof SniperLinkWidget;
      create: (config: WidgetConfig) => SniperLinkWidget;
      generateLink: typeof generateSniperLink;
      detectESP: typeof detectESP;
    };
  }
}

// Auto-initialization for data attributes
function autoInit() {
  document.querySelectorAll('[data-sniperlink]').forEach((element) => {
    const config: WidgetConfig = {
      containerId: element.id,
      sender: element.getAttribute('data-sender') || undefined,
      email: element.getAttribute('data-email') || undefined,
      buttonText: element.getAttribute('data-button-text') || undefined,
      buttonStyle: (element.getAttribute('data-button-style') as any) || 'default',
      buttonColor: element.getAttribute('data-button-color') || undefined,
      showBranding: element.getAttribute('data-show-branding') !== 'false'
    };

    const widget = new SniperLinkWidget(config);
    widget.init();
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoInit);
} else {
  autoInit();
}

// Expose global API
window.SniperLink = {
  Widget: SniperLinkWidget,
  create: (config: WidgetConfig) => new SniperLinkWidget(config),
  generateLink: generateSniperLink,
  detectESP: detectESP
};

export { SniperLinkWidget, type WidgetConfig };