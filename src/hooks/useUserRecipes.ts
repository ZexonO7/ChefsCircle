
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useUserRecipes(user: any) {
  const [userRecipes, setUserRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  async function fetchUserRecipes() {
    try {
      let query = supabase
        .from('user_recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (user) {
        query = query.or(`status.eq.approved,user_id.eq.${user.id}`);
      } else {
        query = query.eq('status', 'approved');
      }

      const { data, error } = await query;
      if (error) throw error;

      setUserRecipes(
        (data || []).filter(recipe =>
          recipe.status !== 'rejected' || (user && recipe.user_id === user.id)
        )
      );
    } catch (error: any) {
      toast({
        title: "Error loading recipes",
        description: error.message || "Failed to load user recipes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return {
    userRecipes,
    loading,
    fetchUserRecipes,
    setUserRecipes,
    setLoading,
  };
}
