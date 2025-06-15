import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import RecipeSubmissionForm from '@/components/RecipeSubmissionForm';
import RecipeModal from '@/components/RecipeModal';
import RecipeHero from '@/components/recipes/RecipeHero';
import RecipeFilters from '@/components/recipes/RecipeFilters';
import RecipeGrid from '@/components/recipes/RecipeGrid';
import RecipeGuidelines from '@/components/recipes/RecipeGuidelines';
import { staticRecipes } from '@/data/staticRecipes';

const Recipes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [userRecipes, setUserRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [recipeAnalytics, setRecipeAnalytics] = useState<{[key: string]: {views: number, likes: number}}>({});
  const [viewedRecipes, setViewedRecipes] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const categories = ['All', 'Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Breakfast', 'Vegetarian', 'Quick & Easy'];

  useEffect(() => {
    fetchUserRecipes();
    loadRecipeAnalytics();
  }, []);

  // Load analytics for all recipes from the database
  const loadRecipeAnalytics = async () => {
    try {
      console.log('Loading recipe analytics from database...');
      
      // Get analytics for all static recipes
      const staticAnalyticsPromises = staticRecipes.map(async (recipe) => {
        const { data, error } = await supabase.rpc('get_recipe_analytics', {
          p_recipe_id: recipe.id.toString(),
          p_recipe_type: 'static'
        });
        
        if (error) {
          console.error(`Error fetching analytics for static recipe ${recipe.id}:`, error);
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
      
      // Convert to our analytics format
      const analyticsMap: {[key: string]: {views: number, likes: number}} = {};
      staticAnalytics.forEach(({ recipeKey, views, likes }) => {
        analyticsMap[recipeKey] = { views, likes };
      });
      
      setRecipeAnalytics(analyticsMap);
      console.log('Loaded analytics:', analyticsMap);
    } catch (error) {
      console.error('Error loading recipe analytics:', error);
      toast({
        title: "Error loading analytics",
        description: "Failed to load recipe view counts.",
        variant: "destructive",
      });
    }
  };

  // Filter out rejected recipes except personal ones
  const fetchUserRecipes = async () => {
    try {
      let query = supabase
        .from('user_recipes')
        .select('*')
        .order('created_at', { ascending: false });

      // Only fetch approved recipes and recipes belonging to the current user
      if (user) {
        query = query.or(`status.eq.approved,user_id.eq.${user.id}`);
      } else {
        query = query.eq('status', 'approved');
      }

      const { data, error } = await query;

      if (error) throw error;

      // For non-logged-in users, only show 'approved'.
      // For logged-in users: show all 'approved' plus their own (any status)
      setUserRecipes(
        (data || []).filter(recipe => 
          recipe.status !== 'rejected' || (user && recipe.user_id === user.id)
        )
      );
    } catch (error: any) {
      console.error('Error fetching recipes:', error);
      toast({
        title: "Error loading recipes",
        description: error.message || "Failed to load user recipes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get recipe view count from analytics
  const getRecipeViewCount = (recipeId: string | number, isStatic: boolean = true) => {
    const key = isStatic ? `static-${recipeId}` : `user-${recipeId}`;
    return recipeAnalytics[key]?.views || 0;
  };

  // Combine static and user recipes with proper view counts from database
  const allRecipes = [
    ...staticRecipes.map(recipe => ({
      ...recipe,
      view_count: getRecipeViewCount(recipe.id, true)
    })),
    ...userRecipes.map(recipe => ({
      ...recipe,
      author: 'Community Chef',
      rating: 4.5,
      likes: Math.floor(Math.random() * 200) + 50,
      isPremium: false,
      status: 'approved',
      view_count: getRecipeViewCount(recipe.id, false)
    }))
  ];

  const filteredRecipes = allRecipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleShareRecipe = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to share a recipe.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    setShowSubmissionForm(true);
  };

  const handleRecipeSubmitted = () => {
    fetchUserRecipes();
  };

  const handleViewRecipe = (recipe: any) => {
    setSelectedRecipe(recipe);
  };

  const closeRecipeModal = () => {
    setSelectedRecipe(null);
  };

  // Increment view count in database
  const handleViewIncrement = useCallback(async (recipeId: string | number) => {
    const recipeKey = `static-${recipeId}`; // For now, we only handle static recipes
    
    // Only increment if this recipe hasn't been viewed in this session
    if (!viewedRecipes.has(recipeKey)) {
      try {
        console.log(`Incrementing database view count for recipe ${recipeId}...`);
        
        const { data, error } = await supabase.rpc('increment_recipe_views', {
          p_recipe_id: recipeId.toString(),
          p_recipe_type: 'static'
        });
        
        if (error) {
          console.error('Error incrementing view count:', error);
          throw error;
        }
        
        const newViewCount = data;
        console.log(`View count incremented to: ${newViewCount}`);
        
        // Update local analytics state
        setRecipeAnalytics(prev => ({
          ...prev,
          [recipeKey]: {
            ...prev[recipeKey],
            views: newViewCount
          }
        }));
        
        // Mark this recipe as viewed in this session
        setViewedRecipes(prev => new Set(prev).add(recipeKey));
        
      } catch (error) {
        console.error('Failed to increment view count:', error);
        toast({
          title: "Error",
          description: "Failed to update view count.",
          variant: "destructive",
        });
      }
    } else {
      console.log(`Recipe ${recipeId} already viewed in this session, skipping increment`);
    }
  }, [viewedRecipes, toast]);

  return (
    <PageLayout>
      <SEO 
        title="Recipe Sharing - ChefCircle Community" 
        description="Discover and share amazing recipes with the ChefCircle community. From quick meals to gourmet dishes, find your next culinary inspiration."
        keywords={['recipe sharing', 'cooking recipes', 'culinary community', 'chef recipes', 'food sharing']}
      />
      
      <div className="min-h-screen bg-chef-warm-ivory pt-20">
        <RecipeHero
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onShareRecipe={handleShareRecipe}
        />

        <RecipeFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <RecipeGrid
          recipes={filteredRecipes}
          loading={loading}
          onViewRecipe={handleViewRecipe}
        />

        <RecipeGuidelines />
      </div>

      <RecipeSubmissionForm
        isOpen={showSubmissionForm}
        onClose={() => setShowSubmissionForm(false)}
        onSubmit={handleRecipeSubmitted}
      />

      <RecipeModal
        recipe={selectedRecipe}
        isOpen={!!selectedRecipe}
        onClose={closeRecipeModal}
        onViewIncrement={handleViewIncrement}
      />
    </PageLayout>
  );
};

export default Recipes;
