
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface WeeklyChallengeProps {
  challenge: {
    title: string;
    description: string;
    progress: number;
    total: number;
    reward: string;
    timeLeft: string;
  };
}

const WeeklyChallenge = ({ challenge }: WeeklyChallengeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="lg:col-span-1"
    >
      <Card className="chef-card h-full bg-inherit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-chef-charcoal">
            <Target className="w-5 h-5 text-chef-royal-green" />
            Weekly Challenge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h4 className="font-bold text-chef-charcoal mb-2">{challenge.title}</h4>
            <p className="text-chef-charcoal/70 text-sm mb-3">{challenge.description}</p>
            
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{challenge.progress}/{challenge.total}</span>
              </div>
              <Progress value={challenge.progress / challenge.total * 100} className="h-2" />
            </div>
            
            <div className="text-sm text-chef-royal-blue font-medium mb-2">
              🎁 {challenge.reward}
            </div>
            <div className="text-sm text-chef-charcoal/60">
              ⏰ {challenge.timeLeft} left
            </div>
          </div>
          
          <Button className="w-full chef-button-primary">
            Join Challenge
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default WeeklyChallenge;
