import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Zap, 
  Target, 
  Users, 
  TrendingUp, 
  Shield, 
  Clock, 
  Globe, 
  Sun, 
  Moon, 
  Sparkles, 
  MessageSquare, 
  Mail,
  Copy,
  ExternalLink,
  Code,
  Settings,
  Palette,
  Smartphone,
  Monitor,
  BookOpen,
  FileText,
  Github,
  Mail as MailIcon,
  MessageCircle
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { generateSniperLink, detectESP, trackEvent } from "@/lib/sniper-link";
import { Link } from "react-router-dom";
import EmailTest from "@/components/EmailTest";

const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    trackEvent('theme_toggle', { theme: newTheme });
  };
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative rounded-xl h-10 w-10 hover:bg-secondary focus-ring"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
};

const CodeBlock = ({ children, language = "html" }: { children: string; language?: string }) => {
  const { toast } = useToast();
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(children);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
  };

  return (
    <div className="relative group">
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-8 w-8 p-0"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <pre className="relative bg-muted/50 border rounded-lg p-4 overflow-x-auto">
        <code className="text-sm font-mono">{children}</code>
      </pre>
    </div>
  );
};

const DocsPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleSniperTry = async () => {
    const domain = email.includes("@") ? email.split("@")[1].toLowerCase() : null;
    trackEvent("link_generate_attempt", { emailDomain: domain });

    if (!email.includes("@")) {
      trackEvent("link_generate_invalid_email");
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    const link = generateSniperLink(email);
    
    setTimeout(() => {
      setIsLoading(false);
      if (!link) {
        trackEvent("link_generate_unsupported_provider", { emailDomain: domain });
        toast({
          title: "Provider not supported",
          description: "This email provider is not yet supported",
          variant: "destructive",
        });
        return;
      }
      
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      
      toast({
        title: "Success!",
        description: "Link copied to clipboard and opening inbox",
      });
      
      trackEvent("link_generate_success", { emailDomain: domain });
      window.open(link, "_blank");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
              <Target className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              SniperLink
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/demo">Demo</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/embed-generator">Generator</Link>
            </Button>
            <Button variant="outline">
              Sign In
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main role="main" className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800">
              <BookOpen className="mr-2 h-4 w-4" />
              Documentation
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              SniperLink Documentation
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Learn how to integrate SniperLink into your application and recover lost signups instantly.
            </p>
          </div>

          {/* Table of Contents */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Table of Contents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="space-y-2">
                <a href="#overview" className="block text-muted-foreground hover:text-foreground transition-colors">
                  • Overview
                </a>
                <a href="#quick-start" className="block text-muted-foreground hover:text-foreground transition-colors">
                  • Quick Start
                </a>
                <a href="#basic-usage" className="block text-muted-foreground hover:text-foreground transition-colors">
                  • Basic Usage
                </a>
                <a href="#customization" className="block text-muted-foreground hover:text-foreground transition-colors">
                  • Customization
                </a>
                <a href="#api-reference" className="block text-muted-foreground hover:text-foreground transition-colors">
                  • API Reference
                </a>
                <a href="#advanced-usage" className="block text-muted-foreground hover:text-foreground transition-colors">
                  • Advanced Usage
                </a>
                <a href="#supported-providers" className="block text-muted-foreground hover:text-foreground transition-colors">
                  • Supported Providers
                </a>
                <a href="#support" className="block text-muted-foreground hover:text-foreground transition-colors">
                  • Support
                </a>
              </nav>
            </CardContent>
          </Card>

          {/* Overview Section */}
          <section id="overview" className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Overview</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    The Problem
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Every SaaS company loses 40-60% of potential customers in the email verification step. Users sign up, get redirected to a generic "check your email" page, and... nothing.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Lost Revenue: Hundreds of thousands in lost ARR</li>
                    <li>• Broken Attribution: Misattributed marketing ROI</li>
                    <li>• Leaky Funnels: Users never return to complete signup</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-green-600" />
                    The Solution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    SniperLink turns the passive "Check your inbox" message into an actionable call-to-action by generating direct inbox deep links.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Auto-detects email service provider</li>
                    <li>• Generates filtered inbox links</li>
                    <li>• Opens email client directly</li>
                    <li>• Recovers lost signups instantly</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Quick Start Section */}
          <section id="quick-start" className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Quick Start</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  5-Minute Setup
                </CardTitle>
                <CardDescription>
                  Get SniperLink running in your application in under 5 minutes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">1. Add the script to your HTML:</h4>
                  <CodeBlock language="html">
{`<script src="https://cdn.sniperlinks.com/sniperlink.min.js"></script>`}
                  </CodeBlock>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">2. Initialize with your sender domain:</h4>
                  <CodeBlock language="html">
{`<div id="sniper-link" data-sender="@yourdomain.com"></div>`}
                  </CodeBlock>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">3. That's it!</h4>
                  <p className="text-muted-foreground">
                    SniperLink will automatically detect the user's email provider and generate the appropriate deep link.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Basic Usage Section */}
          <section id="basic-usage" className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Basic Usage</h2>
            
            <div className="grid gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Simple Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CodeBlock language="html">
{`<sniper-link
  recipient="me@gmail.com"
  sender="justin@buttondown.email"
/>

<script src="https://sniperl.ink/v1/sniper-link.js" defer></script>`}
                  </CodeBlock>
                  
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2">Attributes:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li><code className="bg-background px-1 rounded">recipient</code>: The email address of the person expected to confirm their email.</li>
                      <li><code className="bg-background px-1 rounded">sender</code>: The email address from which the confirmation is sent.</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Advanced Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CodeBlock language="html">
{`<div 
  id="sniper-link" 
  data-sender="@yourdomain.com"
  data-button-text="Open Inbox Now"
  data-show-branding="true"
  data-button-style="default">
</div>`}
                  </CodeBlock>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Customization Section */}
          <section id="customization" className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Customization</h2>
            
            <div className="grid gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Custom Styling
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    The SniperLink button can be customized using CSS. There are four parts to the button:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground mb-4">
                    <li>• <code className="bg-background px-1 rounded">container</code>: A wrapper that holds the entire button</li>
                    <li>• <code className="bg-background px-1 rounded">button</code>: The clickable element</li>
                    <li>• <code className="bg-background px-1 rounded">image</code>: A logo representing the email provider</li>
                    <li>• <code className="bg-background px-1 rounded">text</code>: A label, by default showing "Open in {provider}"</li>
                  </ul>
                  
                  <CodeBlock language="css">
{`sniper-link::part(container) {
  width: 100%;
}

sniper-link::part(button) {
  background-color: darkorange;
  justify-content: center;
  border-radius: 99px;
}

sniper-link::part(image) {
  background-color: white;
  padding: 1px 3px;
  border-radius: 4px;
  box-shadow: 0 0 4px hsla(0, 0%, 0%, 0.1);
}

sniper-link::part(text) {
  color: white;
  text-shadow: 0 0 4px hsla(0, 0%, 0%, 0.2);
}`}
                  </CodeBlock>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Custom Label Text
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    The default text on the SniperLink button is "Open in {provider}", but you can change it using the <code className="bg-background px-1 rounded">template</code> attribute:
                  </p>
                  <CodeBlock language="html">
{`<sniper-link
  recipient="me@gmail.com"
  sender="justin@buttondown.email"
  template="Confirm email using {provider}"
></sniper-link>`}
                  </CodeBlock>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Button Styles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    SniperLink supports multiple button styles:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <code className="bg-background px-1 rounded">default</code>: Full-featured button with icon and text</li>
                    <li>• <code className="bg-background px-1 rounded">minimal</code>: Simple text-only button</li>
                    <li>• <code className="bg-background px-1 rounded">custom</code>: Fully customizable with your own CSS</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* API Reference Section */}
          <section id="api-reference" className="mb-16">
            <h2 className="text-3xl font-bold mb-6">API Reference</h2>
            
            <div className="grid gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Core Functions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">generateSniperLink(email, config)</h4>
                    <p className="text-muted-foreground mb-2">Generates a deep link for the given email address.</p>
                    <CodeBlock language="javascript">
{`import { generateSniperLink } from '@sniperlinks/core';

const link = generateSniperLink('user@gmail.com', {
  sender: '@yourdomain.com',
  showBranding: true,
  buttonText: 'Open Inbox Now'
});`}
                    </CodeBlock>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">detectESP(email)</h4>
                    <p className="text-muted-foreground mb-2">Detects the email service provider for the given email address.</p>
                    <CodeBlock language="javascript">
{`import { detectESP } from '@sniperlinks/core';

const esp = detectESP('user@gmail.com');
// Returns: { name: 'Gmail', domains: ['gmail.com'], ... }`}
                    </CodeBlock>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configuration Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Option</th>
                          <th className="text-left p-2">Type</th>
                          <th className="text-left p-2">Default</th>
                          <th className="text-left p-2">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-2 font-mono">sender</td>
                          <td className="p-2">string</td>
                          <td className="p-2">'@yourdomain.com'</td>
                          <td className="p-2">The sender email domain to search for</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-mono">showBranding</td>
                          <td className="p-2">boolean</td>
                          <td className="p-2">true</td>
                          <td className="p-2">Whether to show SniperLink branding</td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-2 font-mono">buttonText</td>
                          <td className="p-2">string</td>
                          <td className="p-2">'Open Inbox'</td>
                          <td className="p-2">Custom button text</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-mono">buttonStyle</td>
                          <td className="p-2">string</td>
                          <td className="p-2">'default'</td>
                          <td className="p-2">Button style variant</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Advanced Usage Section */}
          <section id="advanced-usage" className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Advanced Usage</h2>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Usage via the API
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  If you want to create your own custom button, you can directly depend on our API to construct it:
                </p>
                <CodeBlock language="bash">
{`GET https://sniperl.ink/v1/render?recipient={recipient}&sender={sender}`}
                </CodeBlock>
                
                <p className="text-muted-foreground mt-4 mb-4">
                  It's useful to do this API call from the frontend, because the endpoint also relies on the User-Agent to determine whether the device is desktop, iOS, or Android.
                </p>
                
                <p className="text-muted-foreground mb-4">Ideally, the response will look like this:</p>
                <CodeBlock language="json">
{`{
  "url": "https://...",
  "image": "https://sniperl.ink/logos/gmail.png",
  "provider_pretty": "Gmail"
}`}
                </CodeBlock>
                
                <p className="text-muted-foreground mt-4 mb-4">
                  If the provider cannot be recognized, you'll receive a <code className="bg-background px-1 rounded">404</code> error:
                </p>
                <CodeBlock language="json">
{`// Status: 404
{
  "code": "unknown_email_provider",
  "detail": "Unknown email provider for fake@example.com",
  "metadata": {
    "recipient": "fake@example.com"
  }
}`}
                </CodeBlock>
              </CardContent>
            </Card>
          </section>

          {/* Supported Providers Section */}
          <section id="supported-providers" className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Supported Providers</h2>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Service Providers
                </CardTitle>
                <CardDescription>
                  We're working on supporting as many providers as possible. Currently, we support:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Gmail</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Yahoo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Proton</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>iCloud</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Outlook</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>HEY</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>AOL</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Mail.ru</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    <strong>Need another provider?</strong> Let us know at support@sniperlinks.com if there's a provider you'd like us to add!
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Support Section */}
          <section id="support" className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Support</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MailIcon className="h-5 w-5" />
                    Get Help
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Email Support</h4>
                      <p className="text-muted-foreground text-sm">
                        For technical support and questions
                      </p>
                      <a href="mailto:support@sniperlinks.com" className="text-purple-600 hover:text-purple-700 text-sm">
                        support@sniperlinks.com
                      </a>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Community</h4>
                      <p className="text-muted-foreground text-sm">
                        Join our Discord community
                      </p>
                      <a href="https://discord.gg/sniperlinks" className="text-purple-600 hover:text-purple-700 text-sm">
                        discord.gg/sniperlinks
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Github className="h-5 w-5" />
                    Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">GitHub</h4>
                      <p className="text-muted-foreground text-sm">
                        Report issues and contribute
                      </p>
                      <a href="https://github.com/your-org/sniper-links/issues" className="text-purple-600 hover:text-purple-700 text-sm">
                        github.com/your-org/sniper-links
                      </a>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Documentation</h4>
                      <p className="text-muted-foreground text-sm">
                        Complete API documentation
                      </p>
                      <a href="https://docs.sniperlinks.com" className="text-purple-600 hover:text-purple-700 text-sm">
                        docs.sniperlinks.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Try It Section */}
          <section className="mb-16">
            <Card className="border-purple-200 bg-card/50 backdrop-blur-xl shadow-2xl dark:border-purple-800">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Try SniperLink</CardTitle>
                <CardDescription>
                  Test the functionality with your own email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1"
                    onKeyPress={(e) => e.key === "Enter" && handleSniperTry()}
                  />
                  <Button 
                    onClick={handleSniperTry}
                    disabled={isLoading || !email}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Target className="mr-2 h-4 w-4" />
                        Try It
                      </>
                    )}
                  </Button>
                </div>
                
                {copied && (
                  <div className="flex items-center justify-center gap-2 p-4 rounded-xl bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">Link copied and opened!</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Email Test Section */}
          <section className="mb-16">
            <EmailTest />
          </section>
        </div>
      </main>
    </div>
  );
};

export default DocsPage;
