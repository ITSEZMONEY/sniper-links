import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Copy,
  CheckCircle,
  Code,
  Eye,
  Target,
  Palette,
  Settings,
  Sparkles,
  Download
} from 'lucide-react';
import { trackEvent } from '@/lib/sniper-link';

interface EmbedConfig {
  sender: string;
  buttonText: string;
  buttonStyle: 'default' | 'minimal' | 'custom';
  buttonColor: string;
  showBranding: boolean;
  containerId: string;
}

const EmbedGenerator = () => {
  const [config, setConfig] = useState<EmbedConfig>({
    sender: '@yourdomain.com',
    buttonText: 'Open Inbox',
    buttonStyle: 'default',
    buttonColor: '#8B5CF6',
    showBranding: true,
    containerId: 'sniperlink-widget'
  });

  const [copied, setCopied] = useState(false);
  const [previewEmail, setPreviewEmail] = useState('user@gmail.com');
  const { toast } = useToast();

  useEffect(() => {
    trackEvent('embed_generator_visit');
  }, []);

  const generateEmbedCode = () => {
    const htmlCode = `<!-- SniperLink Widget -->
<div
  id="${config.containerId}"
  data-sniperlink
  data-sender="${config.sender}"
  data-button-text="${config.buttonText}"
  data-button-style="${config.buttonStyle}"
  ${config.buttonStyle === 'custom' ? `data-button-color="${config.buttonColor}"` : ''}
  data-show-branding="${config.showBranding}"
></div>

<script src="https://cdn.sniperlinks.com/sniperlink.js"></script>

<!-- Alternative: Direct initialization -->
<script>
  // Option 1: Auto-initialization with data attributes (above)

  // Option 2: Manual initialization
  /*
  const widget = SniperLink.create({
    containerId: '${config.containerId}',
    sender: '${config.sender}',
    buttonText: '${config.buttonText}',
    buttonStyle: '${config.buttonStyle}',
    ${config.buttonStyle === 'custom' ? `buttonColor: '${config.buttonColor}',` : ''}
    showBranding: ${config.showBranding},
    onLinkGenerate: (link, esp) => console.log('Generated:', link, esp),
    onError: (error) => console.error('SniperLink Error:', error)
  });
  widget.init();
  */
</script>`;

    return htmlCode;
  };

  const copyEmbedCode = async () => {
    try {
      await navigator.clipboard.writeText(generateEmbedCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);

      toast({
        title: "Code copied!",
        description: "Embed code has been copied to your clipboard.",
      });

      trackEvent('embed_code_copy', {
        buttonStyle: config.buttonStyle,
        showBranding: config.showBranding,
        sender: config.sender
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please manually copy the code from the text area.",
        variant: "destructive"
      });
    }
  };

  const downloadEmbedCode = () => {
    const code = generateEmbedCode();
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sniperlink-embed.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    trackEvent('embed_code_download', {
      buttonStyle: config.buttonStyle,
      showBranding: config.showBranding
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <div className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
              <Target className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Embed Generator
            </span>
          </div>
          <Badge className="bg-green-100 text-green-700 border-green-300">
            <Sparkles className="mr-1 h-3 w-3" />
            Free Forever
          </Badge>
        </div>
      </nav>

      <main className="container mx-auto py-12 px-4">
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl font-bold mb-2">Generate Your Widget</h1>
              <p className="text-muted-foreground">
                Customize and embed SniperLink on your signup page in under 5 minutes
              </p>
            </div>

            {/* Basic Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Basic Configuration
                </CardTitle>
                <CardDescription>
                  Essential settings for your SniperLink widget
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label htmlFor="sender" className="block text-sm font-medium mb-2">
                    Sender Domain
                  </label>
                  <Input
                    id="sender"
                    type="text"
                    placeholder="@yourdomain.com"
                    value={config.sender}
                    onChange={(e) => setConfig({ ...config, sender: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    The domain your confirmation emails come from
                  </p>
                </div>

                <div>
                  <label htmlFor="buttonText" className="block text-sm font-medium mb-2">
                    Button Text
                  </label>
                  <Input
                    id="buttonText"
                    type="text"
                    placeholder="Open Inbox"
                    value={config.buttonText}
                    onChange={(e) => setConfig({ ...config, buttonText: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="containerId" className="block text-sm font-medium mb-2">
                    Container ID
                  </label>
                  <Input
                    id="containerId"
                    type="text"
                    placeholder="sniperlink-widget"
                    value={config.containerId}
                    onChange={(e) => setConfig({ ...config, containerId: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    HTML element ID where the widget will appear
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Style Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Style Options
                </CardTitle>
                <CardDescription>
                  Customize the appearance of your widget
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Button Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['default', 'minimal', 'custom'].map((style) => (
                      <Button
                        key={style}
                        variant={config.buttonStyle === style ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setConfig({ ...config, buttonStyle: style as any })}
                        className="capitalize"
                      >
                        {style}
                      </Button>
                    ))}
                  </div>
                </div>

                {config.buttonStyle === 'custom' && (
                  <div>
                    <label htmlFor="buttonColor" className="block text-sm font-medium mb-2">
                      Button Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        id="buttonColor"
                        value={config.buttonColor}
                        onChange={(e) => setConfig({ ...config, buttonColor: e.target.value })}
                        className="w-12 h-10 rounded border border-input"
                      />
                      <Input
                        type="text"
                        placeholder="#8B5CF6"
                        value={config.buttonColor}
                        onChange={(e) => setConfig({ ...config, buttonColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showBranding"
                    checked={config.showBranding}
                    onChange={(e) => setConfig({ ...config, showBranding: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="showBranding" className="text-sm font-medium">
                    Show "Powered by SniperLink"
                    <Badge variant="secondary" className="ml-2 text-xs">Free Plan</Badge>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview and Code */}
          <div className="space-y-6">
            {/* Live Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Live Preview
                </CardTitle>
                <CardDescription>
                  See how your widget will look
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <label htmlFor="previewEmail" className="block text-sm font-medium mb-2">
                    Test Email
                  </label>
                  <Input
                    id="previewEmail"
                    type="email"
                    placeholder="user@gmail.com"
                    value={previewEmail}
                    onChange={(e) => setPreviewEmail(e.target.value)}
                  />
                </div>

                {/* Preview Widget */}
                <div className="border rounded-lg p-6 bg-gray-50 dark:bg-gray-900/20">
                  <div className="text-center">
                    <button
                      className={`
                        inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
                        ${config.buttonStyle === 'default'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl'
                          : config.buttonStyle === 'minimal'
                          ? 'bg-indigo-600 text-white px-4 py-2 text-sm'
                          : `text-white`}
                      `}
                      style={config.buttonStyle === 'custom' ? { backgroundColor: config.buttonColor } : {}}
                    >
                      <span className="text-lg">📧</span>
                      {config.buttonText}
                    </button>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Opens Gmail to find your confirmation email
                    </div>
                    {config.showBranding && (
                      <div className="mt-3 text-xs text-muted-foreground">
                        <a href="#" className="hover:text-purple-600">Powered by SniperLink</a>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generated Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Embed Code
                </CardTitle>
                <CardDescription>
                  Copy this code and paste it on your signup page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto max-h-80">
                    <code>{generateEmbedCode()}</code>
                  </pre>

                  <div className="flex gap-2 mt-4">
                    <Button onClick={copyEmbedCode} className="flex-1">
                      {copied ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Code
                        </>
                      )}
                    </Button>

                    <Button variant="outline" onClick={downloadEmbedCode}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Integration Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Integration Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-3">
                    <Badge className="min-w-[20px] h-6 flex items-center justify-center bg-purple-100 text-purple-700 border-purple-300">1</Badge>
                    <span>Copy the embed code above</span>
                  </li>
                  <li className="flex gap-3">
                    <Badge className="min-w-[20px] h-6 flex items-center justify-center bg-purple-100 text-purple-700 border-purple-300">2</Badge>
                    <span>Paste it on your post-signup "check your email" page</span>
                  </li>
                  <li className="flex gap-3">
                    <Badge className="min-w-[20px] h-6 flex items-center justify-center bg-purple-100 text-purple-700 border-purple-300">3</Badge>
                    <span>Update the <code className="bg-gray-100 px-1 rounded">data-sender</code> attribute with your domain</span>
                  </li>
                  <li className="flex gap-3">
                    <Badge className="min-w-[20px] h-6 flex items-center justify-center bg-purple-100 text-purple-700 border-purple-300">4</Badge>
                    <span>Test with a real signup to see the magic! 🎉</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmbedGenerator;
