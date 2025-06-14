
interface Achievement {
  achievement_type: string;
  achievement_name: string;
  earned_at: string;
}

export const mapAchievementsToBadges = (userAchievements: Achievement[]) => {
  return [
    {
      id: 1,
      name: "Welcome Chef",
      iconName: "ChefHat" as const,
      earned: userAchievements.some(a => a.achievement_name === "Welcome Chef"),
      color: "chef-gold"
    },
    {
      id: 2,
      name: "Profile Master",
      iconName: "Star" as const,
      earned: userAchievements.some(a => a.achievement_name === "Profile Master"),
      color: "chef-royal-blue"
    },
    {
      id: 3,
      name: "Recipe Creator",
      iconName: "Trophy" as const,
      earned: userAchievements.some(a => a.achievement_name === "Recipe Creator"),
      color: "chef-royal-green"
    },
    {
      id: 4,
      name: "Master Chef",
      iconName: "Crown" as const,
      earned: userAchievements.some(a => a.achievement_name === "Master Chef"),
      color: "chef-gold"
    },
    {
      id: 5,
      name: "Community Leader",
      iconName: "Clock" as const,
      earned: userAchievements.some(a => a.achievement_name === "Community Leader"),
      color: "chef-royal-blue"
    },
    {
      id: 6,
      name: "Challenge Winner",
      iconName: "Trophy" as const,
      earned: userAchievements.some(a => a.achievement_name === "Challenge Winner"),
      color: "chef-royal-green"
    }
  ];
};

export const calculateNextLevelXP = (level: number) => level * 1000;

export const calculateXPProgress = (currentXP: number, nextLevelXP: number) => 
  (currentXP / nextLevelXP) * 100;

export const calculateTimeLeft = (endDate: string) => {
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 0) return "Challenge ended";
  if (diffDays === 1) return "1 day left";
  return `${diffDays} days left`;
};

export const formatChallengeData = (weeklyChallenge: any) => {
  if (!weeklyChallenge) {
    return {
      title: "No Active Challenge",
      description: "Check back soon for new challenges!",
      progress: 0,
      total: 1,
      reward: "Stay tuned",
      timeLeft: "Coming soon"
    };
  }

  return {
    title: weeklyChallenge.title,
    description: weeklyChallenge.description,
    progress: weeklyChallenge.current_progress || 0,
    total: weeklyChallenge.target_count,
    reward: `${weeklyChallenge.xp_reward} XP${weeklyChallenge.badge_reward ? ' + ' + weeklyChallenge.badge_reward + ' Badge' : ''}`,
    timeLeft: calculateTimeLeft(weeklyChallenge.end_date)
  };
};
