
import { motion } from 'framer-motion';
import { Award, ChefHat, Star, Trophy, Crown, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Badge {
  id: number;
  name: string;
  iconName: string;
  earned: boolean;
  color: string;
}

interface BadgesSectionProps {
  badges: Badge[];
}

const BadgesSection = ({ badges }: BadgesSectionProps) => {
  const earnedBadges = badges.filter(badge => badge.earned);
  const availableBadges = badges.filter(badge => !badge.earned);

  const getIcon = (iconName: string) => {
    const iconProps = { className: "w-4 h-4" };
    switch (iconName) {
      case 'ChefHat':
        return <ChefHat {...iconProps} />;
      case 'Star':
        return <Star {...iconProps} />;
      case 'Trophy':
        return <Trophy {...iconProps} />;
      case 'Crown':
        return <Crown {...iconProps} />;
      case 'Clock':
        return <Clock {...iconProps} />;
      default:
        return <Star {...iconProps} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="lg:col-span-1"
    >
      <Card className="chef-card h-full bg-inherit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-chef-charcoal">
            <Award className="w-5 h-5 text-chef-gold" />
            Your Badges ({earnedBadges.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {earnedBadges.map((badge) => (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.05 }}
                className={`p-3 rounded-lg bg-${badge.color}/20 text-center border border-${badge.color}/30`}
              >
                <div className={`w-8 h-8 mx-auto mb-2 text-${badge.color} flex items-center justify-center`}>
                  {getIcon(badge.iconName)}
                </div>
                <p className="text-xs font-medium text-chef-charcoal">{badge.name}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-sm text-chef-charcoal/60 mb-3">
              {availableBadges.length} more badges to unlock
            </p>
            <Button variant="outline" className="chef-button-outline text-sm">
              View All Badges
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BadgesSection;
