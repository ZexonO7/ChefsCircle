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
    <div className="text-center p-2 rounded-lg transition-colors hover:bg-chef-warm-ivory/50">
      <div className="w-10 h-10 flex items-center justify-center mx-auto mb-1">
        {icon}
      </div>
      <p className="font-semibold text-chef-charcoal font-inter text-sm md:text-base">{value}</p>
      <p className="text-xs text-chef-charcoal/70 font-inter">{label}</p>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-chef-cream rounded-2xl shadow-chef-luxury border border-chef-gold/20">
        <div className="relative bg-chef-cream">
          {/* Hero Image */}
          <div className="relative h-64 md:h-80">
            <img 
              src={imageUrl}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/60 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Recipe Title Overlay */}
            <div className="absolute bottom-6 left-6 right-6 md:left-8 md:bottom-8 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 font-playfair">{recipe.title}</h1>
              <p className="text-lg opacity-90 font-inter">by {recipe.author}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Description */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <p className="text-lg text-chef-charcoal leading-relaxed font-inter">{recipe.description}</p>
            </motion.div>

            {/* Recipe Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8 p-4 bg-white/50 rounded-2xl border border-chef-charcoal/10 backdrop-blur-sm"
            >
              <StatItem icon={<Star className="w-6 h-6 text-chef-gold fill-current" />} value={recipe.rating} label="Rating" />
              <StatItem icon={<Eye className="w-6 h-6 text-chef-royal-blue" />} value={recipe.view_count || 1} label="Views" />
              <StatItem icon={<Clock className="w-6 h-6 text-chef-royal-green" />} value={formatCookTime(cookTime)} label="Cook Time" />
              <StatItem icon={<Users className="w-6 h-6 text-chef-royal-green" />} value={recipe.servings || 4} label="Servings" />
              <StatItem icon={<ChefHat className="w-6 h-6 text-chef-royal-green" />} value={recipe.difficulty} label="Difficulty" />
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-chef-royal-green text-chef-warm-ivory rounded-lg hover:bg-chef-forest transition-colors font-semibold flex-grow sm:flex-grow-0">
                <Heart className="w-5 h-5" />
                Like Recipe ({recipe.likes})
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-3 border border-chef-charcoal/30 text-chef-charcoal rounded-lg hover:bg-chef-warm-ivory transition-colors font-semibold flex-grow sm:flex-grow-0">
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Ingredients */}
              {recipe.ingredients && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="lg:col-span-2"
                >
                  <h3 className="text-2xl font-bold text-chef-charcoal mb-4 flex items-center gap-3 font-playfair">
                    <ScrollText className="w-7 h-7 text-chef-royal-green"/>
                    Ingredients
                  </h3>
                  <div className="space-y-3">
                    {recipe.ingredients.map((ingredient, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-chef-charcoal/10"
                      >
                        <CheckSquare className="w-5 h-5 text-chef-royal-green flex-shrink-0" />
                        <span className="text-chef-charcoal font-inter">{ingredient}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Instructions */}
              {recipe.instructions && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="lg:col-span-3"
                >
                  <h3 className="text-2xl font-bold text-chef-charcoal mb-4 flex items-center gap-3 font-playfair">
                    <ChefHat className="w-7 h-7 text-chef-royal-green"/>
                    Instructions
                  </h3>
                  <div className="space-y-4">
                    {recipe.instructions.map((instruction, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                        className="flex gap-4 p-4 bg-white rounded-lg border border-chef-charcoal/10"
                      >
                        <div className="w-8 h-8 bg-chef-royal-green text-chef-warm-ivory rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 font-inter">
                          {index + 1}
                        </div>
                        <p className="text-chef-charcoal leading-relaxed pt-1 font-inter">{instruction}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Category Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-8 pt-6 border-t border-chef-charcoal/10 flex justify-end"
            >
              <div className="chef-badge-green">
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
