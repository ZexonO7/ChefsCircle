import React from 'react';
import { Plus, Search, ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRecipeCount } from '@/hooks/useRecipeCount';

interface RecipeHeroProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onShareRecipe: () => void;
}

const RecipeHero = ({ searchTerm, onSearchChange, onShareRecipe }: RecipeHeroProps) => {
  const { recipeCount, loading } = useRecipeCount();

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-chef-royal-green to-chef-forest relative overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1200&h=600&fit=crop" 
          alt="Recipe ingredients and cooking" 
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      <div className="chef-container relative z-10">
        <motion.div 
          className="text-center max-w-4xl mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-chef-warm-ivory mb-4 sm:mb-6">
            Share Your <span className="text-chef-gold">Recipes</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-chef-warm-ivory/90 mb-4 sm:mb-6">
            Discover amazing recipes from our community and share your own culinary creations
          </p>
          
          {!loading && recipeCount !== null && recipeCount > 0 && (
            <motion.div 
              className="flex items-center justify-center gap-2 mb-6 sm:mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="bg-chef-gold/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                <ChefHat className="w-4 h-4 sm:w-5 sm:h-5 text-chef-gold" />
                <span className="text-sm sm:text-base font-medium text-chef-warm-ivory">
                  {recipeCount} community {recipeCount === 1 ? 'recipe' : 'recipes'} shared
                </span>
              </div>
            </motion.div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <button 
              onClick={onShareRecipe}
              className="w-full sm:w-auto px-4 py-2.5 sm:px-6 sm:py-3 bg-chef-gold text-chef-charcoal hover:bg-chef-bronze font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Share Recipe
            </button>
            <div className="relative w-full sm:w-auto sm:min-w-[280px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-chef-charcoal/60 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border border-chef-royal-green/20 focus:outline-none focus:ring-2 focus:ring-chef-gold"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RecipeHero;
