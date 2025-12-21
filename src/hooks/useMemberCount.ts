import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useMemberCount = () => {
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberCount = async () => {
      try {
        const { count, error } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true });

        if (error) {
          console.error('Error fetching member count:', error);
          setMemberCount(null);
        } else {
          setMemberCount(count || 0);
        }
      } catch (error) {
        console.error('Error fetching member count:', error);
        setMemberCount(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberCount();

    // Subscribe to realtime changes on profiles table
    const channel = supabase
      .channel('profiles-count')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles'
        },
        () => {
          // Refetch count when profiles change
          fetchMemberCount();
        }
      )
      .subscribe();

    return () => {
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
