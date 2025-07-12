import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle, Trophy, Star, Crown, ChefHat, Clock } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from '@/hooks/use-toast';
interface Notification {
  id: string;
  type: string;
  content: string;
  seen: boolean;
  created_at: string;
  user_id: string;
}
const NotificationBell = () => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Fetch regular notifications
      const {
        data: regularNotifications,
        error: notificationsError
      } = await supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', {
        ascending: false
      });
      if (notificationsError) {
        console.error('Error fetching notifications:', notificationsError);
        toast({
          title: "Error",
          description: "Could not fetch notifications.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Fetch recent achievements to create achievement notifications
      const {
        data: achievements,
        error: achievementsError
      } = await supabase.from('user_achievements').select('*').eq('user_id', user.id).order('earned_at', {
        ascending: false
      }).limit(10); // Get last 10 achievements

      if (achievementsError) {
        console.error('Error fetching achievements:', achievementsError);
      }

      // Combine notifications and create achievement notifications
      const allNotifications = [...(regularNotifications || [])];

      // Add achievement notifications (treat them as unseen notifications for display)
      if (achievements) {
        const achievementNotifications = achievements.map(achievement => ({
          id: `achievement_${achievement.id}`,
          type: 'achievement',
          content: `🏆 Achievement Unlocked: ${achievement.achievement_name}! (+${achievement.xp_awarded} XP)`,
          seen: false,
          // Always show as unseen for visual impact
          created_at: achievement.earned_at,
          user_id: user.id // Add the missing user_id property
        }));
        allNotifications.push(...achievementNotifications);
      }

      // Sort all notifications by creation date
      allNotifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setNotifications(allNotifications);
    } catch (error) {
      console.error('Error in fetchNotifications:', error);
      toast({
        title: "Error",
        description: "Could not fetch notifications.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line
  }, [user]);

  // Listen for achievement updates
  useEffect(() => {
    const handleAchievementUpdate = () => {
      console.log('NotificationBell: Achievement update event received');
      fetchNotifications();
    };
    window.addEventListener('achievementEarned', handleAchievementUpdate);
    return () => window.removeEventListener('achievementEarned', handleAchievementUpdate);
  }, []);

  // Mark regular notifications as seen when dropdown is opened
  useEffect(() => {
    if (!open || !user) return;
    const regularNotifications = notifications.filter(n => n.type !== 'achievement' && !n.seen);
    const unseenIds = regularNotifications.map(n => n.id);
    if (unseenIds.length === 0) return;
    const markAsSeen = async () => {
      const {
        error
      } = await supabase.from('notifications').update({
        seen: true
      }).in('id', unseenIds);
      if (!error) {
        setNotifications(notifs => notifs.map(n => unseenIds.includes(n.id) ? {
          ...n,
          seen: true
        } : n));
      }
    };
    markAsSeen();
    // eslint-disable-next-line
  }, [open]);
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Trophy className="text-chef-gold mt-0.5" size={18} />;
      case 'level_up':
        return <Star className="text-chef-royal-blue mt-0.5" size={18} />;
      case 'recipe_approved':
        return <CheckCircle className="text-chef-royal-green mt-0.5" size={18} />;
      case 'recipe_rejected':
        return <Bell className="text-chef-red mt-0.5" size={18} />;
      default:
        return <Bell className="text-chef-royal-blue mt-0.5" size={18} />;
    }
  };
  const getNotificationStyle = (type: string, seen: boolean) => {
    if (type === 'achievement') {
      return "bg-gradient-to-r from-chef-gold/10 to-chef-royal-blue/10 border-l-4 border-chef-gold";
    }
    if (type === 'level_up') {
      return "bg-gradient-to-r from-chef-royal-blue/10 to-chef-blue-light/10 border-l-4 border-chef-royal-blue";
    }
    if (type === 'recipe_approved') {
      return "bg-gradient-to-r from-chef-royal-green/10 to-chef-green-light/10 border-l-4 border-chef-royal-green";
    }
    return seen ? "bg-white" : "bg-chef-royal-blue/5";
  };
  if (!user) return null;
  const unseenCount = notifications.filter(n => !n.seen).length;
  return <div className="relative">
      <button className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-chef-royal-blue/10 transition-colors" aria-label="View notifications" onClick={() => setOpen(o => !o)}>
        <Bell className="w-5 h-5 text-chef-royal-blue" />
        {unseenCount > 0 && <span className="absolute top-1 right-1 bg-chef-red rounded-full w-5 h-5 flex items-center justify-center font-bold my-0 px-0 py-0 text-chef-navy text-[chef-royal-blue] mx-0">
            {unseenCount > 9 ? '9+' : unseenCount}
          </span>}
      </button>
      {open && <div className="absolute right-0 mt-2 w-96 bg-white shadow-xl rounded-md border border-chef-royal-blue/15 z-50 max-h-96 overflow-hidden">
          <div className="p-4 border-b text-chef-charcoal font-semibold bg-chef-warm-ivory flex items-center justify-between">
            <span>Notifications</span>
            {unseenCount > 0 && <span className="text-xs bg-chef-royal-blue text-white px-2 py-1 rounded-full">
                {unseenCount} new
              </span>}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {loading && <div className="p-4">Loading latest notifications...</div>}
            {!loading && notifications.length === 0 && <div className="p-4 text-chef-charcoal/60 text-center">
                <Bell className="w-8 h-8 mx-auto mb-2 text-chef-charcoal/30" />
                <p>No notifications yet.</p>
                <p className="text-xs mt-1">Achievements and updates will appear here.</p>
              </div>}
            {!loading && notifications.slice(0, 15).map(n => <div key={n.id} className={`flex items-start gap-3 px-4 py-3 border-b last:border-b-0 text-sm transition-all hover:bg-chef-royal-blue/5 ${getNotificationStyle(n.type, n.seen)}`}>
                {getNotificationIcon(n.type)}
                <div className="flex-1 min-w-0">
                  <p className={`break-words ${n.seen ? 'text-chef-charcoal/70' : 'text-chef-charcoal font-medium'}`}>
                    {n.content}
                  </p>
                  <p className="text-xs text-chef-charcoal/50 mt-1">
                    {new Date(n.created_at).toLocaleDateString()} at {new Date(n.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
                  </p>
                </div>
                {!n.seen && n.type !== 'achievement' && <div className="w-2 h-2 bg-chef-royal-blue rounded-full mt-2 flex-shrink-0"></div>}
              </div>)}
          </div>
          <div className="p-3 border-t bg-chef-warm-ivory/50">
            <button className="w-full text-chef-royal-blue text-xs hover:underline bg-transparent" onClick={() => {
          setOpen(false);
          fetchNotifications();
        }}>
              Refresh Notifications
            </button>
          </div>
        </div>}
    </div>;
};
export default NotificationBell;