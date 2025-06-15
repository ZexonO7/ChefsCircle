
import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: string;
  content: string;
  seen: boolean;
  created_at: string;
}

const NotificationBell = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) {
      toast({
        title: "Error",
        description: "Could not fetch notifications.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    setNotifications(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line
  }, [user]);

  // Mark unseen as seen when dropdown is opened
  useEffect(() => {
    if (!open || !user) return;
    const unseen = notifications.filter(n => !n.seen).map(n => n.id);
    if (unseen.length === 0) return;

    const markAsSeen = async () => {
      const { error } = await supabase
        .from('notifications')
        .update({ seen: true })
        .in('id', unseen);
      if (!error) {
        setNotifications((notifs) =>
          notifs.map(n => unseen.includes(n.id) ? { ...n, seen: true } : n)
        );
      }
    };
    markAsSeen();
    // eslint-disable-next-line
  }, [open]);

  if (!user) return null;

  const unseenCount = notifications.filter(n => !n.seen).length;

  return (
    <div className="relative">
      <button
        className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-chef-royal-blue/10 transition-colors"
        aria-label="View notifications"
        onClick={() => setOpen(o => !o)}
      >
        <Bell className="w-5 h-5 text-chef-royal-blue" />
        {unseenCount > 0 && (
          <span className="absolute top-1 right-1 bg-chef-red text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {unseenCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-md border border-chef-royal-blue/15 z-50">
          <div className="p-4 border-b text-chef-charcoal font-semibold bg-chef-warm-ivory">
            Notifications
          </div>
          <div className="max-h-72 overflow-y-auto">
            {loading && <div className="p-4">Loading...</div>}
            {!loading && notifications.length === 0 && (
              <div className="p-4 text-chef-charcoal/60">No notifications.</div>
            )}
            {!loading && notifications.map(n => (
              <div
                key={n.id}
                className={`flex items-start gap-2 px-4 py-3 border-b last:border-b-0 text-sm ${
                  n.seen ? "bg-white" : "bg-chef-royal-blue/5"
                }`}
              >
                {n.seen ? (
                  <CheckCircle className="text-chef-royal-green mt-0.5" size={18} />
                ) : (
                  <Bell className="text-chef-royal-blue mt-0.5 animate-pulse" size={18} />
                )}
                <span>{n.content}</span>
              </div>
            ))}
          </div>
          <button
            className="block ml-auto px-4 py-2 text-chef-royal-blue text-xs hover:underline bg-transparent"
            onClick={() => { setOpen(false); fetchNotifications(); }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
