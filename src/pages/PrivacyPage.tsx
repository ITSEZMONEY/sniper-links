import React from 'react';
import { ArrowLeft, Shield, Eye, Database, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Button variant="ghost" asChild>
            <Link to="/" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </Button>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              SniperLink Privacy
            </span>
          </div>
        </div>
      </nav>

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Eye className="h-6 w-6 text-purple-600" />
                What We Collect
              </CardTitle>
              <CardDescription>
                We believe in radical transparency about data collection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Email Addresses (Client-Side Only)</h3>
                <p className="text-muted-foreground">
                  When you use our demo or embed SniperLink, email addresses are processed entirely in your browser.
                  We never send emails to our servers or store them anywhere.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Usage Analytics (Optional)</h3>
                <p className="text-muted-foreground">
                  We may collect anonymous usage data like button clicks and link generations to improve the service.
                  No personal information is included.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Database className="h-6 w-6 text-purple-600" />
                How We Use Your Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Email Processing</h3>
                <p className="text-muted-foreground">
                  Email addresses you enter are used solely to generate inbox deep links. This happens entirely
                  in your browser using JavaScript - we never see or store your emails.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Service Improvement</h3>
                <p className="text-muted-foreground">
                  Anonymous usage data helps us understand which email providers are most popular and
                  where users might need better support.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Shield className="h-6 w-6 text-purple-600" />
                Data Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">No Server Storage</h3>
                <p className="text-muted-foreground">
                  SniperLink is designed to work entirely client-side. Your emails never leave your browser.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">No Third-Party Sharing</h3>
                <p className="text-muted-foreground">
                  We don't sell, rent, or share any data with third parties for marketing purposes.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Secure by Design</h3>
                <p className="text-muted-foreground">
                  Our architecture ensures privacy by design - there's no way for us to access your emails
                  because they're never transmitted to our servers.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Mail className="h-6 w-6 text-purple-600" />
                Your Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Data Access</h3>
                <p className="text-muted-foreground">
                  Since we don't store personal data, there's nothing to access. All processing happens locally.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Data Deletion</h3>
                <p className="text-muted-foreground">
                  Clear your browser cache to remove any local data. We have no server-side data to delete.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Opt-Out</h3>
                <p className="text-muted-foreground">
                  You can opt out of analytics by using ad blockers or disabling JavaScript.
                  The core functionality still works.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Questions about this privacy policy? We're happy to help.
              </p>
              <Button asChild>
                <Link to="mailto:privacy@sniperlink.dev">
                  Contact Privacy Team
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPage;