import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Mail, Zap, Target, Shield, BarChart3, Clock, Users, Star, ArrowRight, Play } from "lucide-react";

const Index = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      alert("Enter a valid email");
      return;
    }
    
    setIsLoading(true);
    const link = getSniperLink(email);
    
    setTimeout(() => {
      setIsLoading(false);
      if (!link) {
        alert("Sorry, we don't support that provider yet.");
        return;
      }
      window.open(link, "_blank");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-foreground font-bold text-xl">SniperLink</div>
          <div className="flex gap-4">
            <Button variant="ghost" className="text-foreground">
              Docs
            </Button>
            <Button className="btn-primary">
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        {/* Hero Section */}
        <section className="text-center space-y-8">
          <Badge className="bg-primary/10 text-primary border-primary/20">
            ⚡ Used by 1,200+ SaaS companies
          </Badge>
          
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
              Up to <span className="text-primary">61%</span> of your signups<br />
              never confirm their email
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto">
              SniperLink recovers lost signups instantly with 1-click inbox deep links — 
              even if your confirmation email landed in spam
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="btn-primary text-lg px-8 py-4">
              <Play className="w-5 h-5 mr-2" />
              Try Live Demo
            </Button>
            <Button className="btn-secondary text-lg px-8 py-4">
              <ArrowRight className="w-5 h-5 mr-2" />
              Add to Site in 60 Seconds
            </Button>
          </div>
        </section>

        {/* Demo Section */}
        <section className="max-w-2xl mx-auto">
          <Card className="card-base">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-foreground">
                See SniperLink in Action
              </CardTitle>
              <p className="text-muted-foreground">
                Enter your email to see how SniperLink finds your inbox
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="you@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-base flex-1"
                  onKeyPress={(e) => e.key === "Enter" && handleSniperTry()}
                />
                <Button 
                  onClick={handleSniperTry}
                  disabled={isLoading}
                  className="btn-primary"
                >
                  {isLoading ? "Opening..." : "Open My Inbox 🚀"}
                </Button>
              </div>
              {email && email.includes('@') && (
                <div className="text-sm text-muted-foreground text-center">
                  Will open: <span className="font-mono bg-muted px-2 py-1 rounded">
                    {email.split('@')[1].toLowerCase()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Problem Section */}
        <section>
          <Card className="card-base max-w-4xl mx-auto text-center">
            <CardContent className="space-y-8">
              <h2 className="text-4xl font-bold text-destructive">
                The Hidden Revenue Leak in Every SaaS
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="text-3xl font-bold text-destructive mb-2">27-61%</div>
                  <div className="text-muted-foreground">Signups never confirm</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-destructive mb-2">$247K</div>
                  <div className="text-muted-foreground">Lost ARR per year*</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-destructive mb-2">0%</div>
                  <div className="text-muted-foreground">Teams fixing this</div>
                </div>
              </div>
              <p className="text-lg text-foreground max-w-2xl mx-auto">
                Your confirmation emails get buried in spam, lost in crowded inboxes, or simply forgotten. 
                Meanwhile, you're bleeding paid traffic and missing activations.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Features Section */}
        <section>
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl font-bold text-foreground">
              Everything You Need to Fix Confirmation Drop-off
            </h2>
            <p className="text-xl text-muted-foreground">
              No backend, no complexity, just results
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: <Mail className="w-6 h-6" />,
                title: "Auto ESP Detection",
                description: "Instantly detects Gmail, Outlook, Yahoo, iCloud, ProtonMail"
              },
              {
                icon: <Target className="w-6 h-6" />,
                title: "Spam Piercing", 
                description: "Deep links work even when emails land in spam folders"
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Zero Backend",
                description: "Pure client-side, 2KB script. No API calls or dependencies"
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Mobile + Desktop",
                description: "Works across all devices and email client apps"
              }
            ].map((feature, index) => (
              <Card key={index} className="card-base">
                <CardContent className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg text-primary">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section>
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl font-bold text-foreground">
              What Growth Teams Are Saying
            </h2>
            <p className="text-xl text-muted-foreground">
              Real results from real companies
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
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
              <Card key={index} className="card-base">
                <CardContent className="space-y-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-foreground italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{testimonial.avatar}</div>
                    <div>
                      <div className="font-bold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-8">
          <Card className="card-base max-w-2xl mx-auto">
            <CardContent className="space-y-6">
              <h2 className="text-3xl font-bold text-foreground">
                Ready to Stop Losing Signups?
              </h2>
              <p className="text-muted-foreground">
                Join 1,200+ SaaS companies using SniperLink to recover lost activations
              </p>
              <Button className="btn-primary text-lg px-8 py-4">
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
      <footer className="border-t border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-muted-foreground">
            © 2024 SniperLink. Built for SaaS teams who don't accept losing signups.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;