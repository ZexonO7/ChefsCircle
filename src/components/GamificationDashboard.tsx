
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Award, Target, Users, ChefHat, Crown, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const GamificationDashboard = () => {
  const [userLevel, setUserLevel] = useState(7);
  const [currentXP, setCurrentXP] = useState(2450);
  const [nextLevelXP] = useState(3000);
  const [totalXP] = useState(12450);

  const xpProgress = (currentXP / nextLevelXP) * 100;

  const userBadges = [
    { id: 1, name: "Master Chef", icon: <ChefHat className="w-4 h-4" />, earned: true, color: "chef-gold" },
    { id: 2, name: "Recipe Creator", icon: <Star className="w-4 h-4" />, earned: true, color: "chef-royal-blue" },
    { id: 3, name: "Challenge Winner", icon: <Trophy className="w-4 h-4" />, earned: true, color: "chef-royal-green" },
    { id: 4, name: "Community Leader", icon: <Crown className="w-4 h-4" />, earned: false, color: "chef-gold" },
    { id: 5, name: "Speed Cook", icon: <Clock className="w-4 h-4" />, earned: false, color: "chef-royal-blue" },
  ];

  const weeklyChallenge = {
    title: "Mediterranean Mastery Week",
    description: "Cook 3 Mediterranean dishes this week",
    progress: 2,
    total: 3,
    reward: "500 XP + Mediterranean Chef Badge",
    timeLeft: "3 days"
  };

  const leaderboard = [
    { rank: 1, name: "Chef Alexandra", xp: 15420, level: 9, avatar: "/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png" },
    { rank: 2, name: "Chef Marcus", xp: 14230, level: 8, avatar: "/lovable-uploads/4bfa0d71-3ed2-4693-90b6-35142468907f.png" },
    { rank: 3, name: "You", xp: totalXP, level: userLevel, avatar: "/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png", isUser: true },
    { rank: 4, name: "Chef Sarah", xp: 11890, level: 7, avatar: "/lovable-uploads/4bfa0d71-3ed2-4693-90b6-35142468907f.png" },
    { rank: 5, name: "Chef David", xp: 10540, level: 6, avatar: "/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png" },
  ];

  const earnedBadges = userBadges.filter(badge => badge.earned);
  const availableBadges = userBadges.filter(badge => !badge.earned);

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Weekly Challenge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="chef-card h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-chef-charcoal">
                  <Target className="w-5 h-5 text-chef-royal-green" />
                  Weekly Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h4 className="font-bold text-chef-charcoal mb-2">{weeklyChallenge.title}</h4>
                  <p className="text-chef-charcoal/70 text-sm mb-3">{weeklyChallenge.description}</p>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{weeklyChallenge.progress}/{weeklyChallenge.total}</span>
                    </div>
                    <Progress value={(weeklyChallenge.progress / weeklyChallenge.total) * 100} className="h-2" />
                  </div>
                  
                  <div className="text-sm text-chef-royal-blue font-medium mb-2">
                    🎁 {weeklyChallenge.reward}
                  </div>
                  <div className="text-sm text-chef-charcoal/60">
                    ⏰ {weeklyChallenge.timeLeft} left
                  </div>
                </div>
                
                <Button className="w-full chef-button-primary">
                  Join Challenge
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Earned Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="chef-card h-full">
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
                        {badge.icon}
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

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-1"
          >
            <Card className="chef-card h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-chef-charcoal">
                  <Users className="w-5 h-5 text-chef-royal-blue" />
                  Weekly Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((user) => (
                    <div
                      key={user.rank}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        user.isUser 
                          ? 'bg-chef-royal-blue/20 border border-chef-royal-blue/30' 
                          : 'bg-chef-warm-ivory/50'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        user.rank === 1 ? 'bg-chef-gold text-chef-charcoal' :
                        user.rank === 2 ? 'bg-gray-400 text-white' :
                        user.rank === 3 ? 'bg-amber-600 text-white' :
                        'bg-chef-royal-blue/20 text-chef-royal-blue'
                      }`}>
                        {user.rank}
                      </div>
                      
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      
                      <div className="flex-1">
                        <p className={`font-medium text-sm ${user.isUser ? 'text-chef-royal-blue' : 'text-chef-charcoal'}`}>
                          {user.name}
                        </p>
                        <p className="text-xs text-chef-charcoal/60">
                          Level {user.level} • {user.xp.toLocaleString()} XP
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full mt-4 chef-button-outline text-sm">
                  View Full Leaderboard
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Achievement Notification (Sample) */}
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
                <Button size="sm" variant="outline" className="text-white border-white hover:bg-white hover:text-chef-royal-green">
                  Claim Reward
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default GamificationDashboard;
