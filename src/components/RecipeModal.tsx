
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Clock, Users, Star, ChefHat, Eye, Heart, Share2, X, ScrollText, CheckSquare } from 'lucide-react';
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
}

interface RecipeModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onViewIncrement: (recipeId: string | number) => void;
}

const RecipeModal = ({ recipe, isOpen, onClose, onViewIncrement }: RecipeModalProps) => {
  const formatCookTime = (minutes: number) => {
    if (minutes >= 1440) return `${Math.floor(minutes / 1440)}d`;
    if (minutes >= 60) return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  React.useEffect(() => {
    if (isOpen && recipe) {
      onViewIncrement(recipe.id);
    }
  }, [isOpen, recipe, onViewIncrement]);

  if (!recipe) return null;

  const cookTime = recipe.cookTime || recipe.cook_time || 30;
  const imageUrl = recipe.image_url || recipe.image || 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=400&fit=crop';

  const StatItem = ({ icon, value, label }: { icon: React.ReactNode, value: string | number, label: string }) => (
    <div className="text-center p-3 rounded-xl transition-all duration-300 hover:bg-white/80 hover:shadow-md group cursor-pointer">
      <div className="w-12 h-12 flex items-center justify-center mx-auto mb-2 bg-chef-royal-green/10 rounded-full group-hover:bg-chef-royal-green/20 transition-colors">
        {icon}
      </div>
      <p className="font-bold text-chef-charcoal font-inter text-lg">{value}</p>
      <p className="text-sm text-chef-charcoal/70 font-inter font-medium">{label}</p>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto p-0 bg-gradient-to-br from-chef-warm-ivory via-white to-chef-cream rounded-3xl shadow-chef-luxury border-2 border-chef-gold/30">
        <div className="relative">
          {/* Hero Image with Improved Gradient */}
          <div className="relative h-72 md:h-96">
            <img 
              src={imageUrl}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Close Button - Enhanced */}
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 bg-white/20 backdrop-blur-md rounded-full p-3 text-white hover:bg-white/30 transition-all duration-300 hover:scale-110 z-10 shadow-lg"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Recipe Title Overlay - Enhanced */}
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold mb-3 font-playfair text-shadow-lg"
              >
                {recipe.title}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl opacity-95 font-inter"
              >
                by {recipe.author}
              </motion.p>
            </div>
          </div>

          {/* Content with Better Spacing */}
          <div className="p-8 md:p-12">
            {/* Description - Enhanced */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <p className="text-xl text-chef-charcoal leading-relaxed font-inter bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-chef-gold/20 shadow-sm">
                {recipe.description}
              </p>
            </motion.div>

            {/* Enhanced Recipe Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 mb-10 p-6 bg-white/70 rounded-3xl border-2 border-chef-gold/30 backdrop-blur-sm shadow-lg"
            >
              <StatItem icon={<Star className="w-7 h-7 text-chef-gold fill-current" />} value={recipe.rating} label="Rating" />
              <StatItem icon={<Eye className="w-7 h-7 text-chef-royal-blue" />} value={recipe.view_count || 1} label="Views" />
              <StatItem icon={<Clock className="w-7 h-7 text-chef-royal-green" />} value={formatCookTime(cookTime)} label="Cook Time" />
              <StatItem icon={<Users className="w-7 h-7 text-chef-royal-green" />} value={recipe.servings || 4} label="Servings" />
              <StatItem icon={<ChefHat className="w-7 h-7 text-chef-royal-green" />} value={recipe.difficulty} label="Difficulty" />
            </motion.div>

            {/* Enhanced Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              <button className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-chef-royal-green to-chef-forest text-chef-warm-ivory rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold text-lg flex-grow sm:flex-grow-0">
                <Heart className="w-6 h-6" />
                Like Recipe ({recipe.likes})
              </button>
              <button className="flex items-center justify-center gap-3 px-8 py-4 border-2 border-chef-royal-green/40 text-chef-charcoal rounded-xl hover:bg-chef-royal-green/10 hover:shadow-lg transition-all duration-300 font-bold text-lg flex-grow sm:flex-grow-0 bg-white/50 backdrop-blur-sm">
                <Share2 className="w-6 h-6" />
                Share
              </button>
            </motion.div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
              {/* Enhanced Ingredients */}
              {recipe.ingredients && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="xl:col-span-2"
                >
                  <h3 className="text-3xl font-bold text-chef-charcoal mb-6 flex items-center gap-4 font-playfair">
                    <div className="w-10 h-10 bg-chef-royal-green rounded-full flex items-center justify-center">
                      <ScrollText className="w-6 h-6 text-white"/>
                    </div>
                    Ingredients
                  </h3>
                  <div className="space-y-4">
                    {recipe.ingredients.map((ingredient, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                        className="flex items-center gap-4 p-4 bg-white/80 rounded-xl border border-chef-gold/20 hover:shadow-md transition-all duration-300 backdrop-blur-sm"
                      >
                        <CheckSquare className="w-6 h-6 text-chef-royal-green flex-shrink-0" />
                        <span className="text-chef-charcoal font-inter text-lg">{ingredient}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Enhanced Instructions */}
              {recipe.instructions && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="xl:col-span-3"
                >
                  <h3 className="text-3xl font-bold text-chef-charcoal mb-6 flex items-center gap-4 font-playfair">
                    <div className="w-10 h-10 bg-chef-royal-green rounded-full flex items-center justify-center">
                      <ChefHat className="w-6 h-6 text-white"/>
                    </div>
                    Instructions
                  </h3>
                  <div className="space-y-6">
                    {recipe.instructions.map((instruction, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                        className="flex gap-5 p-5 bg-white/80 rounded-xl border border-chef-gold/20 hover:shadow-md transition-all duration-300 backdrop-blur-sm"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-chef-royal-green to-chef-forest text-chef-warm-ivory rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 font-inter shadow-md">
                          {index + 1}
                        </div>
                        <p className="text-chef-charcoal leading-relaxed pt-2 font-inter text-lg">{instruction}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Enhanced Category Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-12 pt-8 border-t-2 border-chef-gold/30 flex justify-end"
            >
              <div className="chef-badge-green text-lg px-6 py-3 shadow-md">
                {recipe.category}
              </div>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeModal;
