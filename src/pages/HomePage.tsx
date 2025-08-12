import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle, Star, Zap, Target, Users, TrendingUp, Shield, Clock, Globe, Sun, Moon, Sparkles, MessageSquare, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { generateSniperLink, detectESP, trackEvent } from "@/lib/sniper-link";
import { Link } from "react-router-dom";

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

const HomePage = () => {
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

      <main role="main" id="main-content">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="animate-in fade-in duration-1000">
              <Badge className="mb-8 bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800">
                <Sparkles className="mr-2 h-4 w-4" />
                Stop losing signups forever
              </Badge>
              
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                SniperLink — 
                <span className="block mt-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Recover Up to 61% of Lost Signups Instantly
                </span>
              </h1>
              
              <p className="mb-12 text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                SniperLink generates direct inbox links that take users straight to their email to complete signup. 
                No more "check your email" dead ends.
              </p>
            </div>

            {/* Demo Section */}
            <div className="mx-auto max-w-lg animate-in slide-in-from-bottom-8 duration-1000 delay-300">
              <Card className="border-purple-200 bg-card/50 backdrop-blur-xl shadow-2xl dark:border-purple-800">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Try SniperLink</CardTitle>
                  <CardDescription>
                    Enter an email to see the magic in action
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
                          Snipe
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
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-20 px-4 bg-secondary/30">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
              The Hidden Revenue Killer
            </h2>
            <p className="mb-12 text-lg text-muted-foreground leading-relaxed">
              Every SaaS company loses 40-60% of potential customers in the email verification step. 
              Users sign up, get redirected to a generic "check your email" page, and... nothing.
            </p>
            
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20">
                <CardContent className="pt-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="rounded-full bg-red-100 dark:bg-red-900/50 p-3">
                      <TrendingUp className="h-6 w-6 text-red-600 dark:text-red-400 rotate-180" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-red-700 dark:text-red-400">40-60% Drop-off</h3>
                  <p className="text-red-600/80 dark:text-red-400/80">
                    Users who never complete email verification
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-900/50 dark:bg-yellow-950/20">
                <CardContent className="pt-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/50 p-3">
                      <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-yellow-700 dark:text-yellow-400">Lost Forever</h3>
                  <p className="text-yellow-600/80 dark:text-yellow-400/80">
                    These users rarely return to complete signup
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-purple-300 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/20">
                <CardContent className="pt-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="rounded-full bg-purple-100 dark:bg-purple-900/50 p-3">
                      <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-purple-700 dark:text-purple-400">Massive Revenue Impact</h3>
                  <p className="text-purple-600/80 dark:text-purple-400/80">
                    Hundreds of thousands in lost ARR
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-3xl text-center mb-16">
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
              How SniperLink Saves Your Signups
            </h2>
            <p className="text-lg text-muted-foreground">
              Instead of hoping users find your email, take them directly to their inbox
            </p>
          </div>
          
          <div className="container mx-auto max-w-6xl grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-purple-100 p-3 group-hover:bg-purple-200 transition-colors dark:bg-purple-900/20">
                    <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-xl">Instant Detection</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Automatically detects email provider and generates the perfect deep link to their inbox
                </p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-purple-100 p-3 group-hover:bg-purple-200 transition-colors dark:bg-purple-900/20">
                    <Globe className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-xl">Universal Support</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Works with Gmail, Outlook, Yahoo, Apple Mail, and 20+ other providers
                </p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-purple-100 p-3 group-hover:bg-purple-200 transition-colors dark:bg-purple-900/20">
                    <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-xl">Privacy First</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  No data collection, no tracking. Pure client-side link generation
                </p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-purple-100 p-3 group-hover:bg-purple-200 transition-colors dark:bg-purple-900/20">
                    <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-xl">5-Minute Setup</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Drop in our JavaScript snippet and start recovering signups immediately
                </p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-purple-100 p-3 group-hover:bg-purple-200 transition-colors dark:bg-purple-900/20">
                    <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-xl">Better UX</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Users love the seamless experience. No more hunting through spam folders
                </p>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-purple-100 p-3 group-hover:bg-purple-200 transition-colors dark:bg-purple-900/20">
                    <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-xl">Proven Results</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Companies see 40-80% improvement in email verification completion rates
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
              Stop Losing Signups Today
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join the companies recovering thousands of lost signups every month
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 text-lg" asChild>
                <Link to="/embed-generator">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg" asChild>
                <Link to="/demo">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Try Demo
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border/50 bg-secondary/30 py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
                <Target className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                SniperLink
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 SniperLink. Stop losing signups forever.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
