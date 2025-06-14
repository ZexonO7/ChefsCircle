
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface XPWidgetProps {
  userLevel: number;
  currentXP: number;
  nextLevelXP: number;
  xpProgress: number;
}

const XPWidget = ({ userLevel, currentXP, nextLevelXP, xpProgress }: XPWidgetProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <Card className="chef-card-luxury bg-gradient-to-br from-chef-royal-blue to-chef-blue-light text-white overflow-hidden">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-6 md:mb-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-chef-gold rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-chef-charcoal" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-playfair">Level {userLevel}</h3>
                  <p className="text-white/80">Culinary Enthusiast</p>
                </div>
              </div>
              <p className="text-white/90">{currentXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP</p>
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="mb-2 flex justify-between text-sm">
                <span>Progress to Level {userLevel + 1}</span>
                <span>{Math.round(xpProgress)}%</span>
              </div>
              <Progress value={xpProgress} className="h-3 bg-white/20" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default XPWidget;
