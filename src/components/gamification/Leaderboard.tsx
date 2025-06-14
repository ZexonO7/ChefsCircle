
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
  // Updated with realistic leaderboard data
  const defaultUsers: LeaderboardUser[] = [
    {
      rank: 1,
      name: "Chef Marcus",
      xp: 12450,
      level: 12,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      isUser: false
    },
    {
      rank: 2,
      name: "Sarah Bakes",
      xp: 11280,
      level: 11,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c77c?w=150&h=150&fit=crop&crop=face",
      isUser: false
    },
    {
      rank: 3,
      name: "Kitchen Master",
      xp: 10950,
      level: 11,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      isUser: false
    },
    {
      rank: 4,
      name: "You",
      xp: 8750,
      level: 9,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
      isUser: true
    },
    {
      rank: 5,
      name: "Pasta Pro",
      xp: 7820,
      level: 8,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      isUser: false
    }
  ];

  const displayUsers = users.length > 0 ? users : defaultUsers;

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
            {displayUsers.map((user) => (
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
          
          <Button variant="outline" className="w-full mt-4 chef-button-outline text-sm bg-inherit text-inherit">
            View Full Leaderboard
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Leaderboard;
