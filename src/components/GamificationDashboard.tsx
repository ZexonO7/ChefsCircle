
import { useState } from 'react';
import { Trophy, ChefHat, Star, Crown, Clock } from 'lucide-react';
import XPWidget from './gamification/XPWidget';
import WeeklyChallenge from './gamification/WeeklyChallenge';
import BadgesSection from './gamification/BadgesSection';
import Leaderboard from './gamification/Leaderboard';
import AchievementNotification from './gamification/AchievementNotification';

const GamificationDashboard = () => {
  const [userLevel, setUserLevel] = useState(7);
  const [currentXP, setCurrentXP] = useState(2450);
  const [nextLevelXP] = useState(3000);
  const [totalXP] = useState(12450);

  const xpProgress = currentXP / nextLevelXP * 100;

  const userBadges = [{
    id: 1,
    name: "Master Chef",
    icon: <ChefHat className="w-4 h-4" />,
    earned: true,
    color: "chef-gold"
  }, {
    id: 2,
    name: "Recipe Creator",
    icon: <Star className="w-4 h-4" />,
    earned: true,
    color: "chef-royal-blue"
  }, {
    id: 3,
    name: "Challenge Winner",
    icon: <Trophy className="w-4 h-4" />,
    earned: true,
    color: "chef-royal-green"
  }, {
    id: 4,
    name: "Community Leader",
    icon: <Crown className="w-4 h-4" />,
    earned: false,
    color: "chef-gold"
  }, {
    id: 5,
    name: "Speed Cook",
    icon: <Clock className="w-4 h-4" />,
    earned: false,
    color: "chef-royal-blue"
  }];

  const weeklyChallenge = {
    title: "Mediterranean Mastery Week",
    description: "Cook 3 Mediterranean dishes this week",
    progress: 2,
    total: 3,
    reward: "500 XP + Mediterranean Chef Badge",
    timeLeft: "3 days"
  };

  const leaderboard = [{
    rank: 1,
    name: "Chef Alexandra",
    xp: 15420,
    level: 9,
    avatar: "/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png"
  }, {
    rank: 2,
    name: "Chef Marcus",
    xp: 14230,
    level: 8,
    avatar: "/lovable-uploads/4bfa0d71-3ed2-4693-90b6-35142468907f.png"
  }, {
    rank: 3,
    name: "You",
    xp: totalXP,
    level: userLevel,
    avatar: "/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png",
    isUser: true
  }, {
    rank: 4,
    name: "Chef Sarah",
    xp: 11890,
    level: 7,
    avatar: "/lovable-uploads/4bfa0d71-3ed2-4693-90b6-35142468907f.png"
  }, {
    rank: 5,
    name: "Chef David",
    xp: 10540,
    level: 6,
    avatar: "/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png"
  }];

  return (
    <section className="py-16 md:py-24 bg-chef-warm-ivory">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-chef-royal-blue/20 text-chef-royal-blue rounded-full text-sm font-medium">
            <Trophy className="w-4 h-4" />
            Culinary Journey
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-chef-charcoal font-playfair">
            Your Cooking Progress
          </h2>
          <p className="text-chef-charcoal/70 text-lg max-w-3xl mx-auto font-inter">
            Level up your culinary skills, earn badges, and compete with fellow chefs in our gamified cooking experience.
          </p>
        </div>

        {/* XP & Level Widget */}
        <XPWidget 
          userLevel={userLevel}
          currentXP={currentXP}
          nextLevelXP={nextLevelXP}
          xpProgress={xpProgress}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Weekly Challenge */}
          <WeeklyChallenge challenge={weeklyChallenge} />

          {/* Earned Badges */}
          <BadgesSection badges={userBadges} />

          {/* Leaderboard */}
          <Leaderboard users={leaderboard} />
        </div>

        {/* Achievement Notification */}
        <AchievementNotification />
      </div>
    </section>
  );
};

export default GamificationDashboard;
