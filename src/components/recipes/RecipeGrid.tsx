
import React from 'react';
import RecipeCard from './RecipeCard';

interface Recipe {
  id: number | string;
  title: string;
  author: string;
  description: string;
  image_url?: string;
  image?: string;
  cookTime?: number;
  cook_time?: number;
  difficulty: string;
  rating: number;
  category: string;
  likes: number;
  servings?: number;
  ingredients?: string[];
  instructions?: string[];
  view_count?: number;
  isPremium?: boolean;
}

interface RecipeGridProps {
  recipes: Recipe[];
  loading: boolean;
  onViewRecipe: (recipe: Recipe) => void;
}

const RecipeGrid = ({ recipes, loading, onViewRecipe }: RecipeGridProps) => {
  if (loading) {
    return (
      <section className="chef-section">
        <div className="chef-container">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chef-royal-green mx-auto mb-4"></div>
            <p className="text-chef-charcoal">Loading recipes...</p>
          </div>
        </div>
      </section>
    );
  }

  if (recipes.length === 0) {
    return (
      <section className="chef-section">
        <div className="chef-container">
          <div className="text-center py-12">
            <p className="chef-body text-chef-charcoal/60">No recipes found matching your criteria.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="chef-section">
      <div className="chef-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe, index) => (
            <RecipeCard
              key={`${recipe.id}-${recipe.title}`}
              recipe={recipe}
              index={index}
              onViewRecipe={onViewRecipe}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecipeGrid;
