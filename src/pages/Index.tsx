import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Mail, Zap, Target, Shield, Star, ArrowRight, Play, Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');
  
  useEffect(() => {
    // Check for saved theme or system preference
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
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </button>
  );
};

const Index = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleSniperTry = () => {
    if (!email.includes("@")) {
      return;
    }
    
    setIsLoading(true);
    const link = getSniperLink(email);
    
    setTimeout(() => {
      setIsLoading(false);
      if (!link) {
        return;
      }
      // Copy to clipboard and show success
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      window.open(link, "_blank");
    }, 800);
  };

  return (
    <div className="min-h-screen surface-0 transition-all duration-300">
      {/* Navigation */}
      <nav className="border-b border-border surface-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-foreground font-bold text-xl">SniperLink</div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" className="text-foreground hover:surface-1">
              Docs
            </Button>
            <Button className="btn-primary">
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-32">
        {/* Hero Section with subtle glassmorphism */}
        <section className="text-center space-y-8">
          <div className="glass-subtle rounded-2xl p-12 max-w-5xl mx-auto">
            <Badge className="mb-8 bg-primary/10 text-primary border-primary/20 px-4 py-2">
              ⚡ Used by 1,200+ SaaS companies
            </Badge>
            
            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
                Up to <span className="text-primary">61%</span> of your signups<br />
                never confirm their email
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                SniperLink recovers lost signups instantly with 1-click inbox deep links — 
                even if your confirmation email landed in spam
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="btn-primary text-lg px-8 py-4">
                <Play className="w-5 h-5 mr-2" />
                Try Live Demo
              </Button>
              <Button className="btn-secondary text-lg px-8 py-4">
                <ArrowRight className="w-5 h-5 mr-2" />
                Add to Site in 60 Seconds
              </Button>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="max-w-2xl mx-auto">
          <Card className="card-elevated">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-foreground">
                See SniperLink in Action
              </CardTitle>
              <p className="text-muted-foreground text-lg">
                Enter your email to see how SniperLink finds your inbox
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Input
                    type="email"
                    placeholder="you@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-styled text-lg py-3"
                    onKeyPress={(e) => e.key === "Enter" && handleSniperTry()}
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    <Mail className="w-5 h-5" />
                  </div>
                </div>
                <Button 
                  onClick={handleSniperTry}
                  disabled={isLoading}
                  className="btn-primary text-lg px-8 py-3 whitespace-nowrap"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
                      Opening...
                    </div>
                  ) : (
                    <>Open My Inbox 🚀</>
                  )}
                </Button>
              </div>
              
              {copied && (
                <div className="success-glow rounded-lg p-4 text-center font-medium">
                  <Check className="w-5 h-5 inline mr-2" />
                  Inbox link copied! Now paste it into your 'Check your inbox' screen.
                </div>
              )}
              
              {email && email.includes('@') && (
                <div className="text-sm text-muted-foreground text-center">
                  Will open: <span className="font-mono surface-1 px-2 py-1 rounded border">
                    {email.split('@')[1].toLowerCase()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Problem Section */}
        <section>
          <Card className="card-elevated max-w-4xl mx-auto text-center">
            <CardContent className="p-12 space-y-8">
              <h2 className="text-4xl font-bold text-destructive">
                The Hidden Revenue Leak in Every SaaS
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-destructive">27-61%</div>
                  <div className="text-muted-foreground">Signups never confirm</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-destructive">$247K</div>
                  <div className="text-muted-foreground">Lost ARR per year*</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-destructive">0%</div>
                  <div className="text-muted-foreground">Teams fixing this</div>
                </div>
              </div>
              <p className="text-lg text-foreground max-w-2xl mx-auto leading-relaxed">
                Your confirmation emails get buried in spam, lost in crowded inboxes, or simply forgotten. 
                Meanwhile, you're bleeding paid traffic and missing activations.
              </p>
              <p className="text-sm text-muted-foreground">
                *Based on average SaaS with 10K monthly signups at $50 ACV
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Features Section */}
        <section>
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-foreground">
              Everything You Need to Fix Confirmation Drop-off
            </h2>
            <p className="text-xl text-muted-foreground">
              No backend, no complexity, just results
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: <Mail className="w-7 h-7" />,
                title: "Auto ESP Detection",
                description: "Instantly detects Gmail, Outlook, Yahoo, iCloud, ProtonMail and generates the perfect deep link"
              },
              {
                icon: <Target className="w-7 h-7" />,
                title: "Spam Piercing", 
                description: "Deep links work even when emails land in spam folders — never lose a signup again"
              },
              {
                icon: <Zap className="w-7 h-7" />,
                title: "Zero Backend",
                description: "Pure client-side, 2KB script. No API calls, no dependencies, no maintenance headaches"
              },
              {
                icon: <Shield className="w-7 h-7" />,
                title: "Mobile + Desktop",
                description: "Works seamlessly across all devices and email client apps with native deep linking"
              }
            ].map((feature, index) => (
              <Card key={index} className="card-elevated group">
                <CardContent className="p-8 flex items-start gap-6">
                  <div className="bg-primary/10 p-4 rounded-xl text-primary group-hover:bg-primary/15 transition-colors">
                    {feature.icon}
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-bold text-xl text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Social Proof */}
        <section>
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-foreground">
              What Growth Teams Are Saying
            </h2>
            <p className="text-xl text-muted-foreground">
              Real results from real companies
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Head of Growth @ Flowbase", 
                content: "SniperLink gave us a 31% boost in email confirmations overnight. The ROI was instant.",
                avatar: "👩‍💼"
              },
              {
                name: "Marcus Rivera",
                role: "Founder @ DevTools",
                content: "Finally, a solution for the most frustrating part of our signup funnel. Game changer.",
                avatar: "👨‍💻"
              },
              {
                name: "Emily Watson",
                role: "Product Manager @ SaaSly",
                content: "Our activation rate jumped 24% in the first week. This should be standard for every SaaS.",
                avatar: "👩‍🚀"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="card-elevated">
                <CardContent className="p-8 space-y-6">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-foreground italic text-lg leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div>
                      <div className="font-bold text-foreground">{testimonial.name}</div>
                      <div className="text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-8">
          <Card className="card-elevated max-w-2xl mx-auto">
            <CardContent className="p-12 space-y-8">
              <h2 className="text-4xl font-bold text-foreground">
                Ready to Stop Losing Signups?
              </h2>
              <p className="text-muted-foreground text-lg">
                Join 1,200+ SaaS companies using SniperLink to recover lost activations
              </p>
              <Button className="btn-primary text-lg px-12 py-4">
                Start Free Trial
              </Button>
              <p className="text-sm text-muted-foreground">
                No credit card required • 2-minute setup
              </p>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-border surface-1 mt-32">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <p className="text-muted-foreground">
            © 2024 SniperLink. Built for SaaS teams who don't accept losing signups.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;