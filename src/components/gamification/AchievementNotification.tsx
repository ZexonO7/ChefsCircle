
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const AchievementNotification = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="fixed bottom-6 right-6 z-50 md:block hidden"
    >
      <Card className="chef-card bg-gradient-to-r from-chef-royal-green to-chef-green-light text-white shadow-chef-luxury">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-chef-gold rounded-full flex items-center justify-center">
              <Trophy className="w-5 h-5 text-chef-charcoal" />
            </div>
            <div>
              <p className="font-bold text-sm">Achievement Unlocked!</p>
              <p className="text-xs text-white/90">Recipe Creator Badge Earned</p>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="text-white border-white hover:text-chef-royal-green bg-[0] bg-chef-cream"
            >
              Claim Reward
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AchievementNotification;
