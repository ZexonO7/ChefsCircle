
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
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
import { useRecipeAnalytics } from '@/hooks/useRecipeAnalytics';
import { useUserRecipes } from '@/hooks/useUserRecipes';
import { supabase } from '@/integrations/supabase/client';

const Recipes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [viewedRecipes, setViewedRecipes] = useState<Set<string>>(new Set());
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const categories = ['All', 'Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Breakfast', 'Vegetarian', 'Quick & Easy'];

  // Custom Hooks
  const {
    recipeAnalytics,
    loadRecipeAnalytics,
    getRecipeViewCount,
    setViewCount,
  } = useRecipeAnalytics();
  const {
    userRecipes,
    loading,
    fetchUserRecipes,
  } = useUserRecipes(user);

  useEffect(() => {
    fetchUserRecipes();
    loadRecipeAnalytics();
    // eslint-disable-next-line
  }, []);

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
    const recipeKey = `static-${recipeId}`;
    if (!viewedRecipes.has(recipeKey)) {
      try {
        const { data, error } = await supabase.rpc('increment_recipe_views', {
          p_recipe_id: recipeId.toString(),
          p_recipe_type: 'static'
        });
        if (error) {
          throw error;
        }
        const newViewCount = data;
        setViewCount(recipeKey, newViewCount);
        setViewedRecipes(prev => new Set(prev).add(recipeKey));
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update view count.",
          variant: "destructive",
        });
      }
    }
  }, [viewedRecipes, toast, setViewCount]);

  return (
    <PageLayout>
      <SEO 
        title="Recipe Sharing - ChefsCircle Community" 
        description="Discover and share amazing recipes with the ChefsCircle community. From quick meals to gourmet dishes, find your next culinary inspiration."
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
