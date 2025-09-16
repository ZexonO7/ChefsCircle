import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile, UserAchievement, UserRecipe, isValidUserId } from '@/utils/userHelpers';

interface UseUserProfileReturn {
  // State
  profile: UserProfile | null;
  achievements: UserAchievement[];
  recipes: UserRecipe[];
  isLoading: boolean;
  error: string | null;
  // Actions
  refetchProfile: () => Promise<void>;
  // Computed
  hasData: boolean;
  isEmpty: boolean;
}

// Explicit user profile hook with no implicit dependencies
export const useUserProfile = (userId: string | undefined): UseUserProfileReturn => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [recipes, setRecipes] = useState<UserRecipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Explicit profile fetching function
  const fetchUserProfile = useCallback(async (targetUserId: string): Promise<UserProfile | null> => {
    const { data: profileData, error: profileError } = await supabase.rpc('search_users', {
      search_term: '',
      limit_count: 1000
    });

    if (profileError) {
      throw new Error(`Profile fetch failed: ${profileError.message}`);
    }

    if (!profileData) {
      throw new Error('No profile data returned');
    }

    const userProfile = profileData.find((user: UserProfile) => user.id === targetUserId);
    
    if (!userProfile) {
      throw new Error('User not found');
    }

    return userProfile;
  }, []);

  // Explicit achievements fetching function
  const fetchUserAchievements = useCallback(async (targetUserId: string): Promise<UserAchievement[]> => {
    const { data: achievementsData, error: achievementsError } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', targetUserId)
      .order('earned_at', { ascending: false });

    if (achievementsError) {
      throw new Error(`Achievements fetch failed: ${achievementsError.message}`);
    }

    return achievementsData || [];
  }, []);

  // Explicit recipes fetching function
  const fetchUserRecipes = useCallback(async (targetUserId: string): Promise<UserRecipe[]> => {
    const { data: recipesData, error: recipesError } = await supabase
      .from('user_recipes')
      .select('*')
      .eq('user_id', targetUserId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (recipesError) {
      throw new Error(`Recipes fetch failed: ${recipesError.message}`);
    }

    return recipesData || [];
  }, []);

  // Explicit data fetching function
  const fetchAllUserData = useCallback(async (targetUserId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // Explicit parallel fetching
      const [profileResult, achievementsResult, recipesResult] = await Promise.all([
        fetchUserProfile(targetUserId),
        fetchUserAchievements(targetUserId),
        fetchUserRecipes(targetUserId)
      ]);

      // Explicit state updates
      setProfile(profileResult);
      setAchievements(achievementsResult);
      setRecipes(recipesResult);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load user data';
      console.error('User profile fetch error:', errorMessage);
      setError(errorMessage);
      
      // Explicit error state cleanup
      setProfile(null);
      setAchievements([]);
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  }, [fetchUserProfile, fetchUserAchievements, fetchUserRecipes]);

  // Explicit refetch function
  const refetchProfile = useCallback(async (): Promise<void> => {
    if (!isValidUserId(userId)) {
      return;
    }
    
    await fetchAllUserData(userId!);
  }, [userId, fetchAllUserData]);

  // Explicit effect for initial load
  useEffect(() => {
    if (!isValidUserId(userId)) {
      setError('Invalid user ID');
      setIsLoading(false);
      return;
    }

    fetchAllUserData(userId!);
  }, [userId, fetchAllUserData]);

  return {
    // State
    profile,
    achievements,
    recipes,
    isLoading,
    error,
    // Actions
    refetchProfile,
    // Computed values
    hasData: profile !== null,
    isEmpty: profile === null && achievements.length === 0 && recipes.length === 0
  };
};