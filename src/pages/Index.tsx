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
        <Card className="glass-card max-w-2xl mx-auto mb-16">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Try it yourself</h2>
            <p className="text-muted-foreground mb-6">
              Enter your email to see how SniperLink finds your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full sm:w-80"
                onKeyPress={(e) => e.key === "Enter" && handleSniperTry()}
              />
              <Button 
                onClick={handleSniperTry}
                variant="cta"
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {isLoading ? "Opening..." : "Open Inbox"}
              </Button>
            </div>
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
