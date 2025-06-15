
import React, { useState, useEffect } from 'react';
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
  const [recipeViews, setRecipeViews] = useState<{[key: string]: number}>({});
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const categories = ['All', 'Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Breakfast', 'Vegetarian', 'Quick & Easy'];

  useEffect(() => {
    fetchUserRecipes();
    loadViewCounts();
  }, []);

  // Load view counts from localStorage
  const loadViewCounts = () => {
    const savedViews = localStorage.getItem('recipeViews');
    if (savedViews) {
      try {
        setRecipeViews(JSON.parse(savedViews));
      } catch (error) {
        console.error('Error parsing saved view counts:', error);
        setRecipeViews({});
      }
    }
  };

  // Save view counts to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(recipeViews).length > 0) {
      localStorage.setItem('recipeViews', JSON.stringify(recipeViews));
    }
  }, [recipeViews]);

  const fetchUserRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('user_recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserRecipes(data || []);
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

  // Initialize view counts for recipes that don't have them yet
  const getRecipeViewCount = (recipeId: string | number) => {
    if (recipeViews[recipeId] !== undefined) {
      return recipeViews[recipeId];
    }
    // Generate initial random view count for static recipes
    const isStaticRecipe = staticRecipes.some(recipe => recipe.id === recipeId);
    return isStaticRecipe ? Math.floor(Math.random() * 300) + 50 : Math.floor(Math.random() * 100) + 25;
  };

  // Combine static and user recipes with proper view counts
  const allRecipes = [
    ...staticRecipes.map(recipe => ({
      ...recipe,
      view_count: getRecipeViewCount(recipe.id)
    })),
    ...userRecipes.map(recipe => ({
      ...recipe,
      author: 'Community Chef',
      rating: 4.5,
      likes: Math.floor(Math.random() * 200) + 50,
      isPremium: false,
      status: 'approved',
      view_count: getRecipeViewCount(recipe.id)
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

  const handleViewIncrement = (recipeId: string | number) => {
    setRecipeViews(prev => {
      const currentCount = prev[recipeId] || getRecipeViewCount(recipeId);
      const newCount = currentCount + 1;
      console.log(`Incrementing view count for recipe ${recipeId}: ${currentCount} → ${newCount}`);
      return {
        ...prev,
        [recipeId]: newCount
      };
    });
  };

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
