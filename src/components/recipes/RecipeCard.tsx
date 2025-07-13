
import React from 'react';
import { Clock, Users, Star, ChefHat, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

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

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
  onViewRecipe: (recipe: Recipe) => void;
}

const formatCookTime = (minutes: number) => {
  if (minutes >= 1440) return `${Math.floor(minutes / 1440)}d`;
  if (minutes >= 60) return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  return `${minutes}m`;
};

const formatViewCount = (count: number) => {
  console.log('formatViewCount called with:', count, typeof count);
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
};

const RecipeCard = ({ recipe, index, onViewRecipe }: RecipeCardProps) => {
  console.log(`RecipeCard ${recipe.id}: view_count =`, recipe.view_count, typeof recipe.view_count);
  
  // Enhanced image fallback logic
  const getRecipeImage = () => {
    if (recipe.image_url) return recipe.image_url;
    if (recipe.image) return recipe.image;
    
    // Category-based fallback images
    const categoryImages: { [key: string]: string } = {
      'Appetizers': 'https://images.unsplash.com/photo-1541833761820-0f006f4f5317?w=600&h=400&fit=crop',
      'Main Course': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop',
      'Desserts': 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&h=400&fit=crop',
      'Beverages': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=600&h=400&fit=crop',
      'Breakfast': 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=600&h=400&fit=crop',
      'Vegetarian': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop',
      'Quick & Easy': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop'
    };
    
    return categoryImages[recipe.category] || 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=400&fit=crop';
  };

  const viewCount = recipe.view_count || 0;
  const formattedViewCount = formatViewCount(viewCount);
  
  console.log(`RecipeCard ${recipe.id}: Final view count values:`, {
    raw: recipe.view_count,
    processed: viewCount,
    formatted: formattedViewCount
  });

  return (
    <motion.div
      className="chef-card-luxury group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      onClick={() => onViewRecipe(recipe)}
    >
      <div className="relative overflow-hidden rounded-t-xl">
        <img 
          src={getRecipeImage()}
          alt={recipe.title}
          className="w-full h-32 sm:h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=400&fit=crop';
          }}
        />
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex gap-1 sm:gap-2">
          {recipe.isPremium && (
            <span className="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full bg-chef-gold/20 text-chef-gold border border-chef-gold/30 font-medium">
              Premium
            </span>
          )}
          <span className={`text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full font-medium ${
            recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
            recipe.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {recipe.difficulty}
          </span>
        </div>
        <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3 sm:py-1 text-white text-xs sm:text-sm">
          <Clock className="w-3 h-3 inline mr-1" />
          {formatCookTime(recipe.cook_time || recipe.cookTime || 30)}
        </div>
        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3 sm:py-1 text-white text-xs sm:text-sm flex items-center gap-1">
          <Eye className="w-3 h-3" />
          <span>{formattedViewCount}</span>
        </div>
      </div>
      
      <div className="p-3 sm:p-4 md:p-6">
        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-chef-charcoal group-hover:text-chef-royal-green transition-colors leading-tight">
            {recipe.title}
          </h3>
          <div className="flex items-center gap-1 text-xs sm:text-sm text-chef-gold ml-2">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
            <span>{recipe.rating}</span>
          </div>
        </div>
        
        <p className="text-xs sm:text-sm text-chef-royal-green font-medium mb-1 sm:mb-2">by {recipe.author}</p>
        
        <p className="text-xs sm:text-sm text-chef-charcoal/80 mb-3 sm:mb-4 line-clamp-2">
          {recipe.description}
        </p>
        
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-chef-charcoal/60">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{recipe.likes}</span>
            </div>
            <span className="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full bg-chef-royal-blue/10 text-chef-royal-blue border border-chef-royal-blue/20 font-medium">
              {recipe.category}
            </span>
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onViewRecipe(recipe);
            }}
            className="text-chef-royal-green hover:text-chef-royal-green/80 font-medium text-xs sm:text-sm"
          >
            View →
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RecipeCard;
