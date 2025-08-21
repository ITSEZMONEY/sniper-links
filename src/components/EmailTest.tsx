import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, TestTube, CheckCircle } from 'lucide-react';
import { useEmail } from '@/hooks/use-email';

export const EmailTest: React.FC = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [testType, setTestType] = useState<'welcome' | 'newsletter'>('welcome');
  const [isTested, setIsTested] = useState(false);
  const { sendWelcomeEmail, sendNewsletterEmail, isLoading } = useEmail();

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      return;
    }

    let result;
    if (testType === 'welcome') {
      result = await sendWelcomeEmail({
        email,
        name: name || undefined,
        company: 'Test Company',
      });
    } else {
      result = await sendNewsletterEmail({
        email,
        name: name || undefined,
        source: 'test_component',
      });
    }

    if (result?.success) {
      setIsTested(true);
      setTimeout(() => setIsTested(false), 5000);
    }
  };

  if (isTested) {
    return (
      <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
        <CardContent className="p-6 text-center">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
            Email Sent Successfully!
          </h3>
          <p className="text-green-700 dark:text-green-300">
            Check your inbox for the test email.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
      <CardHeader className="text-center">
        <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 w-fit mx-auto">
          <TestTube className="mr-2 h-4 w-4" />
          Email Test
        </Badge>
        <CardTitle className="text-xl">Test Email Functionality</CardTitle>
        <CardDescription>
          Test the Resend email integration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleTest} className="space-y-4">
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
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              required
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              type="button"
              variant={testType === 'welcome' ? 'default' : 'outline'}
              onClick={() => setTestType('welcome')}
              className="flex-1"
            >
              Welcome Email
            </Button>
            <Button
              type="button"
              variant={testType === 'newsletter' ? 'default' : 'outline'}
              onClick={() => setTestType('newsletter')}
              className="flex-1"
            >
              Newsletter Email
            </Button>
          </div>
          
          <Button 
            type="submit"
            disabled={isLoading || !email}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Send Test Email
              </>
            )}
          </Button>
        </form>
        
        <p className="text-xs text-muted-foreground mt-4 text-center">
          This will send a real email to test the Resend integration.
        </p>
      </CardContent>
    </Card>
  );
};

export default EmailTest;
