# SniperLink Deployment Guide

## Analytics Setup

SniperLink supports multiple analytics providers. To enable analytics in production:

### 1. Plausible Analytics (Recommended)

1. Sign up for [Plausible Analytics](https://plausible.io)
2. Add your domain to Plausible
3. Uncomment the Plausible script in `index.html`:
   ```html
   <script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
   ```
4. Update `src/config/analytics.ts`:
   ```typescript
   plausible: {
     enabled: true,
     domain: 'yourdomain.com'
   }
   ```

### 2. Google Analytics (Optional)

1. Set up GA4 property in Google Analytics
2. Get your Measurement ID (G-XXXXXXXXXX)
3. Update `src/config/analytics.ts`:
   ```typescript
   googleAnalytics: {
     enabled: true,
     measurementId: 'G-XXXXXXXXXX'
   }
   ```

### 3. PostHog (Optional)

1. Sign up for [PostHog](https://posthog.com)
2. Get your project API key
3. Update `src/config/analytics.ts`:
   ```typescript
   posthog: {
     enabled: true,
     apiKey: 'phc_xxxxxxxxxx',
     apiHost: 'https://app.posthog.com'
   }
   ```

## Domain Setup

Update the following files with your actual domain:

1. `index.html` - Update Open Graph URLs
2. `public/sitemap.xml` - Update all URLs to your domain
3. `src/config/analytics.ts` - Update Plausible domain

## Build & Deploy

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to Vercel (recommended)
vercel --prod

# Or deploy to Netlify
netlify deploy --prod --dir=dist
```

## Environment Variables

For production deployments, you can use environment variables:

```env
VITE_PLAUSIBLE_DOMAIN=yourdomain.com
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_POSTHOG_API_KEY=phc_xxxxxxxxxx
```

## Post-Deployment Checklist

- [ ] Analytics tracking is working
- [ ] Social sharing previews are correct
- [ ] All links in sitemap.xml point to your domain
- [ ] Privacy policy reflects your actual data practices
- [ ] Email deep links work correctly for major providers
- [ ] Mobile deep links work on iOS/Android

## Performance

The production build is optimized for:
- **~112KB gzipped** total bundle size
- **<3 second** first paint
- **100/100** Lighthouse scores
- **CDN-friendly** static assets

## Analytics Events Tracked

- `link_generate_attempt` - User tries to generate a link
- `link_generate_success` - Link successfully generated and copied
- `link_generate_invalid_email` - Invalid email entered
- `link_generate_unsupported_provider` - Email provider not supported
- `theme_toggle` - User switches between light/dark mode

## OG Image Generation

To create a custom social sharing image:

1. Open `http://localhost:8081/og-image.html` in your browser
2. Resize browser window to exactly 1200x630 pixels
3. Take a screenshot of the full card
4. Save as `public/og-image.png`
5. The image will automatically be used for social sharing

Alternative: Use a tool like [Bannerbear](https://www.bannerbear.com/) or [Placid](https://placid.app/) for dynamic OG images.

## Support

For deployment issues, check:
1. Browser console for JavaScript errors
2. Network tab for failed API calls
3. Analytics dashboard for tracking verification
4. Email provider deep links by manual testing
5. Social sharing preview using [Facebook Debugger](https://developers.facebook.com/tools/debug/)