import { motion } from 'framer-motion';
import { ArrowRight, Crown, Sparkles, Star, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/components/AuthProvider';

interface MembershipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const membershipTiers = [
  {
    id: 'basic',
    name: 'Basic Chef',
    priceBTC: '0.00042',
    priceXMR: '0.028',
    icon: <Star className="w-5 h-5" />,
    description: 'Perfect for cooking enthusiasts',
    features: ['5 courses with certification', '10 AI recipe generations/day', 'Community access'],
  },
  {
    id: 'premium',
    name: 'Premium Chef',
    priceBTC: '0.00125',
    priceXMR: '0.084',
    icon: <Crown className="w-5 h-5" />,
    description: 'For serious culinary students',
    features: ['10 courses + certifications', '25 AI recipe generations/day', 'Live cooking sessions'],
  },
  {
    id: 'enterprise',
    name: 'Master Chef',
    priceBTC: '0.00417',
    priceXMR: '0.28',
    icon: <Sparkles className="w-5 h-5" />,
    description: 'For culinary professionals',
    features: ['20 courses + masterclasses', 'Unlimited AI recipe generations', '1-on-1 mentorship'],
  },
];

const MembershipModal = ({ isOpen, onClose }: MembershipModalProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const openCryptoPortal = (tierId: string) => {
    onClose();
    navigate(`/membership?tier=${encodeURIComponent(tierId)}`);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="text-2xl font-playfair">Membership</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close membership dialog">
              <X className="w-5 h-5" />
            </Button>
          </div>
          <DialogDescription>
            Crypto-only checkout (Bitcoin or Monero). Card/Stripe payments are disabled.
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-4">
          {membershipTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <Card className="h-full">
                <CardHeader className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      {tier.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{tier.name}</CardTitle>
                      <CardDescription>{tier.description}</CardDescription>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <div className="flex items-baseline justify-between">
                      <span>Bitcoin</span>
                      <span className="font-mono text-foreground">{tier.priceBTC} BTC</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span>Monero</span>
                      <span className="font-mono text-foreground">{tier.priceXMR} XMR</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="mt-0.5">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    onClick={() => openCryptoPortal(tier.id)}
                    variant={user ? 'default' : 'secondary'}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {user ? 'Pay with BTC/XMR' : 'Open payment portal'}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground pt-2">
          Note: the payment portal will prompt you to log in before generating payment instructions.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default MembershipModal;
