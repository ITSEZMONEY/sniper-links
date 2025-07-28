import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Mail, Moon, Sun, Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [isDark, setIsDark] = useState(false);
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

  const handleGenerateLink = () => {
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
          title: "Unsupported provider",
          description: "Sorry, we don't support that email provider yet.",
          variant: "destructive",
        });
        return;
      }
      
      navigator.clipboard.writeText(link);
      setLinkGenerated(true);
      toast({
        title: "✅ Inbox link copied!",
        description: "Now paste it into your 'Check your inbox' screen.",
        className: "bg-green-50 border-green-200 text-green-800",
      });
    }, 800);
  };

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark' : ''}`}>
      {/* Dark mode toggle */}
      <div className="fixed top-6 right-6 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleDarkMode}
          className="rounded-full w-10 h-10 p-0"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>

      <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 min-h-screen">
        <div className="container mx-auto px-6 py-16">
          {/* Main Tool Section */}
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent leading-tight tracking-tight">
                Recover lost signups instantly
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg mx-auto">
                Sniper Links open your user's inbox directly on the confirmation email—even if it's in spam.
              </p>
            </div>

            {/* Tool Card */}
            <Card className="glass-enhanced border-0 shadow-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl">
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Email Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Enter your email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="sarah@yourcompany.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 h-12 text-base border-gray-200 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        onKeyPress={(e) => e.key === "Enter" && handleGenerateLink()}
                      />
                    </div>
                  </div>

                  {/* Generate Button */}
                  <Button 
                    onClick={handleGenerateLink}
                    disabled={isLoading || !email}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Generating Link...
                      </div>
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Generate Inbox Link
                      </>
                    )}
                  </Button>

                  {/* Success Feedback */}
                  {linkGenerated && (
                    <div className="animate-fade-in bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="bg-green-100 dark:bg-green-800 rounded-full p-1">
                          <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-green-800 dark:text-green-200">
                            Inbox link copied!
                          </p>
                          <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                            Now paste it into your 'Check your inbox' screen.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Preview */}
                  {email && email.includes('@') && (
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</div>
                      <div className="bg-white dark:bg-gray-800 rounded border p-3">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Check your email</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          We sent a confirmation link to {email}
                        </p>
                        <Button variant="outline" className="w-full hover:bg-blue-50 dark:hover:bg-blue-900/20">
                          <Mail className="w-4 h-4 mr-2" />
                          Open {email.split('@')[1]} Inbox
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Social Proof */}
            <div className="text-center mt-12">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Trusted by SaaS founders and growth teams
              </p>
              <div className="flex justify-center items-center gap-8 opacity-60">
                {["Stripe", "Notion", "Linear", "Vercel", "Supabase"].map((company, i) => (
                  <div key={i} className="text-gray-400 dark:text-gray-500 font-medium text-sm">{company}</div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur">
          <div className="container mx-auto px-6 py-8">
            <div className="flex justify-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Powered by <span className="font-semibold">Sniper Link</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
