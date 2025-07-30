import { useState } from "react";
import { Trophy, Clock, Star, CheckCircle, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";

interface ChallengeCardProps {
  challenge: {
    id: string;
    title: string;
    description: string;
    challenge_type: string;
    target_count: number;
    xp_reward: number;
    start_date: string;
    end_date: string;
  };
  userProgress?: {
    current_progress: number;
    completed: boolean;
  };
  onJoin?: () => void;
}

const ChallengeCard = ({ challenge, userProgress, onJoin }: ChallengeCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isJoining, setIsJoining] = useState(false);

  const getDuration = () => {
    const start = new Date(challenge.start_date);
    const end = new Date(challenge.end_date);
    const diffInDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays <= 1) return "24 Hours";
    if (diffInDays <= 3) return "3 Days";
    return "1 Week";
  };

  const getDifficultyColor = () => {
    const difficultyLevel = getDuration();
    if (difficultyLevel === "24 Hours") return "bg-chef-royal-green";
    if (difficultyLevel === "3 Days") return "bg-chef-royal-blue";
    return "bg-chef-gold";
  };

  const getTimeRemaining = () => {
    const end = new Date(challenge.end_date);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return "Expired";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const handleJoinChallenge = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to join challenges.",
        variant: "destructive"
      });
      return;
    }

    setIsJoining(true);
    try {
      // Create user progress record
      const { error } = await supabase
        .from('user_challenge_progress')
        .insert({
          user_id: user.id,
          challenge_id: challenge.id,
          current_progress: 0,
          completed: false
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "Already Joined",
            description: "You're already participating in this challenge!",
            variant: "default"
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Challenge Joined!",
          description: `You've joined "${challenge.title}". Start completing tasks to earn XP!`,
        });
        onJoin?.();
      }
    } catch (error) {
      console.error('Error joining challenge:', error);
      toast({
        title: "Error",
        description: "Failed to join challenge. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsJoining(false);
    }
  };

  const progressPercentage = userProgress 
    ? Math.min((userProgress.current_progress / challenge.target_count) * 100, 100)
    : 0;

  const isExpired = new Date(challenge.end_date) < new Date();
  const isCompleted = userProgress?.completed;
  const isJoined = !!userProgress;

  return (
    <Card className="overflow-hidden border border-chef-charcoal/10 hover:border-chef-royal-green/30 transition-all duration-300 hover:shadow-chef-luxury">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg font-playfair text-chef-charcoal mb-2">
              {challenge.title}
            </CardTitle>
            <p className="text-sm text-chef-charcoal/70 leading-relaxed">
              {challenge.description}
            </p>
          </div>
          {isCompleted && (
            <CheckCircle className="w-6 h-6 text-chef-royal-green flex-shrink-0" />
          )}
        </div>
        
        <div className="flex items-center gap-2 mt-3">
          <Badge 
            variant="secondary" 
            className={`${getDifficultyColor()} text-chef-warm-ivory font-medium`}
          >
            {getDuration()}
          </Badge>
          <Badge variant="outline" className="border-chef-charcoal/20">
            <Trophy className="w-3 h-3 mr-1" />
            {challenge.xp_reward} XP
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {isJoined && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-chef-charcoal/70">Progress</span>
              <span className="font-medium text-chef-charcoal">
                {userProgress?.current_progress || 0} / {challenge.target_count}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-sm text-chef-charcoal/60">
            <Clock className="w-4 h-4" />
            {getTimeRemaining()}
          </div>
          
          <div className="flex items-center gap-1 text-sm text-chef-charcoal/60">
            <Target className="w-4 h-4" />
            {challenge.target_count} tasks
          </div>
        </div>

        {!isJoined && !isExpired && (
          <Button
            onClick={handleJoinChallenge}
            disabled={isJoining}
            className="w-full mt-4 bg-chef-royal-green hover:bg-chef-forest text-chef-warm-ivory"
          >
            {isJoining ? "Joining..." : "Join Challenge"}
          </Button>
        )}

        {isCompleted && (
          <div className="mt-4 p-3 bg-chef-royal-green/10 border border-chef-royal-green/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-chef-royal-green" />
              <span className="text-sm font-medium text-chef-royal-green">
                Challenge Completed! +{challenge.xp_reward} XP earned
              </span>
            </div>
          </div>
        )}

        {isExpired && !isJoined && (
          <div className="mt-4 p-3 bg-chef-charcoal/5 border border-chef-charcoal/10 rounded-lg">
            <span className="text-sm text-chef-charcoal/60">Challenge Expired</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChallengeCard;