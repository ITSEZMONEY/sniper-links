import { useState } from 'react';
import { emailService, WelcomeEmailData, ConfirmationEmailData, NewsletterData, EmailData } from '@/lib/resend';
import { useToast } from '@/hooks/use-toast';

export const useEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendWelcomeEmail = async (data: WelcomeEmailData) => {
    setIsLoading(true);
    try {
      const result = await emailService.sendWelcomeEmail(data);
      
      if (result.success) {
        toast({
          title: "Welcome email sent!",
          description: "Check your inbox for the welcome message.",
        });
        return result;
      } else {
        throw new Error('Failed to send welcome email');
      }
    } catch (error) {
      console.error('Error sending welcome email:', error);
      toast({
        title: "Failed to send email",
        description: "Please try again later.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const sendConfirmationEmail = async (data: ConfirmationEmailData) => {
    setIsLoading(true);
    try {
      const result = await emailService.sendConfirmationEmail(data);
      
      if (result.success) {
        toast({
          title: "Confirmation email sent!",
          description: "Please check your inbox and click the confirmation link.",
        });
        return result;
      } else {
        throw new Error('Failed to send confirmation email');
      }
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      toast({
        title: "Failed to send confirmation email",
        description: "Please try again later.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const sendNewsletterEmail = async (data: NewsletterData) => {
    setIsLoading(true);
    try {
      const result = await emailService.sendNewsletterEmail(data);
      
      if (result.success) {
        toast({
          title: "Newsletter subscription confirmed!",
          description: "Welcome to the SniperLink newsletter!",
        });
        return result;
      } else {
        throw new Error('Failed to send newsletter email');
      }
    } catch (error) {
      console.error('Error sending newsletter email:', error);
      toast({
        title: "Failed to subscribe to newsletter",
        description: "Please try again later.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const sendCustomEmail = async (data: EmailData) => {
    setIsLoading(true);
    try {
      const result = await emailService.sendCustomEmail(data);
      
      if (result.success) {
        toast({
          title: "Email sent successfully!",
          description: "Your message has been delivered.",
        });
        return result;
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending custom email:', error);
      toast({
        title: "Failed to send email",
        description: "Please try again later.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    sendWelcomeEmail,
    sendConfirmationEmail,
    sendNewsletterEmail,
    sendCustomEmail,
  };
};
