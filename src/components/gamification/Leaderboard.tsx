
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LeaderboardUser {
  rank: number;
  name: string;
  xp: number;
  level: number;
  avatar: string;
  isUser?: boolean;
}

interface LeaderboardProps {
  users: LeaderboardUser[];
}

const Leaderboard = ({ users }: LeaderboardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="lg:col-span-1"
    >
      <Card className="chef-card h-full bg-inherit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-chef-charcoal">
            <Users className="w-5 h-5 text-chef-royal-blue" />
            Weekly Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.rank}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  user.isUser 
                    ? 'bg-chef-royal-blue/20 border border-chef-royal-blue/30' 
                    : 'bg-chef-warm-ivory/50'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  user.rank === 1 
                    ? 'bg-chef-gold text-chef-charcoal' 
                    : user.rank === 2 
                    ? 'bg-gray-400 text-white' 
                    : user.rank === 3 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-chef-royal-blue/20 text-chef-royal-blue'
                }`}>
                  {user.rank}
                </div>
                
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-8 h-8 rounded-full object-cover" 
                />
                
                <div className="flex-1">
                  <p className={`font-medium text-sm ${
                    user.isUser ? 'text-chef-royal-blue' : 'text-chef-charcoal'
                  }`}>
                    {user.name}
                  </p>
                  <p className="text-xs text-chef-charcoal/60">
                    Level {user.level} • {user.xp.toLocaleString()} XP
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="outline" className="w-full mt-4 chef-button-outline text-sm bg-inherit">
            View Full Leaderboard
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Leaderboard;
