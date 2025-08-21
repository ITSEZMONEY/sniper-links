import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Sparkles, CheckCircle } from 'lucide-react';
import { useEmail } from '@/hooks/use-email';

interface NewsletterSignupProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  className?: string;
  showBadge?: boolean;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({
  title = "Stay Updated",
  description = "Get the latest updates on SniperLink features and growth tips.",
  placeholder = "Enter your email address",
  buttonText = "Subscribe",
  className = "",
  showBadge = true,
}) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { sendNewsletterEmail, isLoading } = useEmail();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      return;
    }

    const result = await sendNewsletterEmail({
      email,
      name: name || undefined,
      source: 'newsletter_signup',
    });

    if (result?.success) {
      setIsSubscribed(true);
      setEmail("");
      setName("");
    }
  };

  if (isSubscribed) {
    return (
      <Card className={`border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20 ${className}`}>
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
            Welcome to SniperLink!
          </h3>
          <p className="text-green-700 dark:text-green-300">
            You've been subscribed to our newsletter. Check your inbox for a welcome message!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-purple-200 bg-card/50 backdrop-blur-xl shadow-2xl dark:border-purple-800 ${className}`}>
      <CardHeader className="text-center">
        {showBadge && (
          <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800 w-fit mx-auto">
            <Sparkles className="mr-2 h-4 w-4" />
            Newsletter
          </Badge>
        )}
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
            <Input
              type="email"
              placeholder={placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              required
            />
          </div>
          <Button 
            type="submit"
            disabled={isLoading || !email}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Subscribing...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                {buttonText}
              </>
            )}
          </Button>
        </form>
        
        <p className="text-xs text-muted-foreground mt-4 text-center">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </CardContent>
    </Card>
  );
};

export default NewsletterSignup;
