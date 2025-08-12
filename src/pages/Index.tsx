import React, { useState, useEffect } from 'react';
import { Copy, Mail, ArrowRight, CheckCircle, Star, Zap, Target, Users, TrendingUp, Shield, Clock, Globe, Sun, Moon, Sparkles, Send, MessageSquare, Play } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

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

const Index = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const getSniperLink = (email: string, sender = "@yourdomain.com") => {
    const domain = email.split("@")[1].toLowerCase();
    const encoded = encodeURIComponent(sender);
    const newerThan = "newer_than%3A1d";

    if (domain.includes("gmail")) 
      return `https://mail.google.com/mail/u/0/#search/from%3A${encoded}+in%3Aanywhere+${newerThan}`;
    if (domain.includes("outlook") || domain.includes("live") || domain.includes("hotmail")) 
      return `https://outlook.live.com/mail/0/inbox/search/id/${encoded}`;
    if (domain.includes("yahoo")) 
      return `https://mail.yahoo.com/d/search/keyword=from%253A${encoded}`;
    if (domain.includes("proton")) 
      return `https://mail.proton.me/u/0/all-mail#from=${encoded}`;
    if (domain.includes("icloud")) 
      return `https://www.icloud.com/mail/`;
    
    return null;
  };

  const handleSniperTry = async () => {
    if (!email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    const link = getSniperLink(email);
    
    setTimeout(() => {
      setIsLoading(false);
      if (!link) {
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
      
      window.open(link, "_blank");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/50 glass">
        <div className="container-modern flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl gradient-primary">
              <Target className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gradient">SniperLink</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="focus-ring">
              Docs
            </Button>
            <Button variant="outline" className="btn-outline-modern focus-ring">
              Sign In
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <main role="main" id="main-content">

      {/* Hero Section */}
      <section className="relative overflow-hidden hero-bg">
        <div className="section-padding">
          <div className="container-modern">
            <div className="mx-auto max-w-4xl text-center">
              <div className="fade-in">
                <Badge className="mb-8 badge-modern bg-primary/10 text-primary border-primary/30">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Stop losing signups forever
                </Badge>
                
                <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl text-balance">
                  Turn lost signups into 
                  <span className="text-gradient block mt-2"> customers</span>
                </h1>
                
                <p className="mb-12 text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance">
                  SniperLink generates direct inbox links that take users straight to their email to complete signup. 
                  No more "check your email" dead ends.
                </p>
              </div>

              {/* Demo Section */}
              <div className="mx-auto max-w-lg slide-up">
                <Card className="card-modern border-primary/20 bg-card/50 backdrop-blur-xl shadow-2xl">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Try SniperLink</CardTitle>
                    <CardDescription>
                      Enter an email to see the magic in action
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-3">
                      <div className="sr-only">
                        <Label htmlFor="signup-email">Email address</Label>
                      </div>
                      <Input
                        id="signup-email"
                        type="email"
                        aria-label="Email address"
                        placeholder="user@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 input-modern"
                        onKeyPress={(e) => e.key === "Enter" && handleSniperTry()}
                      />
                      <Button 
                        onClick={handleSniperTry}
                        disabled={isLoading || !email}
                        className="btn-gradient focus-ring"
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
                      <div className="flex items-center justify-center gap-2 p-4 rounded-xl badge-success border">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Link copied and opened!</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="section-padding bg-secondary/30">
        <div className="container-modern">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl text-balance">
              The Hidden Revenue Killer
            </h2>
            <p className="mb-12 text-lg text-muted-foreground leading-relaxed text-balance">
              Every SaaS company loses 40-60% of potential customers in the email verification step. 
              Users sign up, get redirected to a generic "check your email" page, and... nothing.
            </p>
            
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="card-modern border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20">
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
              
              <Card className="card-modern border-yellow-200 bg-yellow-50 dark:border-yellow-900/50 dark:bg-yellow-950/20">
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
              
              <Card className="card-modern border-primary/30 bg-primary/5">
                <CardContent className="pt-6 text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className="rounded-full bg-primary/10 p-3">
                      <Target className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-primary">Massive Revenue Impact</h3>
                  <p className="text-primary/80">
                    Hundreds of thousands in lost ARR
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding">
        <div className="container-modern">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl text-balance">
              How SniperLink Saves Your Signups
            </h2>
            <p className="text-lg text-muted-foreground text-balance">
              Instead of hoping users find your email, take them directly to their inbox
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="card-modern group">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                    <Zap className="h-6 w-6 text-primary" />
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
            
            <Card className="card-modern group">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                    <Globe className="h-6 w-6 text-primary" />
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
            
            <Card className="card-modern group">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                    <Shield className="h-6 w-6 text-primary" />
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
            
            <Card className="card-modern group">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                    <Clock className="h-6 w-6 text-primary" />
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
            
            <Card className="card-modern group">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                    <Users className="h-6 w-6 text-primary" />
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
            
            <Card className="card-modern group">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
                    <TrendingUp className="h-6 w-6 text-primary" />
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
        </div>
      </section>

      {/* Social Proof */}
      <section className="section-padding bg-secondary/30">
        <div className="container-modern">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl text-balance">
              Trusted by Growing SaaS Companies
            </h2>
            <p className="text-lg text-muted-foreground text-balance">
              Join hundreds of companies already recovering lost signups
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="card-modern">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                  "SniperLink increased our email verification rate by 65%. It's the easiest conversion optimization we've ever implemented."
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">SC</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Sarah Chen</p>
                    <p className="text-sm text-muted-foreground">Head of Growth, TechStart</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-modern">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                  "We were losing $50K/month in signups. SniperLink solved this in one afternoon. Incredible ROI."
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">MR</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Marcus Rodriguez</p>
                    <p className="text-sm text-muted-foreground">CEO, DataFlow</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="card-modern">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                  "The user experience improvement is remarkable. Our users actually thank us for making signup easier."
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">AP</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Alex Park</p>
                    <p className="text-sm text-muted-foreground">Product Manager, CloudBase</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-modern">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl text-balance">
              Stop Losing Signups Today
            </h2>
            <p className="mb-8 text-lg text-muted-foreground text-balance">
              Join the companies recovering thousands of lost signups every month
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-gradient px-8 py-4 text-lg focus-ring">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="btn-outline-modern px-8 py-4 text-lg focus-ring">
                <MessageSquare className="mr-2 h-5 w-5" />
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      </main>
      {/* Footer */}
      <footer className="border-t border-border/50 bg-secondary/30 py-12">
        <div className="container-modern">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="p-2 rounded-xl gradient-primary">
                <Target className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gradient">SniperLink</span>
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

export default Index;