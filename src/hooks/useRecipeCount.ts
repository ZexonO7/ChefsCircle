import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useRecipeCount = () => {
  const [recipeCount, setRecipeCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipeCount = async () => {
      try {
        const { count, error } = await supabase
          .from('user_recipes')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'approved');

        if (error) throw error;
        setRecipeCount(count || 0);
      } catch (error) {
        console.error('Error fetching recipe count:', error);
        setRecipeCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeCount();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('recipe-count')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_recipes'
        },
        () => {
          fetchRecipeCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { recipeCount, loading };
};
