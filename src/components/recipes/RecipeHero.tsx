
import React from 'react';
import { Plus, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface RecipeHeroProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onShareRecipe: () => void;
}

const RecipeHero = ({ searchTerm, onSearchChange, onShareRecipe }: RecipeHeroProps) => {
  return (
    <section className="chef-section bg-gradient-to-br from-chef-royal-green to-chef-forest">
      <div className="chef-container">
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="chef-heading-xl text-chef-warm-ivory mb-6">
            Share Your <span className="text-chef-gold">Recipes</span>
          </h1>
          <p className="chef-body-lg text-chef-warm-ivory/90 mb-8">
            Discover amazing recipes from our community and share your own culinary creations
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onShareRecipe}
              className="chef-button bg-chef-gold text-chef-charcoal hover:bg-chef-bronze"
            >
              <Plus className="w-5 h-5 mr-2" />
              Share Recipe
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-chef-charcoal/60 w-5 h-5" />
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-xl border border-chef-royal-green/20 focus:outline-none focus:ring-2 focus:ring-chef-gold"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RecipeHero;
