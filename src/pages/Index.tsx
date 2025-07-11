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

  const features = [
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
  ];

  const testimonials = [
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
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "1 domain",
        "Basic ESP support",
        "Community support",
        "SniperLink branding"
      ],
      cta: "Start Free",
      highlighted: false
    },
    {
      name: "Pro",
      price: "$9",
      period: "per month",
      description: "For growing teams",
      features: [
        "Unlimited domains",
        "All ESP providers",
        "Remove branding",
        "Basic analytics",
        "Priority support"
      ],
      cta: "Start Pro Trial",
      highlighted: true
    },
    {
      name: "Team",
      price: "$49",
      period: "per month",
      description: "For scaling companies",
      features: [
        "Everything in Pro",
        "Advanced analytics",
        "A/B testing support",
        "Team dashboard",
        "Custom integrations"
      ],
      cta: "Contact Sales",
      highlighted: false
    }
  ];

  const faqs = [
    {
      question: "Will SniperLink slow down my signup flow?",
      answer: "No. SniperLink loads asynchronously and weighs only 2KB. It doesn't block your page or affect performance."
    },
    {
      question: "Does it work with mobile email apps?",
      answer: "Yes. We support deep linking to Gmail, Outlook, and Yahoo mobile apps on both iOS and Android."
    },
    {
      question: "What if a user's email provider isn't supported?",
      answer: "We show a graceful fallback with search instructions. We support 95% of email providers."
    },
    {
      question: "Can I customize the widget's appearance?",
      answer: "Absolutely. SniperLink is fully customizable via CSS and supports multiple themes out of the box."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="text-foreground font-bold text-xl">SniperLink</div>
        <div className="flex gap-4">
          <Button variant="ghost">
            Docs
          </Button>
          <Button variant="default" size="sm">
            Sign In
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
            ⚡ Used by 1,200+ SaaS companies
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground leading-tight">
            Up to <span className="text-primary">61%</span> of your signups<br />
            never confirm their email
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
            SniperLink recovers lost signups instantly with 1-click inbox deep links — 
            even if your confirmation email landed in spam
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="default" size="xl" className="text-lg hover-lift">
              <Play className="w-5 h-5 mr-2" />
              Try Live Demo
            </Button>
            <Button variant="secondary" size="xl" className="text-lg hover-lift">
              <ArrowRight className="w-5 h-5 mr-2" />
              Add to Site in 60 Seconds
            </Button>
          </div>
          
          {/* Social Proof */}
          <div className="text-muted-foreground text-sm mb-8">
            Trusted by teams at companies you know
          </div>
          <div className="flex justify-center items-center gap-8 opacity-60 mb-12">
            {["YC Company", "TechCorp", "SaaS Inc", "StartupXYZ", "GrowthCo"].map((company, i) => (
              <div key={i} className="text-muted-foreground font-semibold">{company}</div>
            ))}
          </div>
        </section>

        {/* Live Demo Section */}
        <div className="glass-enhanced max-w-2xl mx-auto mb-20 hover-lift p-8">
          <h2 className="text-3xl font-bold mb-2 text-center text-foreground">
            See SniperLink in Action
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto text-center">
            Enter your email to see how SniperLink finds your inbox — works with Gmail, Outlook, Yahoo, and more
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-4">
            <div className="relative w-full sm:w-80">
              <Input
                type="email"
                placeholder="you@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 h-12 text-base"
                onKeyPress={(e) => e.key === "Enter" && handleSniperTry()}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                ✉️
              </div>
            </div>
            <Button 
              onClick={handleSniperTry}
              variant="default"
              disabled={isLoading}
              size="lg"
              className="w-full sm:w-auto h-12 px-8 font-semibold tracking-wide hover-lift"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="spinner"></div>
                  Opening...
                </div>
              ) : (
                <>Open My Inbox 🚀</>
              )}
            </Button>
          </div>
          {email && email.includes('@') && (
            <div className="text-sm text-muted-foreground text-center">
              Will open: <span className="font-mono bg-muted px-2 py-1 rounded text-xs">
                {email.split('@')[1].toLowerCase()}
              </span>
            </div>
          )}
        </div>

        {/* Problem Section */}
        <section className="mb-20">
          <Card className="glass-enhanced max-w-4xl mx-auto hover-lift">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl font-bold mb-8 text-red-600 dark:text-red-400">
                The Hidden Revenue Leak in Every SaaS
              </h2>
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500 mb-2">27-61%</div>
                  <div className="text-muted-foreground">Signups never confirm</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500 mb-2">$247K</div>
                  <div className="text-muted-foreground">Lost ARR per year*</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-500 mb-2">0%</div>
                  <div className="text-muted-foreground">Teams fixing this</div>
                </div>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                Your confirmation emails get buried in spam, lost in crowded inboxes, or simply forgotten. 
                Meanwhile, you're bleeding paid traffic and missing activations.
              </p>
              <p className="text-sm text-muted-foreground">
                *Based on average SaaS with 10K monthly signups at $50 ACV
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Solution Section */}
        <section className="mb-20">
          <Card className="glass-enhanced max-w-6xl mx-auto hover-lift">
            <CardContent className="p-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">
                  Turn "Check Your Inbox" Into a Conversion Engine
                </h2>
                <p className="text-xl text-muted-foreground">
                  SniperLink adds one-click inbox access to any confirmation screen
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-6">How It Works</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <div className="font-semibold">User hits your confirmation screen</div>
                        <div className="text-muted-foreground text-sm">After signing up, they see "Check your inbox"</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <div className="font-semibold">SniperLink detects their email provider</div>
                        <div className="text-muted-foreground text-sm">Gmail, Outlook, Yahoo, iCloud, ProtonMail</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <div className="font-semibold">Generates smart inbox deep link</div>
                        <div className="text-muted-foreground text-sm">Pre-filtered to your domain, includes spam folders</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">✓</div>
                      <div>
                        <div className="font-semibold">User clicks, email opens instantly</div>
                        <div className="text-muted-foreground text-sm">No searching, no scrolling, instant activation</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="glass-enhanced p-6 text-center">
                  <div className="text-sm text-muted-foreground mb-2">Live Preview</div>
                  <div className="bg-background rounded border p-4 mb-4">
                    <h4 className="font-semibold mb-2">Check your email</h4>
                    <p className="text-sm text-muted-foreground mb-3">We sent a confirmation link to your@gmail.com</p>
                    <Button variant="outline" className="w-full mb-2 hover-lift">
                      <Mail className="w-4 h-4 mr-2" />
                      Open Gmail Inbox
                    </Button>
                    <div className="text-xs text-muted-foreground">Powered by SniperLink</div>
                  </div>
                  <div className="text-sm text-green-600 font-semibold">
                    +31% higher confirmation rate
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Features Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need to Fix Confirmation Drop-off
            </h2>
            <p className="text-xl text-muted-foreground">
              No backend, no complexity, just results
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card key={index} className="glass-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              What Growth Teams Are Saying
            </h2>
            <p className="text-xl text-muted-foreground">
              Real results from real companies
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="glass-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="mb-4 italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{testimonial.avatar}</div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Start free, scale as you grow
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`glass-card hover-lift relative ${plan.highlighted ? 'ring-2 ring-primary' : ''}`}>
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold mb-1">
                      {plan.price}
                      <span className="text-sm font-normal text-muted-foreground">/{plan.period}</span>
                    </div>
                    <p className="text-muted-foreground text-sm">{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant={plan.highlighted ? "cta" : "outline"} 
                    className="w-full hover-lift"
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          
          <Card className="glass-enhanced max-w-4xl mx-auto hover-lift">
            <CardContent className="p-8">
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-muted pb-6 last:border-b-0">
                    <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Final CTA Section */}
        <section className="text-center">
          <Card className="glass-enhanced max-w-4xl mx-auto hover-lift">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold mb-4">
                Stop Losing Signups Today
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join 1,200+ companies recovering lost revenue with SniperLink
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button variant="cta" size="xl" className="text-lg hover-lift">
                  <Zap className="w-5 h-5 mr-2" />
                  Start Free - No Credit Card
                </Button>
                <Button variant="outline" size="xl" className="text-lg hover-lift">
                  <Clock className="w-5 h-5 mr-2" />
                  Book 15-min Demo
                </Button>
              </div>
              <div className="flex justify-center items-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-green-500" />
                  Free forever plan
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-green-500" />
                  2-minute setup
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-green-500" />
                  No engineering required
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center text-muted-foreground">
            <div>© 2024 SniperLink. All rights reserved.</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
