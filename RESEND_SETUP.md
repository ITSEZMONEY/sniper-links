# Resend Email Setup Guide

This guide will help you set up Resend for sending emails in your SniperLink application.

## 1. Create a Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

## 2. Get Your API Key

1. In your Resend dashboard, go to the "API Keys" section
2. Create a new API key
3. Copy the API key (it starts with `re_`)

## 3. Configure Environment Variables

1. Create a `.env` file in your project root (if it doesn't exist)
2. Add your Resend API key:

```env
VITE_RESEND_API_KEY=re_your_api_key_here
```

## 4. Verify Your Domain (Optional but Recommended)

For production use, you should verify your domain:

1. In Resend dashboard, go to "Domains"
2. Add your domain (e.g., `sniperlinks.email`)
3. Follow the DNS verification steps
4. Update the `from` email in `src/lib/resend.ts` to use your verified domain

## 5. Test the Setup

1. Start your development server: `npm run dev`
2. Go to the homepage and try the newsletter signup
3. Check your email for the welcome message

## Email Templates Included

The setup includes these email templates:

- **Welcome Email**: Sent when users sign up
- **Confirmation Email**: For email verification
- **Newsletter Email**: For newsletter subscriptions
- **Custom Email**: For any custom email needs

## Usage Examples

### Send Welcome Email
```typescript
import { useEmail } from '@/hooks/use-email';

const { sendWelcomeEmail } = useEmail();

await sendWelcomeEmail({
  email: 'user@example.com',
  name: 'John Doe',
  company: 'Acme Corp'
});
```

### Send Newsletter Email
```typescript
import { useEmail } from '@/hooks/use-email';

const { sendNewsletterEmail } = useEmail();

await sendNewsletterEmail({
  email: 'user@example.com',
  name: 'John Doe',
  source: 'website_signup'
});
```

## Troubleshooting

### Common Issues

1. **API Key Not Found**: Make sure your `.env` file is in the project root and contains the correct API key
2. **Domain Not Verified**: For production, verify your domain in Resend dashboard
3. **Rate Limits**: Free tier has limits. Check your usage in the dashboard

### Error Handling

The email service includes error handling and will show toast notifications for success/failure.

## Next Steps

- Set up analytics tracking (GA4, GTM, Mixpanel, PostHog)
- Configure Intercom for live chat
- Set up Stripe for payments
- Configure Gmail OAuth

## Support

If you need help with Resend setup:
- [Resend Documentation](https://resend.com/docs)
- [Resend Support](https://resend.com/support)
