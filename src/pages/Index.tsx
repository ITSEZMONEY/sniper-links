import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/70">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Up to 61% of your signups never confirm their email.
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-4xl mx-auto">
            SniperLink helps you recover them instantly with 1-click inbox deep links — even if the email went to spam.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl">
              Start Free
            </Button>
            <Button variant="secondary" size="xl">
              Embed in 1 Minute
            </Button>
          </div>
        </section>

        {/* Live Demo Section */}
        <Card className="glass-card max-w-2xl mx-auto mb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 pointer-events-none"></div>
          <CardContent className="p-8 text-center relative z-10">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Try it yourself
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Enter your email to see how SniperLink finds your inbox — works with Gmail, Outlook, Yahoo, and more
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-4">
              <div className="relative w-full sm:w-80">
                <Input
                  type="email"
                  placeholder="you@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  onKeyPress={(e) => e.key === "Enter" && handleSniperTry()}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  ✉️
                </div>
              </div>
              <Button 
                onClick={handleSniperTry}
                variant="cta"
                disabled={isLoading}
                size="lg"
                className="w-full sm:w-auto h-12 px-8 font-semibold tracking-wide"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Opening...
                  </div>
                ) : (
                  <>Open Inbox 🚀</>
                )}
              </Button>
            </div>
            {email && email.includes('@') && (
              <div className="text-sm text-muted-foreground">
                Will open: <span className="font-mono bg-muted px-2 py-1 rounded text-xs">
                  {email.split('@')[1].toLowerCase()}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features Section */}
        <Card className="glass-card max-w-4xl mx-auto">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold mb-4 text-center">
              Built for growth teams, PLG products & indie SaaS
            </h2>
            <p className="text-lg text-muted-foreground text-center">
              Just drop our script on your "Check your inbox" screen — SniperLink detects ESPs like Gmail, 
              Outlook, Yahoo and opens the inbox with filters that surface your email fast. No code required.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
