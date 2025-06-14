
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect } from 'react';

interface AchievementNotificationProps {
  isVisible: boolean;
  achievementName: string;
  onDismiss: () => void;
}

const AchievementNotification = ({ isVisible, achievementName, onDismiss }: AchievementNotificationProps) => {
  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 100 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.9, x: 100 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-6 right-6 z-50 md:block hidden"
        >
          <Card className="chef-card bg-gradient-to-r from-chef-royal-green to-chef-green-light text-white shadow-chef-luxury">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-chef-gold rounded-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-chef-charcoal" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">Achievement Unlocked!</p>
                  <p className="text-xs text-white/90">{achievementName} Badge Earned</p>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-white hover:text-chef-royal-green hover:bg-white/10 p-1 h-auto"
                  onClick={onDismiss}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AchievementNotification;
