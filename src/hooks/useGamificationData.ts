
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

interface WeeklyChallengeData {
  id: string;
  title: string;
  description: string;
  challenge_type: string;
  target_count: number;
  xp_reward: number;
  badge_reward: string | null;
  start_date: string;
  end_date: string;
  current_progress?: number;
}

export const useGamificationData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userGamification, setUserGamification] = useState<UserGamificationData | null>(null);
  const [userAchievements, setUserAchievements] = useState<Achievement[]>([]);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [weeklyChallenge, setWeeklyChallenge] = useState<WeeklyChallengeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAchievement, setShowAchievement] = useState(false);
  const [newAchievement, setNewAchievement] = useState<string>('');
  const [hasTrackedLogin, setHasTrackedLogin] = useState(false);

  // Function to check for new achievements
  const checkForNewAchievements = (currentAchievements: Achievement[], previousAchievements: Achievement[]) => {
    const newAchievements = currentAchievements.filter(current => 
      !previousAchievements.some(prev => 
        prev.achievement_name === current.achievement_name && 
        prev.earned_at === current.earned_at
      )
    );
    
    if (newAchievements.length > 0) {
      const latestAchievement = newAchievements[newAchievements.length - 1];
      setNewAchievement(latestAchievement.achievement_name);
      setShowAchievement(true);
      
      // Trigger achievement event for notification center
      window.dispatchEvent(new CustomEvent('achievementEarned', {
        detail: { achievementName: latestAchievement.achievement_name }
      }));
    }
  };

  const handleDismissAchievement = () => {
    setShowAchievement(false);
    setNewAchievement('');
  };

  // Function to track first login
  const trackFirstLogin = async () => {
    if (!user || hasTrackedLogin) return;
    
    try {
      const { error } = await supabase.rpc('track_first_login', {
        user_id_param: user.id
      });
      
      if (error) {
        console.error('Error tracking first login:', error);
      } else {
        setHasTrackedLogin(true);
      }
    } catch (error) {
      console.error('Error in trackFirstLogin:', error);
    }
  };

  // Function to track course attendance
  const trackCourseAttendance = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase.rpc('track_course_attendance', {
        user_id_param: user.id
      });
      
      if (error) {
        console.error('Error tracking course attendance:', error);
      }
    } catch (error) {
      console.error('Error in trackCourseAttendance:', error);
    }
  };

  // Function to track club joining
  const trackClubJoining = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase.rpc('track_club_joining', {
        user_id_param: user.id
      });
      
      if (error) {
        console.error('Error tracking club joining:', error);
      }
    } catch (error) {
      console.error('Error in trackClubJoining:', error);
    }
  };

  // Function to track news article view
  const trackNewsArticleView = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase.rpc('track_news_article_view', {
        user_id_param: user.id
      });
      
      if (error) {
        console.error('Error tracking news article view:', error);
      }
    } catch (error) {
      console.error('Error in trackNewsArticleView:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        // Store previous achievements for comparison
        const previousAchievements = [...userAchievements];

        // Track first login if not already tracked
        if (!hasTrackedLogin) {
          await trackFirstLogin();
        }

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
          const currentAchievements = achievementsData || [];
          setUserAchievements(currentAchievements);
          
          // Check for new achievements only if this isn't the initial load
          if (previousAchievements.length > 0) {
            checkForNewAchievements(currentAchievements, previousAchievements);
          }
        }

        // Fetch active weekly challenge
        const { data: challengeData, error: challengeError } = await supabase
          .from('weekly_challenges')
          .select('*')
          .eq('is_active', true)
          .gte('end_date', new Date().toISOString().split('T')[0])
          .order('created_at', { ascending: false })
          .limit(1);

        if (challengeError) {
          console.error('Error fetching weekly challenge:', challengeError);
        } else if (challengeData && challengeData.length > 0) {
          const challenge = challengeData[0];
          
          // Fetch user's progress for this challenge
          const { data: progressData, error: progressError } = await supabase
            .from('user_challenge_progress')
            .select('current_progress')
            .eq('user_id', user.id)
            .eq('challenge_id', challenge.id)
            .single();

          if (progressError && progressError.code !== 'PGRST116') {
            console.error('Error fetching challenge progress:', progressError);
          }

          setWeeklyChallenge({
            ...challenge,
            current_progress: progressData?.current_progress || 0
          });
        }

        // Fetch leaderboard data - first get gamification data
        const { data: gamificationLeaderboard, error: leaderboardError } = await supabase
          .from('user_gamification')
          .select('total_xp, level, user_id')
          .order('total_xp', { ascending: false })
          .limit(5);

        if (leaderboardError) {
          console.error('Error fetching leaderboard:', leaderboardError);
        } else if (gamificationLeaderboard) {
          // Now fetch profile data for these users
          const userIds = gamificationLeaderboard.map(item => item.user_id);
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name, username, email, avatar_url')
            .in('id', userIds);

          if (profilesError) {
            console.error('Error fetching profiles:', profilesError);
          }

          // Combine the data
          const formattedLeaderboard = gamificationLeaderboard.map((item, index) => {
            const profile = profilesData?.find(p => p.id === item.user_id);
            
            // Try different name sources in order of preference
            const displayName = profile?.full_name || 
                               profile?.username || 
                               profile?.email?.split('@')[0] || 
                               `Chef ${index + 1}`;
            
            return {
              rank: index + 1,
              name: displayName,
              xp: item.total_xp,
              level: item.level,
              avatar: profile?.avatar_url || "/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png",
              isUser: item.user_id === user.id
            };
          });
          
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
  }, [user, toast, hasTrackedLogin]);

  return {
    userGamification,
    userAchievements,
    leaderboardData,
    weeklyChallenge,
    loading,
    showAchievement,
    newAchievement,
    handleDismissAchievement,
    trackFirstLogin,
    trackCourseAttendance,
    trackClubJoining,
    trackNewsArticleView
  };
};
