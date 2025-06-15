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

const placeholderImages = [
  "https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1547584370-832c11da9297?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1563379091339-03246962d51d?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=600&h=400&fit=crop",
];

const getPlaceholderImageById = (id: string | number) => {
  const strId = String(id);
  // A simple hash function
  let hash = 0;
  for (let i = 0; i < strId.length; i++) {
    const char = strId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % placeholderImages.length;
  return placeholderImages[index];
};

const Recipes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [userRecipes, setUserRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | number | null>(null);
  const [recipeViews, setRecipeViews] = useState<{[key: string]: number}>({});
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const categories = ['All', 'Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Breakfast', 'Vegetarian', 'Quick & Easy'];

  useEffect(() => {
    fetchUserRecipes();
  }, []);

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

  // Combine static and user recipes
  const allRecipes = [
    ...staticRecipes.map(recipe => ({
      ...recipe,
      view_count: recipeViews[recipe.id] || recipe.view_count || Math.floor(Math.random() * 300) + 50
    })),
    ...userRecipes.map(recipe => ({
      ...recipe,
      image: recipe.image_url || getPlaceholderImageById(recipe.id),
      author: 'Community Chef',
      rating: 4.5,
      likes: Math.floor(Math.random() * 200) + 50,
      isPremium: false,
      status: 'approved',
      view_count: recipeViews[recipe.id] || recipe.view_count || Math.floor(Math.random() * 100) + 25
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
    setSelectedRecipeId(recipe.id);
  };

  const closeRecipeModal = () => {
    setSelectedRecipeId(null);
  };

  const handleViewIncrement = (recipeId: string | number) => {
    setRecipeViews(prev => ({
      ...prev,
      [recipeId]: (prev[recipeId] || allRecipes.find(r => r.id === recipeId)?.view_count || 0) + 1
    }));
  };

  const selectedRecipe = selectedRecipeId ? allRecipes.find(r => r.id === selectedRecipeId) : null;

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
