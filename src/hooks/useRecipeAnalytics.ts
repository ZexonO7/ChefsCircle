
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { staticRecipes } from "@/data/staticRecipes";
import { useToast } from "@/hooks/use-toast";

// Type
export interface RecipeAnalytics {
  [key: string]: { views: number; likes: number }
}

export function useRecipeAnalytics() {
  const [recipeAnalytics, setRecipeAnalytics] = useState<RecipeAnalytics>({});
  const { toast } = useToast();

  async function loadRecipeAnalytics() {
    try {
      // Get analytics for all static recipes
      const staticAnalyticsPromises = staticRecipes.map(async (recipe) => {
        const { data, error } = await supabase.rpc('get_recipe_analytics', {
          p_recipe_id: recipe.id.toString(),
          p_recipe_type: 'static'
        });
        if (error) {
          return { recipeKey: `static-${recipe.id}`, views: 0, likes: 0 };
        }
        const analytics = data?.[0] || { view_count: 0, like_count: 0 };
        return {
          recipeKey: `static-${recipe.id}`,
          views: analytics.view_count,
          likes: analytics.like_count
        };
      });

      const staticAnalytics = await Promise.all(staticAnalyticsPromises);
      const analyticsMap: RecipeAnalytics = {};
      staticAnalytics.forEach(({ recipeKey, views, likes }) => {
        analyticsMap[recipeKey] = { views, likes };
      });

      setRecipeAnalytics(analyticsMap);
    } catch (error) {
      toast({
        title: "Error loading analytics",
        description: "Failed to load recipe view counts.",
        variant: "destructive",
      });
    }
  }

  function getRecipeViewCount(
    recipeId: string | number,
    isStatic: boolean = true
  ) {
    const key = isStatic ? `static-${recipeId}` : `user-${recipeId}`;
    return recipeAnalytics[key]?.views || 0;
  }

  function setViewCount(recipeKey: string, views: number) {
    setRecipeAnalytics(prev => ({
      ...prev,
      [recipeKey]: {
        ...prev[recipeKey],
        views,
      }
    }));
  }

  return {
    recipeAnalytics,
    loadRecipeAnalytics,
    getRecipeViewCount,
    setViewCount,
    setRecipeAnalytics,
  };
}
