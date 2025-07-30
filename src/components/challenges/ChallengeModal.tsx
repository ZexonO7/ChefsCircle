import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import ChallengeCard from "./ChallengeCard";
import { Loader2 } from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  challenge_type: string;
  target_count: number;
  xp_reward: number;
  start_date: string;
  end_date: string;
}

interface UserProgress {
  challenge_id: string;
  current_progress: number;
  completed: boolean;
}

interface ChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChallengeModal = ({ isOpen, onClose }: ChallengeModalProps) => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChallenges = async () => {
    try {
      const { data: challengesData, error: challengesError } = await supabase
        .from('weekly_challenges')
        .select('*')
        .eq('is_active', true)
        .order('xp_reward', { ascending: true });

      if (challengesError) throw challengesError;
      setChallenges(challengesData || []);

      if (user) {
        const { data: progressData, error: progressError } = await supabase
          .from('user_challenge_progress')
          .select('challenge_id, current_progress, completed')
          .eq('user_id', user.id);

        if (progressError) throw progressError;
        setUserProgress(progressData || []);
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchChallenges();
    }
  }, [isOpen, user]);

  const categorizeByDuration = (challenges: Challenge[]) => {
    const now = new Date();
    return challenges.reduce((acc, challenge) => {
      const start = new Date(challenge.start_date);
      const end = new Date(challenge.end_date);
      const diffInDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffInDays <= 1) {
        acc.daily.push(challenge);
      } else if (diffInDays <= 3) {
        acc.threeDays.push(challenge);
      } else {
        acc.weekly.push(challenge);
      }
      return acc;
    }, { daily: [] as Challenge[], threeDays: [] as Challenge[], weekly: [] as Challenge[] });
  };

  const getUserProgressForChallenge = (challengeId: string) => {
    return userProgress.find(p => p.challenge_id === challengeId);
  };

  const categorizedChallenges = categorizeByDuration(challenges);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-chef-warm-ivory border border-chef-royal-green/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-playfair text-chef-charcoal">
            Join Cooking Challenges
          </DialogTitle>
          <p className="text-chef-charcoal/70">
            Complete challenges to earn XP, unlock badges, and improve your culinary skills!
          </p>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12 bg-chef-warm-ivory">
            <Loader2 className="w-8 h-8 animate-spin text-chef-royal-green" />
          </div>
        ) : (
          <Tabs defaultValue="daily" className="w-full bg-chef-warm-ivory">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-chef-charcoal/5 border border-chef-charcoal/10">
              <TabsTrigger value="daily" className="text-sm data-[state=active]:bg-chef-royal-green data-[state=active]:text-chef-warm-ivory">
                24 Hours ({categorizedChallenges.daily.length})
              </TabsTrigger>
              <TabsTrigger value="threeDays" className="text-sm data-[state=active]:bg-chef-royal-blue data-[state=active]:text-chef-warm-ivory">
                3 Days ({categorizedChallenges.threeDays.length})
              </TabsTrigger>
              <TabsTrigger value="weekly" className="text-sm data-[state=active]:bg-chef-gold data-[state=active]:text-chef-charcoal">
                Weekly ({categorizedChallenges.weekly.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="space-y-4 bg-chef-warm-ivory">
              <div className="grid gap-4 md:grid-cols-2">
                {categorizedChallenges.daily.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    userProgress={getUserProgressForChallenge(challenge.id)}
                    onJoin={fetchChallenges}
                  />
                ))}
              </div>
              {categorizedChallenges.daily.length === 0 && (
                <div className="text-center bg-chef-warm-ivory border border-chef-charcoal/10 rounded-lg py-8">
                  <p className="text-chef-charcoal/60">
                    No 24-hour challenges available at the moment.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="threeDays" className="space-y-4 bg-chef-warm-ivory">
              <div className="grid gap-4 md:grid-cols-2">
                {categorizedChallenges.threeDays.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    userProgress={getUserProgressForChallenge(challenge.id)}
                    onJoin={fetchChallenges}
                  />
                ))}
              </div>
              {categorizedChallenges.threeDays.length === 0 && (
                <div className="text-center bg-chef-warm-ivory border border-chef-charcoal/10 rounded-lg py-8">
                  <p className="text-chef-charcoal/60">
                    No 3-day challenges available at the moment.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="weekly" className="space-y-4 bg-chef-warm-ivory">
              <div className="grid gap-4 md:grid-cols-2">
                {categorizedChallenges.weekly.map((challenge) => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    userProgress={getUserProgressForChallenge(challenge.id)}
                    onJoin={fetchChallenges}
                  />
                ))}
              </div>
              {categorizedChallenges.weekly.length === 0 && (
                <div className="text-center bg-chef-warm-ivory border border-chef-charcoal/10 rounded-lg py-8">
                  <p className="text-chef-charcoal/60">
                    No weekly challenges available at the moment.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ChallengeModal;