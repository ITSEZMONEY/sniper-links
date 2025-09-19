import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Target,
  CheckCircle,
  AlertTriangle,
  Zap,
  Smartphone,
  Monitor,
  Globe,
  Mail,
  ExternalLink,
  RefreshCw,
  Play,
  Eye
} from 'lucide-react';
import {
  generateSniperLink,
  generateMobileLink,
  detectESP,
  getFallbackInstructions,
  trackEvent
} from '@/lib/sniper-link';

interface TestResult {
  email: string;
  esp: any;
  desktopLink: string | null;
  mobileLink: string | null;
  fallbackInstructions: string;
  timestamp: number;
}

const DemoPage = () => {
  const [email, setEmail] = useState('user@gmail.com');
  const [sender, setSender] = useState('@yourdomain.com');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    trackEvent('demo_page_visit');
  }, []);

  const runTest = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    trackEvent('demo_test_run', {
      emailDomain: email.split('@')[1]?.toLowerCase(),
      sender: sender
    });

    // Simulate some processing time for better UX
    setTimeout(() => {
      const esp = detectESP(email);
      const desktopLink = generateSniperLink(email, { sender });
      const mobileLink = generateMobileLink(email, { sender });
      const fallbackInstructions = getFallbackInstructions(email, sender);

      const testResult: TestResult = {
        email,
        esp,
        desktopLink,
        mobileLink,
        fallbackInstructions,
        timestamp: Date.now()
      };

      setResult(testResult);
      setTestHistory(prev => [testResult, ...prev.slice(0, 4)]); // Keep last 5 results
      setIsLoading(false);

      if (esp) {
        toast({
          title: "Test successful!",
          description: `Generated ${esp.name} links successfully`,
        });
      } else {
        toast({
          title: "ESP not supported",
          description: "Fallback instructions generated",
          variant: "destructive"
        });
      }
    }, 800);
  };

  const openLink = (link: string, type: 'desktop' | 'mobile') => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
      trackEvent('demo_link_open', {
        linkType: type,
        esp: result?.esp?.name
      });
    }
  };

  const presetEmails = [
    { email: 'user@gmail.com', label: 'Gmail' },
    { email: 'user@outlook.com', label: 'Outlook' },
    { email: 'user@yahoo.com', label: 'Yahoo' },
    { email: 'user@proton.me', label: 'ProtonMail' },
    { email: 'user@icloud.com', label: 'iCloud' },
    { email: 'user@hey.com', label: 'HEY' },
    { email: 'user@aol.com', label: 'AOL' },
    { email: 'user@mail.ru', label: 'Mail.ru' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <div className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
              <Target className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Interactive Demo
            </span>
          </div>
          <Badge className="bg-blue-100 text-blue-700 border-blue-300">
            <Eye className="mr-1 h-3 w-3" />
            Live Testing
          </Badge>
        </div>
      </nav>

      <main className="container mx-auto py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">Test SniperLink Live</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enter any email address to see how SniperLink generates deep links to inboxes.
              Test with different email providers to see the magic in action.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Input Section */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Test Configuration
                  </CardTitle>
                  <CardDescription>
                    Configure your test parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2">
                      User Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && runTest()}
                    />
                  </div>

                  <div>
                    <label htmlFor="sender" className="block text-sm font-medium mb-2">
                      Sender Domain
                    </label>
                    <Input
                      id="sender"
                      type="text"
                      placeholder="@yourdomain.com"
                      value={sender}
                      onChange={(e) => setSender(e.target.value)}
                    />
                  </div>

                  <Button
                    onClick={runTest}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Run Test
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Test Presets */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Tests</CardTitle>
                  <CardDescription>
                    Try different email providers instantly
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {presetEmails.map((preset) => (
                      <Button
                        key={preset.email}
                        variant="outline"
                        size="sm"
                        onClick={() => setEmail(preset.email)}
                        className="text-xs"
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-2 space-y-6">
              {result ? (
                <>
                  {/* ESP Detection Result */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {result.esp ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-yellow-600" />
                        )}
                        ESP Detection Result
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {result.esp ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Email Provider:</span>
                            <Badge className="bg-green-100 text-green-700 border-green-300">
                              {result.esp.name}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Supported Domains:</span>
                            <span className="text-sm text-muted-foreground">
                              {result.esp.domains.join(', ')}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Mobile Support:</span>
                            <Badge variant={result.esp.mobileUrl ? 'default' : 'secondary'}>
                              {result.esp.mobileUrl ? 'Yes' : 'No'}
                            </Badge>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                          <h3 className="font-semibold text-yellow-700 mb-2">
                            Email Provider Not Supported
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            This email provider is not in our database yet. Fallback instructions will be shown.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Generated Links */}
                  {result.esp && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ExternalLink className="h-5 w-5" />
                          Generated Links
                        </CardTitle>
                        <CardDescription>
                          Click to test the generated deep links
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Desktop Link */}
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Monitor className="h-5 w-5 text-blue-600" />
                            <div>
                              <div className="font-medium">Desktop Link</div>
                              <div className="text-sm text-muted-foreground">
                                Opens {result.esp.name} in web browser
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => openLink(result.desktopLink!, 'desktop')}
                            disabled={!result.desktopLink}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Test
                          </Button>
                        </div>

                        {/* Mobile Link */}
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Smartphone className="h-5 w-5 text-green-600" />
                            <div>
                              <div className="font-medium">Mobile Link</div>
                              <div className="text-sm text-muted-foreground">
                                {result.mobileLink
                                  ? `Opens ${result.esp.name} mobile app`
                                  : 'Mobile link not available'
                                }
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant={result.mobileLink ? 'default' : 'secondary'}
                            onClick={() => result.mobileLink && openLink(result.mobileLink, 'mobile')}
                            disabled={!result.mobileLink}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Test
                          </Button>
                        </div>

                        {/* Link Preview */}
                        <div className="bg-gray-50 dark:bg-gray-900/20 rounded-lg p-4">
                          <div className="text-sm font-medium mb-2">Generated Search URL:</div>
                          <code className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded block break-all">
                            {result.desktopLink}
                          </code>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Fallback Instructions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Fallback Instructions
                      </CardTitle>
                      <CardDescription>
                        Manual instructions shown when deep links fail
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          {result.fallbackInstructions}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                </>
              ) : (
                /* Empty State */
                <Card className="lg:col-span-2">
                  <CardContent className="text-center py-12">
                    <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Ready to Test</h3>
                    <p className="text-muted-foreground mb-6">
                      Enter an email address and click "Run Test" to see SniperLink in action
                    </p>
                    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        8 ESP Providers
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Instant Generation
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Mobile Support
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Test History */}
              {testHistory.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Tests</CardTitle>
                    <CardDescription>
                      Your last few test results
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {testHistory.map((test, index) => (
                        <div
                          key={test.timestamp}
                          className="flex items-center justify-between p-3 border rounded-lg text-sm"
                        >
                          <div className="flex items-center gap-3">
                            <Badge variant={test.esp ? 'default' : 'secondary'} className="text-xs">
                              {test.esp ? test.esp.name : 'Unknown'}
                            </Badge>
                            <span className="font-mono">{test.email}</span>
                          </div>
                          <div className="text-muted-foreground">
                            {new Date(test.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12 pt-8 border-t">
            <h2 className="text-2xl font-bold mb-4">Ready to Implement?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Impressed by the demo? Generate your custom embed code and start recovering lost signups in under 5 minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Link to="/embed-generator">
                  Generate Embed Code
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DemoPage;
