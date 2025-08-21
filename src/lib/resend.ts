import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export interface EmailData {
  to: string;
  from: string;
  subject: string;
  html: string;
  text?: string;
}

export interface WelcomeEmailData {
  email: string;
  name?: string;
  company?: string;
}

export interface ConfirmationEmailData {
  email: string;
  confirmationLink: string;
  expiresIn?: string;
}

export interface NewsletterData {
  email: string;
  name?: string;
  source?: string;
}

// Email templates
export const emailTemplates = {
  welcome: (data: WelcomeEmailData) => ({
    subject: 'Welcome to SniperLink! 🎯',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to SniperLink</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 40px 20px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 Welcome to SniperLink!</h1>
              <p>Stop losing signups forever</p>
            </div>
            <div class="content">
              <h2>Hi ${data.name || 'there'}!</h2>
              <p>Welcome to SniperLink! We're excited to help you recover up to 61% of your lost signups with our intelligent email deep linking technology.</p>
              
              <h3>🚀 What you can do now:</h3>
              <ul>
                <li>Generate deep links to any email inbox</li>
                <li>Integrate SniperLink into your signup flow</li>
                <li>Track and recover lost conversions</li>
                <li>Customize the experience for your users</li>
              </ul>
              
              <p style="text-align: center; margin: 30px 0;">
                <a href="https://sniperlinks.email/demo" class="button">Try the Demo</a>
              </p>
              
              <h3>📚 Next Steps:</h3>
              <ol>
                <li>Check out our <a href="https://sniperlinks.email/docs">documentation</a></li>
                <li>Generate your first embed code</li>
                <li>Integrate into your application</li>
                <li>Start recovering lost signups!</li>
              </ol>
              
              <p>If you have any questions, just reply to this email. We're here to help!</p>
              
              <p>Best regards,<br>The SniperLink Team</p>
            </div>
            <div class="footer">
              <p>SniperLink - Recover lost signups instantly</p>
              <p><a href="https://sniperlinks.email">sniperlinks.email</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Welcome to SniperLink! 🎯

Hi ${data.name || 'there'}!

Welcome to SniperLink! We're excited to help you recover up to 61% of your lost signups with our intelligent email deep linking technology.

What you can do now:
- Generate deep links to any email inbox
- Integrate SniperLink into your signup flow
- Track and recover lost conversions
- Customize the experience for your users

Try the demo: https://sniperlinks.email/demo

Next Steps:
1. Check out our documentation: https://sniperlinks.email/docs
2. Generate your first embed code
3. Integrate into your application
4. Start recovering lost signups!

If you have any questions, just reply to this email. We're here to help!

Best regards,
The SniperLink Team

SniperLink - Recover lost signups instantly
https://sniperlinks.email
    `
  }),

  confirmation: (data: ConfirmationEmailData) => ({
    subject: 'Confirm your email address',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirm your email</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 40px 20px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 Confirm your email</h1>
              <p>SniperLink</p>
            </div>
            <div class="content">
              <h2>Almost there!</h2>
              <p>Please confirm your email address to complete your SniperLink setup.</p>
              
              <p style="text-align: center; margin: 30px 0;">
                <a href="${data.confirmationLink}" class="button">Confirm Email Address</a>
              </p>
              
              <p>This link will expire in ${data.expiresIn || '24 hours'}.</p>
              
              <p>If you didn't create a SniperLink account, you can safely ignore this email.</p>
              
              <p>Best regards,<br>The SniperLink Team</p>
            </div>
            <div class="footer">
              <p>SniperLink - Recover lost signups instantly</p>
              <p><a href="https://sniperlinks.email">sniperlinks.email</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Confirm your email address

Almost there!

Please confirm your email address to complete your SniperLink setup.

Confirm Email Address: ${data.confirmationLink}

This link will expire in ${data.expiresIn || '24 hours'}.

If you didn't create a SniperLink account, you can safely ignore this email.

Best regards,
The SniperLink Team

SniperLink - Recover lost signups instantly
https://sniperlinks.email
    `
  }),

  newsletter: (data: NewsletterData) => ({
    subject: 'Welcome to SniperLink Newsletter! 📧',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to SniperLink Newsletter</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 40px 20px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 Welcome to SniperLink!</h1>
              <p>You're now subscribed to our newsletter</p>
            </div>
            <div class="content">
              <h2>Hi ${data.name || 'there'}!</h2>
              <p>Thanks for subscribing to the SniperLink newsletter! You'll be the first to know about:</p>
              
              <ul>
                <li>🚀 New features and updates</li>
                <li>📊 Growth tips and best practices</li>
                <li>💡 Case studies and success stories</li>
                <li>🎯 Product announcements</li>
              </ul>
              
              <p style="text-align: center; margin: 30px 0;">
                <a href="https://sniperlinks.email/demo" class="button">Try SniperLink Now</a>
              </p>
              
              <p>We're excited to help you recover lost signups and grow your business!</p>
              
              <p>Best regards,<br>The SniperLink Team</p>
            </div>
            <div class="footer">
              <p>SniperLink - Recover lost signups instantly</p>
              <p><a href="https://sniperlinks.email">sniperlinks.email</a></p>
              <p><a href="https://sniperlinks.email/unsubscribe?email=${data.email}">Unsubscribe</a></p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
Welcome to SniperLink Newsletter! 📧

Hi ${data.name || 'there'}!

Thanks for subscribing to the SniperLink newsletter! You'll be the first to know about:

- 🚀 New features and updates
- 📊 Growth tips and best practices
- 💡 Case studies and success stories
- 🎯 Product announcements

Try SniperLink Now: https://sniperlinks.email/demo

We're excited to help you recover lost signups and grow your business!

Best regards,
The SniperLink Team

SniperLink - Recover lost signups instantly
https://sniperlinks.email

Unsubscribe: https://sniperlinks.email/unsubscribe?email=${data.email}
    `
  })
};

// Email service functions
export const emailService = {
  // Send welcome email
  async sendWelcomeEmail(data: WelcomeEmailData) {
    try {
      const template = emailTemplates.welcome(data);
      const result = await resend.emails.send({
        from: 'SniperLink <noreply@sniperlinks.email>',
        to: [data.email],
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
      
      console.log('Welcome email sent:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return { success: false, error };
    }
  },

  // Send confirmation email
  async sendConfirmationEmail(data: ConfirmationEmailData) {
    try {
      const template = emailTemplates.confirmation(data);
      const result = await resend.emails.send({
        from: 'SniperLink <noreply@sniperlinks.email>',
        to: [data.email],
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
      
      console.log('Confirmation email sent:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
      return { success: false, error };
    }
  },

  // Send newsletter subscription email
  async sendNewsletterEmail(data: NewsletterData) {
    try {
      const template = emailTemplates.newsletter(data);
      const result = await resend.emails.send({
        from: 'SniperLink <noreply@sniperlinks.email>',
        to: [data.email],
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
      
      console.log('Newsletter email sent:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('Failed to send newsletter email:', error);
      return { success: false, error };
    }
  },

  // Send custom email
  async sendCustomEmail(emailData: EmailData) {
    try {
      const result = await resend.emails.send({
        from: emailData.from,
        to: [emailData.to],
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
      });
      
      console.log('Custom email sent:', result);
      return { success: true, data: result };
    } catch (error) {
      console.error('Failed to send custom email:', error);
      return { success: false, error };
    }
  }
};

export default resend;
