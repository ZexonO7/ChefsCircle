import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMemberCount = () => {
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchMemberCount = async () => {
      try {
        const { count, error } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true });

        if (!isMounted) return;
        if (error) {
          console.error('Error fetching member count:', error);
          setMemberCount(null);
        } else {
          setMemberCount(count || 0);
        }
      } catch (error) {
        console.error('Error fetching member count:', error);
        if (isMounted) setMemberCount(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Create channel and bind listener BEFORE subscribing.
    const channel = supabase.channel(`profiles-count-${Math.random().toString(36).slice(2)}`);
    channel.on(
      // @ts-expect-error - postgres_changes is a valid event
      'postgres_changes',
      { event: '*', schema: 'public', table: 'profiles' },
      () => {
        fetchMemberCount();
      }
    );
    channel.subscribe();

    fetchMemberCount();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const formatCount = (count: number | null): string => {
    if (count === null) return 'Growing';
    if (count === 0) return 'New';
    return count.toString();
  };

  return { memberCount, loading, formatCount };
};
