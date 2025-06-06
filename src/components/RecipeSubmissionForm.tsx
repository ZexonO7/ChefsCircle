
import React, { useState } from 'react';
import { X, Upload, Plus, Minus, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';

interface RecipeSubmissionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const RecipeSubmissionForm = ({
  isOpen,
  onClose,
  onSubmit
}: RecipeSubmissionFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Main Course');
  const [difficulty, setDifficulty] = useState('Easy');
  const [cookTime, setCookTime] = useState(30);
  const [ingredients, setIngredients] = useState(['']);
  const [instructions, setInstructions] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  const categories = ['Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Breakfast', 'Vegetarian', 'Quick & Easy'];
  const difficulties = ['Easy', 'Intermediate', 'Advanced'];

  const handleAddIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a recipe.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const filteredIngredients = ingredients.filter(ingredient => ingredient.trim() !== '');
      const { error } = await supabase.from('user_recipes').insert({
        title,
        description,
        category,
        difficulty,
        cook_time: cookTime,
        ingredients: filteredIngredients,
        instructions,
        image_url: imageUrl || null,
        user_id: user.id
      });

      if (error) throw error;

      toast({
        title: "Recipe submitted successfully!",
        description: "Your recipe has been submitted for review. It will appear in the community once approved."
      });

      // Reset form
      setTitle('');
      setDescription('');
      setCategory('Main Course');
      setDifficulty('Easy');
      setCookTime(30);
      setIngredients(['']);
      setInstructions('');
      setImageUrl('');
      onSubmit();
      onClose();
    } catch (error: any) {
      console.error('Error submitting recipe:', error);
      toast({
        title: "Error submitting recipe",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative bg-slate-900/95 backdrop-blur-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto mx-4 rounded-2xl shadow-2xl border border-slate-700/50"
        >
          {/* Header */}
          <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700/50 p-6 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-chef-gold/10 rounded-xl">
                  <ChefHat className="w-6 h-6 text-chef-gold" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Share Your Recipe</h2>
                  <p className="text-slate-400 text-sm">Create something extraordinary for the community</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-xl transition-colors group"
              >
                <X className="w-5 h-5 text-slate-400 group-hover:text-white" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Recipe Title */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">
                  Recipe Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-chef-gold/50 focus:border-chef-gold/50 transition-all"
                  placeholder="Enter your recipe title"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-chef-gold/50 focus:border-chef-gold/50 transition-all h-24 resize-none"
                  placeholder="Describe your recipe..."
                  required
                />
              </div>

              {/* Category, Difficulty, Cook Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-200">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-chef-gold/50 focus:border-chef-gold/50 transition-all"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-slate-800 text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-200">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-chef-gold/50 focus:border-chef-gold/50 transition-all"
                  >
                    {difficulties.map((diff) => (
                      <option key={diff} value={diff} className="bg-slate-800 text-white">
                        {diff}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-200">Cook Time (min)</label>
                  <input
                    type="number"
                    value={cookTime}
                    onChange={(e) => setCookTime(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-chef-gold/50 focus:border-chef-gold/50 transition-all"
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">
                  Image URL (optional)
                </label>
                <div className="relative">
                  <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-chef-gold/50 focus:border-chef-gold/50 transition-all"
                    placeholder="https://example.com/recipe-image.jpg"
                  />
                </div>
              </div>

              {/* Ingredients */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-200">
                  Ingredients *
                </label>
                <div className="space-y-2">
                  {ingredients.map((ingredient, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        value={ingredient}
                        onChange={(e) => handleIngredientChange(index, e.target.value)}
                        className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-chef-gold/50 focus:border-chef-gold/50 transition-all"
                        placeholder="Enter ingredient"
                        required={index === 0}
                      />
                      {ingredients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(index)}
                          className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-all"
                        >
                          <Minus className="w-5 h-5" />
                        </button>
                      )}
                    </motion.div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="flex items-center gap-2 text-chef-gold hover:text-chef-gold/80 font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Ingredient
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-200">
                  Instructions *
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-chef-gold/50 focus:border-chef-gold/50 transition-all h-32 resize-none"
                  placeholder="Step-by-step cooking instructions..."
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-700/50">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-700 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-chef-gold hover:bg-chef-bronze rounded-xl text-slate-900 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Recipe'
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RecipeSubmissionForm;
