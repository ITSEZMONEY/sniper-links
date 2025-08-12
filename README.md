# SniperLink — Recover Up to 61% of Lost Signups Instantly

SniperLink is a lightweight, drop-in JavaScript widget that automates the generation of deep links to users' email inboxes, helping SaaS and product-led growth (PLG) teams recover lost signups by directing users straight to their confirmation emails—even if they're in spam or promotions folders.

## 🎯 Problem

Every SaaS company loses 40-60% of potential customers in the email verification step. Users sign up, get redirected to a generic "check your email" page, and... nothing. This creates:

- **Lost Revenue**: Hundreds of thousands in lost ARR
- **Broken Attribution**: Misattributed marketing ROI
- **Leaky Funnels**: Users never return to complete signup

## 💡 Solution

SniperLink turns the passive "Check your inbox" message into an actionable call-to-action (CTA) by:

1. **Auto-detecting** the user's email service provider (Gmail, Outlook, Yahoo, iCloud, ProtonMail)
2. **Generating** direct inbox deep links with targeted filters
3. **Opening** the user's email client directly to their confirmation email
4. **Recovering** lost signups instantly

## 🚀 Features

### Core Functionality
- ✅ **ESP Detection**: Automatically detects Gmail, Outlook, Yahoo, iCloud, ProtonMail
- ✅ **Deep Link Generation**: Creates filtered inbox links (from:sender, newer_than:1d, in:anywhere)
- ✅ **Mobile Support**: Works on desktop and mobile devices
- ✅ **Privacy First**: No data collection, pure client-side processing
- ✅ **5-Minute Setup**: Drop-in JavaScript snippet

### Technical Features
- ✅ **Lightweight**: 2-5KB minified script
- ✅ **No Backend Required**: Pure client-side implementation
- ✅ **Async Loading**: Non-blocking page performance
- ✅ **Fallback Handling**: Graceful UX for unsupported providers
- ✅ **Analytics Ready**: Built-in event tracking

## 📦 Installation

### Quick Start

1. **Add the script to your HTML:**
```html
<script src="https://cdn.sniperlinks.com/sniperlink.min.js"></script>
```

2. **Initialize with your sender domain:**
```html
<div id="sniper-link" data-sender="@yourdomain.com"></div>
```

3. **That's it!** SniperLink will automatically detect the user's email provider and generate the appropriate deep link.

### Advanced Configuration

```html
<div 
  id="sniper-link" 
  data-sender="@yourdomain.com"
  data-button-text="Open Inbox Now"
  data-show-branding="true"
  data-button-style="default">
</div>
```

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/your-org/sniper-links.git
cd sniper-links

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Project Structure
```
src/
├── components/ui/          # Reusable UI components
├── lib/
│   ├── sniper-link.ts     # Core SniperLink engine
│   └── utils.ts           # Utility functions
├── pages/                 # Page components
│   ├── HomePage.tsx       # Main landing page
│   ├── DemoPage.tsx       # Interactive demo
│   ├── EmbedGenerator.tsx # Embed code generator
│   └── NotFound.tsx       # 404 page
├── hooks/                 # Custom React hooks
└── main.tsx              # App entry point
```

## 🎨 Customization

### Button Styles
SniperLink supports multiple button styles:

- `default`: Full-featured button with icon and text
- `minimal`: Simple text-only button
- `custom`: Fully customizable with your own CSS

### Branding
- **Free Tier**: Includes "Powered by SniperLink" badge
- **Pro Tier**: Remove branding completely
- **Custom**: Add your own branding elements

## 📊 Analytics

SniperLink includes built-in analytics tracking:

```javascript
// Track link generation attempts
trackEvent('link_generate_attempt', { emailDomain: 'gmail.com' });

// Track successful generations
trackEvent('link_generate_success', { emailDomain: 'gmail.com' });

// Track unsupported providers
trackEvent('link_generate_unsupported_provider', { emailDomain: 'custom.com' });
```

## 🔧 API Reference

### Core Functions

#### `generateSniperLink(email, config)`
Generates a deep link for the given email address.

```javascript
import { generateSniperLink } from '@sniperlinks/core';

const link = generateSniperLink('user@gmail.com', {
  sender: '@yourdomain.com',
  showBranding: true,
  buttonText: 'Open Inbox Now'
});
```

#### `detectESP(email)`
Detects the email service provider for the given email address.

```javascript
import { detectESP } from '@sniperlinks/core';

const esp = detectESP('user@gmail.com');
// Returns: { name: 'Gmail', domains: ['gmail.com'], ... }
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `sender` | string | '@yourdomain.com' | The sender email domain to search for |
| `showBranding` | boolean | true | Whether to show SniperLink branding |
| `buttonText` | string | 'Open Inbox' | Custom button text |
| `buttonStyle` | string | 'default' | Button style variant |

## 🚀 Roadmap

### v1.1 (Q2 2024)
- [ ] Chrome Extension for email composition
- [ ] REST API endpoints
- [ ] Link analytics dashboard
- [ ] A/B testing support

### v1.2 (Q3 2024)
- [ ] Mobile app deep linking
- [ ] Custom domain support
- [ ] Webhook integrations
- [ ] Team collaboration features

### v2.0 (Q4 2024)
- [ ] Enterprise SSO
- [ ] Bulk API access
- [ ] White-label solutions
- [ ] Advanced analytics

## 💰 Pricing

| Plan | Price | Features |
|------|-------|----------|
| **Free** | $0/mo | 1 domain, SniperLink badge, basic ESPs |
| **Pro** | $9/mo | Custom domain, no branding, basic analytics |
| **Team** | $49/mo | Multi-user dashboard, A/B testing, priority support |
| **Enterprise** | Contact | API access, webhooks, SSO, SLAs |

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
```bash
# Fork and clone the repository
git clone https://github.com/your-username/sniper-links.git

# Install dependencies
npm install

# Run tests
npm test

# Start development server
npm run dev
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.sniperlinks.com](https://docs.sniperlinks.com)
- **Issues**: [GitHub Issues](https://github.com/your-org/sniper-links/issues)
- **Email**: support@sniperlinks.com
- **Discord**: [Join our community](https://discord.gg/sniperlinks)

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

---

**Made with ❤️ by the SniperLink Team**

*Stop losing signups forever.*
