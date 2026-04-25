
import XPWidget from './gamification/XPWidget';
import WeeklyChallenge from './gamification/WeeklyChallenge';
import BadgesSection from './gamification/BadgesSection';
import Leaderboard from './gamification/Leaderboard';
import AchievementNotification from './gamification/AchievementNotification';
import GamificationHeader from './gamification/GamificationHeader';
import LoadingState from './gamification/LoadingState';
import ErrorState from './gamification/ErrorState';
import { useGamificationData } from '@/hooks/useGamificationData';
import { 
  mapAchievementsToBadges, 
  calculateNextLevelXP, 
  calculateXPProgress, 
  formatChallengeData 
} from '@/utils/gamificationHelpers';

const GamificationDashboard = () => {
  const {
    userGamification,
    userAchievements,
    leaderboardData,
    weeklyChallenge,
    loading,
    showAchievement,
    newAchievement,
    handleDismissAchievement
  } = useGamificationData();

  if (loading) {
    return <LoadingState />;
  }

  if (!userGamification) {
    return <ErrorState />;
  }

  // Calculate XP progress
  const nextLevelXP = calculateNextLevelXP(userGamification.level);
  const xpProgress = calculateXPProgress(userGamification.current_xp, nextLevelXP);

  // Map achievements to badge format
  const userBadges = mapAchievementsToBadges(userAchievements);

  // Format challenge data
  const formattedChallenge = formatChallengeData(weeklyChallenge);

  return (
    <section className="relative py-16 sm:py-20 md:py-24 lg:py-32 bg-background overflow-hidden">
      {/* Subtle ambient gold glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 w-[50rem] h-[50rem] rounded-full opacity-[0.04] blur-3xl"
        style={{ background: 'var(--gradient-gold)' }}
      />

      <div className="relative container mx-auto px-3 sm:px-4 lg:px-8">
        <GamificationHeader />

        {/* XP & Level Widget */}
        <XPWidget 
          userLevel={userGamification.level}
          currentXP={userGamification.current_xp}
          nextLevelXP={nextLevelXP}
          xpProgress={xpProgress}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12">
          {/* Weekly Challenge */}
          <WeeklyChallenge />

          {/* Earned Badges */}
          <BadgesSection badges={userBadges} />

          {/* Leaderboard */}
          <Leaderboard users={leaderboardData} />
        </div>

        {/* Achievement Notification */}
        <AchievementNotification 
          isVisible={showAchievement}
          achievementName={newAchievement}
          onDismiss={handleDismissAchievement}
        />
      </div>
    </section>
  );
};

export default GamificationDashboard;
