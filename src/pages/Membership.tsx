import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Star, Sparkles, Wallet, Copy, QrCode, ArrowRight, Shield, Zap, Clock, CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';

// Bitcoin SVG Icon
const BitcoinIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.546zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.238c.535.136.63.486.615.766l-.617 2.477c.037.009.086.023.14.047l-.14-.036-.865 3.472c-.063.16-.228.4-.6.31.015.02-.96-.24-.96-.24l-.655 1.51 1.715.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z"/>
  </svg>
);

// Monero SVG Icon
const MoneroIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 256 256" fill="currentColor">
    <path d="M127.998 0C57.318 0 0 57.317 0 127.999c0 14.127 2.29 27.716 6.518 40.43H44.8V60.733l83.2 83.2 83.198-83.2v107.695h38.282c4.228-12.714 6.52-26.303 6.52-40.43C256 57.314 198.681 0 127.998 0"/>
    <path d="M108.867 163.062l-36.31-36.31v67.765H18.623c22.47 36.863 63.051 61.48 109.373 61.48s86.907-24.617 109.374-61.48h-53.933v-67.766l-36.31 36.31-19.13 19.13"/>
  </svg>
);

const Membership = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<'btc' | 'xmr'>('btc');
  const [copied, setCopied] = useState(false);

  const membershipTiers = [
    {
      id: 'basic',
      name: 'Basic Chef',
      priceBTC: '0.00042',
      priceXMR: '0.028',
      priceUSD: '~$17',
      priceINR: '~₹1,400',
      period: '/month',
      description: 'Perfect for cooking enthusiasts',
      features: [
        '5 courses with certification',
        '10 AI recipe generations per day',
        'Basic member badge',
        'Community access',
        'Email support'
      ],
      icon: <Star className="w-8 h-8" />,
      popular: false,
      gradient: 'from-cyan-500 via-blue-500 to-purple-600',
      glowColor: 'rgba(59, 130, 246, 0.5)'
    },
    {
      id: 'premium',
      name: 'Premium Chef',
      priceBTC: '0.00125',
      priceXMR: '0.084',
      priceUSD: '~$50',
      priceINR: '~₹4,200',
      period: '/month',
      description: 'For serious culinary students',
      features: [
        '10 courses with special certifications',
        '25 AI recipe generations per day',
        'High tier badge',
        'Priority community access',
        'Live cooking sessions',
        'Priority email support'
      ],
      icon: <Crown className="w-8 h-8" />,
      popular: true,
      gradient: 'from-orange-500 via-amber-500 to-yellow-400',
      glowColor: 'rgba(245, 158, 11, 0.5)'
    },
    {
      id: 'enterprise',
      name: 'Master Chef',
      priceBTC: '0.00417',
      priceXMR: '0.28',
      priceUSD: '~$167',
      priceINR: '~₹14,000',
      period: '/month',
      description: 'For culinary professionals',
      features: [
        '20 courses with prestigious certifications',
        'Unlimited AI recipe generations',
        'Highest tier badge',
        'Special website mention',
        'Priority recipe & question placement',
        '1-on-1 mentorship sessions',
        'Exclusive masterclasses',
        'Priority support'
      ],
      icon: <Sparkles className="w-8 h-8" />,
      popular: false,
      gradient: 'from-purple-600 via-pink-500 to-rose-500',
      glowColor: 'rgba(168, 85, 247, 0.5)'
    }
  ];

  // Crypto wallet addresses (placeholder - replace with real addresses)
  const walletAddresses = {
    btc: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    xmr: '888tNkZrPN6JsEgekjMnABU4TBzc2Dt29EPAvkRxbANsAnjyPbb3iQ1YBRk1UXcdRsiKc9dhwMVgN5S9cQUiyoogDavup3H'
  };

  const getTierData = (tierId: string) => {
    return membershipTiers.find(t => t.id === tierId);
  };

  const handleSelectPlan = (tierId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to subscribe to a membership plan.",
        variant: "destructive",
      });
      return;
    }
    setSelectedTier(tierId);
    setPaymentModalOpen(true);
  };

  useEffect(() => {
    const tierFromUrl = searchParams.get('tier');
    if (!tierFromUrl) return;

    const isValidTier = membershipTiers.some(t => t.id === tierFromUrl);
    if (isValidTier) {
      handleSelectPlan(tierFromUrl);
    }

    // clean up the URL so refresh/back doesn't keep reopening
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('tier');
      return next;
    }, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, searchParams, setSearchParams]);

  const copyAddress = () => {
    const address = selectedCrypto === 'btc' ? walletAddresses.btc : walletAddresses.xmr;
    navigator.clipboard.writeText(address);
    setCopied(true);
    toast({
      title: "Address Copied!",
      description: "Wallet address copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedTierData = selectedTier ? getTierData(selectedTier) : null;

  return (
    <PageLayout>
      <SEO 
        title="Membership Plans - Pay with Crypto"
        description="Choose the perfect membership plan for your culinary journey. Pay securely with Bitcoin or Monero."
      />
      
      <div className="min-h-screen bg-foreground relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl" />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          {/* Header */}
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 mb-8"
            >
              <BitcoinIcon className="w-5 h-5 text-orange-400" />
              <span className="text-orange-300 font-medium">Crypto Payments Only</span>
              <MoneroIcon className="w-5 h-5 text-orange-400" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-background mb-6 font-playfair">
              <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                Unlock Your
              </span>
              <br />
              <span className="text-background">Culinary Mastery</span>
            </h1>
            
            <p className="text-xl text-background/60 max-w-2xl mx-auto mb-8">
              Join our exclusive community of chefs. Pay securely with Bitcoin or Monero.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 text-background/50">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-sm">Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-sm">Instant Activation</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-sm">24/7 Support</span>
              </div>
            </div>
          </motion.div>

          {/* Membership Plans */}
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {membershipTiers.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 + 0.3 }}
                className="relative group"
              >
                {/* Glow effect */}
                <div 
                  className={`absolute -inset-0.5 bg-gradient-to-r ${tier.gradient} rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-all duration-500`}
                />
                
                <Card className={`relative h-full bg-foreground/80 backdrop-blur-xl border border-background/10 rounded-3xl overflow-hidden transition-all duration-500 hover:border-background/30 ${
                  tier.popular ? 'ring-2 ring-amber-400/50' : ''
                }`}>
                  {/* Popular badge */}
                  {tier.popular && (
                    <div className="absolute -top-px left-1/2 -translate-x-1/2">
                      <div className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-b-xl">
                        <span className="text-sm font-bold text-foreground">MOST POPULAR</span>
                      </div>
                    </div>
                  )}

                  <CardHeader className="text-center pt-12 pb-6">
                    {/* Icon with gradient background */}
                    <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br ${tier.gradient} p-0.5 mb-6`}>
                      <div className="w-full h-full bg-foreground rounded-2xl flex items-center justify-center text-background">
                        {tier.icon}
                      </div>
                    </div>

                    <CardTitle className="text-2xl font-bold text-background font-playfair mb-2">
                      {tier.name}
                    </CardTitle>
                    <CardDescription className="text-background/50">
                      {tier.description}
                    </CardDescription>

                    {/* Pricing */}
                    <div className="mt-6 space-y-2">
                      <div className="flex items-center justify-center gap-3">
                        <BitcoinIcon className="w-6 h-6 text-orange-400" />
                        <span className="text-3xl font-bold text-background">{tier.priceBTC}</span>
                        <span className="text-background/50">BTC</span>
                      </div>
                      <div className="flex items-center justify-center gap-3 text-sm">
                        <MoneroIcon className="w-4 h-4 text-orange-300" />
                        <span className="text-background/70">{tier.priceXMR} XMR</span>
                        <span className="text-background/40">({tier.priceUSD})</span>
                      </div>
                      <span className="text-background/40 text-sm">{tier.period}</span>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6 pb-8">
                    <ul className="space-y-4">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${tier.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <Check className="w-3 h-3 text-foreground" />
                          </div>
                          <span className="text-background/70">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      onClick={() => handleSelectPlan(tier.id)}
                      className={`w-full py-6 rounded-xl font-semibold text-lg transition-all duration-300 bg-gradient-to-r ${tier.gradient} text-foreground hover:opacity-90 hover:scale-[1.02] shadow-lg`}
                      style={{ boxShadow: `0 10px 40px -10px ${tier.glowColor}` }}
                    >
                      {!user ? 'Login to Subscribe' : (
                        <span className="flex items-center justify-center gap-2">
                          Choose Plan <ArrowRight className="w-5 h-5" />
                        </span>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Bottom info */}
          <motion.div
            className="text-center mt-20 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <BitcoinIcon className="w-8 h-8 text-orange-400" />
              <div className="h-px w-16 bg-gradient-to-r from-orange-500/50 to-transparent" />
              <span className="text-background/40 text-lg">Accepted Cryptocurrencies</span>
              <div className="h-px w-16 bg-gradient-to-l from-orange-500/50 to-transparent" />
              <MoneroIcon className="w-8 h-8 text-orange-400" />
            </div>
            <p className="text-background/40 text-sm">
              All payments are processed securely on-chain. Your privacy is our priority.
              <br />
              Transactions typically confirm within 10-30 minutes.
            </p>
          </motion.div>
        </div>

        {/* Payment Modal */}
        <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
          <DialogContent className="bg-foreground border border-background/20 text-background max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-playfair text-background flex items-center gap-3">
                <Wallet className="w-6 h-6 text-orange-400" />
                Complete Your Payment
              </DialogTitle>
              <DialogDescription className="text-background/60">
                Send the exact amount to the wallet address below
              </DialogDescription>
            </DialogHeader>

            {selectedTierData && (
              <div className="space-y-6 pt-4">
                {/* Selected plan summary */}
                <div className={`p-4 rounded-xl bg-gradient-to-r ${selectedTierData.gradient} bg-opacity-10 border border-background/10`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${selectedTierData.gradient} flex items-center justify-center text-foreground`}>
                        {selectedTierData.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-background">{selectedTierData.name}</h4>
                        <p className="text-sm text-background/60">{selectedTierData.period.replace('/', 'per ')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-background">
                        {selectedCrypto === 'btc' ? selectedTierData.priceBTC + ' BTC' : selectedTierData.priceXMR + ' XMR'}
                      </p>
                      <p className="text-sm text-background/50">{selectedTierData.priceUSD} / {selectedTierData.priceINR}</p>
                    </div>
                  </div>
                </div>

                {/* Crypto selector */}
                <Tabs value={selectedCrypto} onValueChange={(v) => setSelectedCrypto(v as 'btc' | 'xmr')}>
                  <TabsList className="w-full bg-background/10 p-1 rounded-xl">
                    <TabsTrigger 
                      value="btc" 
                      className="flex-1 gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-foreground rounded-lg"
                    >
                      <BitcoinIcon className="w-5 h-5" />
                      Bitcoin
                    </TabsTrigger>
                    <TabsTrigger 
                      value="xmr" 
                      className="flex-1 gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-orange-400 data-[state=active]:text-foreground rounded-lg"
                    >
                      <MoneroIcon className="w-5 h-5" />
                      Monero
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="btc" className="mt-6 space-y-4">
                    <div className="text-center">
                      {/* QR placeholder */}
                      <div className="w-48 h-48 mx-auto bg-background rounded-xl p-4 mb-4">
                        <div className="w-full h-full bg-foreground rounded-lg flex items-center justify-center">
                          <QrCode className="w-24 h-24 text-background/30" />
                        </div>
                      </div>
                      <p className="text-sm text-background/50 mb-2">Send exactly:</p>
                      <p className="text-2xl font-bold text-orange-400">{selectedTierData.priceBTC} BTC</p>
                      <p className="text-sm text-background/60 mt-1">{selectedTierData.priceUSD} / {selectedTierData.priceINR}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="xmr" className="mt-6 space-y-4">
                    <div className="text-center">
                      <div className="w-48 h-48 mx-auto bg-background rounded-xl p-4 mb-4">
                        <div className="w-full h-full bg-foreground rounded-lg flex items-center justify-center">
                          <QrCode className="w-24 h-24 text-background/30" />
                        </div>
                      </div>
                      <p className="text-sm text-background/50 mb-2">Send exactly:</p>
                      <p className="text-2xl font-bold text-orange-400">{selectedTierData.priceXMR} XMR</p>
                      <p className="text-sm text-background/60 mt-1">{selectedTierData.priceUSD} / {selectedTierData.priceINR}</p>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Wallet address */}
                <div className="space-y-2">
                  <label className="text-sm text-background/60">Wallet Address:</label>
                  <div className="flex gap-2">
                    <div className="flex-1 p-3 bg-background/5 border border-background/10 rounded-xl overflow-hidden">
                      <p className="text-sm text-background/80 truncate font-mono">
                        {selectedCrypto === 'btc' ? walletAddresses.btc : walletAddresses.xmr}
                      </p>
                    </div>
                    <Button
                      onClick={copyAddress}
                      variant="outline"
                      className="border-background/20 text-background hover:bg-background/10"
                    >
                      {copied ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>

                {/* Instructions */}
                <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                  <h5 className="font-semibold text-orange-300 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Payment Instructions
                  </h5>
                  <ul className="text-sm text-background/60 space-y-1">
                    <li>• Send the exact amount shown above</li>
                    <li>• Payment confirms within 10-30 minutes</li>
                    <li>• Your account will be upgraded automatically</li>
                    <li>• Contact support if payment isn't reflected within 1 hour</li>
                  </ul>
                </div>

                <Button 
                  className="w-full py-6 bg-gradient-to-r from-orange-500 to-amber-500 text-foreground font-semibold rounded-xl"
                  onClick={() => {
                    toast({
                      title: "Payment Submitted",
                      description: "We'll verify your transaction and activate your membership shortly.",
                    });
                    setPaymentModalOpen(false);
                  }}
                >
                  I've Sent the Payment
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
};

export default Membership;
