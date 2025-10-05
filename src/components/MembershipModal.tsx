import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Star, Sparkles, Badge as BadgeIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
interface SubscriptionStatus {
  subscribed: boolean;
  subscription_tier: string | null;
  subscription_end: string | null;
}
interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const MembershipModal = ({
  isOpen,
  onClose
}: MembershipModalProps) => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    subscribed: false,
    subscription_tier: null,
    subscription_end: null
  });
  const membershipTiers = [{
    id: 'basic',
    name: 'Basic Chef',
    price: '₹500',
    period: '/month',
    description: 'Perfect for cooking enthusiasts',
    features: ['5 courses with certification', '10 AI recipe generations per day', 'Basic member badge', 'Community access', 'Email support'],
    icon: <Star className="w-5 h-5" />,
    popular: false,
    gradient: 'from-blue-500 to-blue-600'
  }, {
    id: 'premium',
    name: 'Premium Chef',
    price: '₹1,500',
    period: '/month',
    description: 'For serious culinary students',
    features: ['10 courses with special certifications', '25 AI recipe generations per day', 'High tier badge', 'Priority community access', 'Live cooking sessions', 'Priority email support'],
    icon: <Crown className="w-5 h-5" />,
    popular: true,
    gradient: 'from-purple-500 to-pink-600'
  }, {
    id: 'enterprise',
    name: 'Master Chef',
    price: '₹5,000',
    period: '/month',
    description: 'For culinary professionals',
    features: ['20 courses with prestigious certifications', 'Unlimited AI recipe generations', 'Highest tier badge', 'Special website mention', 'Priority recipe & question placement', '1-on-1 mentorship sessions', 'Exclusive masterclasses', 'Phone support'],
    icon: <Sparkles className="w-5 h-5" />,
    popular: false,
    gradient: 'from-yellow-500 to-orange-600'
  }];
  const checkSubscriptionStatus = async () => {
    if (!user) return;
    try {
      setCheckingStatus(true);
      const {
        data,
        error
      } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      setSubscriptionStatus(data);
    } catch (error) {
      console.error('Error checking subscription:', error);
      toast({
        title: "Error",
        description: "Failed to check subscription status",
        variant: "destructive"
      });
    } finally {
      setCheckingStatus(false);
    }
  };
  const handleSubscribe = async (tier: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to subscribe to a membership plan.",
        variant: "destructive"
      });
      return;
    }
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('create-checkout', {
        body: {
          tier
        }
      });
      if (error) throw error;

      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleManageSubscription = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;

      // Open customer portal in a new tab
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open customer portal. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user && isOpen) {
      checkSubscriptionStatus();
    }
  }, [user, isOpen]);
  const getCurrentTierData = () => {
    if (!subscriptionStatus.subscription_tier) return null;
    return membershipTiers.find(tier => tier.id === subscriptionStatus.subscription_tier);
  };
  const currentTier = getCurrentTierData();
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-chef-warm-ivory border border-chef-royal-green/20">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-playfair text-chef-charcoal">
              Membership Plans
            </DialogTitle>
            
          </div>
          <p className="text-chef-charcoal/70">
            Choose the perfect membership plan for your culinary journey.
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Subscription Status */}
          {user && !checkingStatus && <Card className="bg-chef-warm-ivory border border-chef-royal-green/20">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <BadgeIcon className="w-5 h-5" />
                  Current Membership Status
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                {subscriptionStatus.subscribed && currentTier ? <div className="space-y-4">
                    <Badge variant="default" className="text-lg px-4 py-2 bg-chef-royal-green text-chef-warm-ivory">
                      {currentTier.name} Member
                    </Badge>
                    <p className="text-chef-charcoal/70">
                      Your subscription is active until{' '}
                      {subscriptionStatus.subscription_end && new Date(subscriptionStatus.subscription_end).toLocaleDateString()}
                    </p>
                    <Button onClick={handleManageSubscription} disabled={loading} className="bg-chef-royal-green hover:bg-chef-forest text-chef-warm-ivory">
                      Manage Subscription
                    </Button>
                  </div> : <div className="space-y-4">
                    <Badge variant="outline" className="text-lg px-4 py-2 border-chef-charcoal/30 text-chef-charcoal">
                      Free Member
                    </Badge>
                    <p className="text-chef-charcoal/70">
                      Upgrade to unlock premium features and enhance your culinary journey.
                    </p>
                  </div>}
              </CardContent>
            </Card>}

          {/* Membership Plans */}
          <div className="grid md:grid-cols-3 gap-4">
            {membershipTiers.map((tier, index) => <motion.div key={tier.id} initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: index * 0.1
          }} className="relative">
                <Card className={`h-full border-2 transition-all duration-300 hover:shadow-xl bg-chef-warm-ivory ${tier.popular ? 'border-chef-gold shadow-lg scale-105' : 'border-chef-charcoal/20 hover:border-chef-royal-green/40'} ${currentTier?.id === tier.id ? 'ring-2 ring-chef-gold bg-chef-gold/5' : ''}`}>
                  {tier.popular && <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-chef-gold text-chef-charcoal font-semibold px-3 py-1">
                        Most Popular
                      </Badge>
                    </div>}
                  
                  <CardHeader className="text-center pb-4">
                    <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${tier.gradient} flex items-center justify-center text-white mb-3`}>
                      {tier.icon}
                    </div>
                    <CardTitle className="text-xl font-playfair text-chef-charcoal">
                      {tier.name}
                    </CardTitle>
                    <CardDescription className="text-chef-charcoal/60 text-sm">
                      {tier.description}
                    </CardDescription>
                    <div className="text-3xl font-bold text-chef-charcoal mt-2">
                      {tier.price}
                      <span className="text-sm font-normal text-chef-charcoal/60">
                        {tier.period}
                      </span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {tier.features.map((feature, featureIndex) => <li key={featureIndex} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-chef-royal-green mt-0.5 flex-shrink-0" />
                          <span className="text-chef-charcoal/80">{feature}</span>
                        </li>)}
                    </ul>
                    
                    <div className="pt-2">
                      {currentTier?.id === tier.id ? <Button variant="outline" className="w-full border-chef-gold text-chef-gold hover:bg-chef-gold hover:text-chef-charcoal text-sm" disabled>
                          Current Plan
                        </Button> : <Button onClick={() => handleSubscribe(tier.id)} disabled={loading || !user} className={`w-full text-sm ${tier.popular ? 'bg-chef-gold hover:bg-chef-gold/90 text-chef-charcoal font-medium' : 'bg-chef-royal-green hover:bg-chef-forest text-chef-warm-ivory'}`}>
                          {!user ? 'Login to Subscribe' : 'Choose This Plan'}
                        </Button>}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>)}
          </div>

          {/* Additional Info */}
          <div className="text-center text-sm text-chef-charcoal/60 space-y-2 pt-4">
            <p>All memberships include access to our vibrant community, regular content updates, and our satisfaction guarantee.</p>
            <p className="text-xs">Memberships are billed monthly and can be canceled anytime. No setup fees or hidden charges.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
};
export default MembershipModal;