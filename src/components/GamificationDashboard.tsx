
import { useState, useEffect } from 'react';
import { Trophy, ChefHat, Star, Crown, Clock } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import XPWidget from './gamification/XPWidget';
import WeeklyChallenge from './gamification/WeeklyChallenge';
import BadgesSection from './gamification/BadgesSection';
import Leaderboard from './gamification/Leaderboard';
import AchievementNotification from './gamification/AchievementNotification';

interface UserGamificationData {
  current_xp: number;
  total_xp: number;
  level: number;
}

interface Achievement {
  achievement_type: string;
  achievement_name: string;
  earned_at: string;
}

const GamificationDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userGamification, setUserGamification] = useState<UserGamificationData | null>(null);
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([]);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calculate next level XP requirement
  const nextLevelXP = userGamification ? userGamification.level * 1000 : 1000;
  const xpProgress = userGamification ? (userGamification.current_xp / nextLevelXP) * 100 : 0;

  // Map achievements to badge format
  const userBadges = [
    {
      id: 1,
      name: "Master Chef",
      icon: <ChefHat className="w-4 h-4" />,
      earned: userAchievements.some(a => a.achievement_name === "Master Chef"),
      color: "chef-gold"
    },
    {
      id: 2,
      name: "Recipe Creator",
      icon: <Star className="w-4 h-4" />,
      earned: userAchievements.some(a => a.achievement_name === "Recipe Creator"),
      color: "chef-royal-blue"
    },
    {
      id: 3,
      name: "Challenge Winner",
      icon: <Trophy className="w-4 h-4" />,
      earned: userAchievements.some(a => a.achievement_name === "Challenge Winner"),
      color: "chef-royal-green"
    },
    {
      id: 4,
      name: "Community Leader",
      icon: <Crown className="w-4 h-4" />,
      earned: userAchievements.some(a => a.achievement_name === "Community Leader"),
      color: "chef-gold"
    },
    {
      id: 5,
      name: "Speed Cook",
      icon: <Clock className="w-4 h-4" />,
      earned: userAchievements.some(a => a.achievement_name === "Speed Cook"),
      color: "chef-royal-blue"
    }
  ];

  const weeklyChallenge = {
    title: "Mediterranean Mastery Week",
    description: "Cook 3 Mediterranean dishes this week",
    progress: 2,
    total: 3,
    reward: "500 XP + Mediterranean Chef Badge",
    timeLeft: "3 days"
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        // Fetch user gamification data
        const { data: gamificationData, error: gamificationError } = await supabase
          .from('user_gamification')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (gamificationError && gamificationError.code !== 'PGRST116') {
          console.error('Error fetching gamification data:', gamificationError);
        } else if (gamificationData) {
          setUserGamification(gamificationData);
        } else {
          // Initialize user gamification if doesn't exist
          const { data: newGamificationData, error: insertError } = await supabase
            .from('user_gamification')
            .insert({
              user_id: user.id,
              current_xp: 0,
              total_xp: 0,
              level: 1
            })
            .select()
            .single();

          if (insertError) {
            console.error('Error creating gamification data:', insertError);
          } else {
            setUserGamification(newGamificationData);
          }
        }

        // Fetch user achievements
        const { data: achievementsData, error: achievementsError } = await supabase
          .from('user_achievements')
          .select('*')
          .eq('user_id', user.id);

        if (achievementsError) {
          console.error('Error fetching achievements:', achievementsError);
        } else {
          setUserAchievements(achievementsData || []);
        }

        // Fetch leaderboard data
        const { data: leaderboardResponse, error: leaderboardError } = await supabase
          .from('user_gamification')
          .select(`
            total_xp,
            level,
            user_id,
            profiles!inner(full_name, avatar_url)
          `)
          .order('total_xp', { ascending: false })
          .limit(5);

        if (leaderboardError) {
          console.error('Error fetching leaderboard:', leaderboardError);
        } else {
          const formattedLeaderboard = leaderboardResponse?.map((item, index) => ({
            rank: index + 1,
            name: item.profiles?.full_name || 'Chef User',
            xp: item.total_xp,
            level: item.level,
            avatar: item.profiles?.avatar_url || "/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png",
            isUser: item.user_id === user.id
          })) || [];
          
          setLeaderboardData(formattedLeaderboard);
        }

      } catch (error) {
        console.error('Error in fetchUserData:', error);
        toast({
          title: "Error loading dashboard",
          description: "There was an error loading your gamification data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, toast]);

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-chef-warm-ivory">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chef-royal-blue mx-auto mb-4"></div>
              <p className="text-chef-charcoal">Loading your culinary progress...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!userGamification) {
    return (
      <section className="py-16 md:py-24 bg-chef-warm-ivory">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-chef-charcoal">Unable to load gamification data. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

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
          userLevel={userGamification.level}
          currentXP={userGamification.current_xp}
          nextLevelXP={nextLevelXP}
          xpProgress={xpProgress}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Weekly Challenge */}
          <WeeklyChallenge challenge={weeklyChallenge} />

          {/* Earned Badges */}
          <BadgesSection badges={userBadges} />

          {/* Leaderboard */}
          <Leaderboard users={leaderboardData} />
        </div>

        {/* Achievement Notification */}
        <AchievementNotification />
      </div>
    </section>
  );
};

export default GamificationDashboard;
