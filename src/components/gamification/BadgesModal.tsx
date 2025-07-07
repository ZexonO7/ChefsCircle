import { motion } from 'framer-motion';
import { X, Award, ChefHat, Star, Trophy, Crown, Users, BookOpen, Sparkles, Newspaper } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface BadgeData {
  id: number;
  name: string;
  iconName: string;
  earned: boolean;
  color: string;
  description: string;
  requirement: string;
}

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  badges: BadgeData[];
}

const BadgesModal = ({ isOpen, onClose, badges }: BadgesModalProps) => {
  const getIcon = (iconName: string) => {
    const iconProps = { className: "w-6 h-6" };
    switch (iconName) {
      case 'ChefHat': return <ChefHat {...iconProps} />;
      case 'Star': return <Star {...iconProps} />;
      case 'Trophy': return <Trophy {...iconProps} />;
      case 'Crown': return <Crown {...iconProps} />;
      case 'Users': return <Users {...iconProps} />;
      case 'BookOpen': return <BookOpen {...iconProps} />;
      case 'Sparkles': return <Sparkles {...iconProps} />;
      case 'Newspaper': return <Newspaper {...iconProps} />;
      default: return <Star {...iconProps} />;
    }
  };

  const earnedBadges = badges.filter(badge => badge.earned);
  const unearnedBadges = badges.filter(badge => !badge.earned);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-chef-warm-ivory">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-chef-charcoal">
            <Award className="w-6 h-6 text-chef-gold" />
            All Badges ({earnedBadges.length}/{badges.length})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* Earned Badges */}
          <div>
            <h3 className="text-xl font-semibold text-chef-charcoal mb-4">
              Earned Badges ({earnedBadges.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {earnedBadges.map((badge) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`p-4 rounded-xl bg-${badge.color}/20 border border-${badge.color}/30 text-center`}
                >
                  <div className={`w-12 h-12 mx-auto mb-3 text-${badge.color} flex items-center justify-center`}>
                    {getIcon(badge.iconName)}
                  </div>
                  <h4 className="font-semibold text-chef-charcoal mb-2">{badge.name}</h4>
                  <p className="text-sm text-chef-charcoal/70 mb-2">{badge.description}</p>
                  <Badge variant="secondary" className="text-xs bg-chef-royal-green/20 text-chef-royal-green">
                    Completed
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Available Badges */}
          <div>
            <h3 className="text-xl font-semibold text-chef-charcoal mb-4">
              Available Badges ({unearnedBadges.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {unearnedBadges.map((badge) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 rounded-xl bg-chef-charcoal/10 border border-chef-charcoal/20 text-center opacity-60"
                >
                  <div className="w-12 h-12 mx-auto mb-3 text-chef-charcoal/50 flex items-center justify-center">
                    {getIcon(badge.iconName)}
                  </div>
                  <h4 className="font-semibold text-chef-charcoal mb-2">{badge.name}</h4>
                  <p className="text-sm text-chef-charcoal/70 mb-2">{badge.description}</p>
                  <p className="text-xs text-chef-charcoal/60 mb-2">{badge.requirement}</p>
                  <Badge variant="outline" className="text-xs">
                    Locked
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BadgesModal;