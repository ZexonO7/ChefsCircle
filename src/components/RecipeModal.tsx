
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Clock, Users, Star, ChefHat, Eye, Heart, Share2, X } from 'lucide-react';
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-chef-royal-blue">
        <div className="relative bg-chef-royal-blue">
          {/* Hero Image */}
          <div className="relative h-64 overflow-hidden rounded-t-lg">
            <img 
              src={imageUrl}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Recipe Title Overlay */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
              <p className="text-lg opacity-90">by {recipe.author}</p>
            </div>

            {/* Stats Overlay */}
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm flex items-center gap-1">
                <Star className="w-4 h-4 fill-current text-yellow-400" />
                <span>{recipe.rating}</span>
              </div>
              <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{recipe.view_count || 1}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 bg-chef-royal-blue">
            {/* Description */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <p className="text-lg text-chef-warm-ivory leading-relaxed">{recipe.description}</p>
            </motion.div>

            {/* Recipe Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 p-6 bg-chef-navy rounded-xl"
            >
              <div className="text-center">
                <Clock className="w-6 h-6 text-chef-gold mx-auto mb-2" />
                <p className="font-semibold text-chef-warm-ivory">{formatCookTime(cookTime)}</p>
                <p className="text-sm text-chef-warm-ivory/70">Cook Time</p>
              </div>
              <div className="text-center">
                <Users className="w-6 h-6 text-chef-gold mx-auto mb-2" />
                <p className="font-semibold text-chef-warm-ivory">{recipe.servings || 4}</p>
                <p className="text-sm text-chef-warm-ivory/70">Servings</p>
              </div>
              <div className="text-center">
                <ChefHat className="w-6 h-6 text-chef-gold mx-auto mb-2" />
                <p className="font-semibold text-chef-warm-ivory">{recipe.difficulty}</p>
                <p className="text-sm text-chef-warm-ivory/70">Difficulty</p>
              </div>
              <div className="text-center">
                <Heart className="w-6 h-6 text-chef-gold mx-auto mb-2" />
                <p className="font-semibold text-chef-warm-ivory">{recipe.likes}</p>
                <p className="text-sm text-chef-warm-ivory/70">Likes</p>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex gap-4 mb-8"
            >
              <button className="flex items-center gap-2 px-4 py-2 bg-chef-gold text-chef-charcoal rounded-lg hover:bg-chef-bronze transition-colors">
                <Heart className="w-4 h-4" />
                Like Recipe
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-chef-warm-ivory/30 text-chef-warm-ivory rounded-lg hover:bg-chef-warm-ivory/10 transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Ingredients */}
              {recipe.ingredients && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h3 className="text-2xl font-bold text-chef-warm-ivory mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-chef-gold text-chef-charcoal rounded-full flex items-center justify-center text-sm">
                      📝
                    </span>
                    Ingredients
                  </h3>
                  <div className="space-y-3">
                    {recipe.ingredients.map((ingredient, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                        className="flex items-start gap-3 p-3 bg-chef-navy rounded-lg border border-chef-warm-ivory/20 hover:shadow-sm transition-shadow"
                      >
                        <div className="w-2 h-2 bg-chef-gold rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-chef-warm-ivory">{ingredient}</span>
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
                >
                  <h3 className="text-2xl font-bold text-chef-warm-ivory mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-chef-gold text-chef-charcoal rounded-full flex items-center justify-center text-sm">
                      👨‍🍳
                    </span>
                    Instructions
                  </h3>
                  <div className="space-y-4">
                    {recipe.instructions.map((instruction, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                        className="flex gap-4 p-4 bg-chef-navy rounded-lg border border-chef-warm-ivory/20 hover:shadow-sm transition-shadow"
                      >
                        <div className="w-8 h-8 bg-chef-gold text-chef-charcoal rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {index + 1}
                        </div>
                        <p className="text-chef-warm-ivory leading-relaxed pt-1">{instruction}</p>
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
              className="mt-8 pt-6 border-t border-chef-warm-ivory/20"
            >
              <span className="inline-block px-4 py-2 bg-chef-gold/20 text-chef-gold rounded-full text-sm font-medium">
                {recipe.category}
              </span>
            </motion.div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeModal;
