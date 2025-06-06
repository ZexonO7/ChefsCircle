
import React, { useState } from 'react';
import { X, Upload, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';

interface RecipeSubmissionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const RecipeSubmissionForm = ({ isOpen, onClose, onSubmit }: RecipeSubmissionFormProps) => {
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
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const filteredIngredients = ingredients.filter(ingredient => ingredient.trim() !== '');
      
      const { error } = await supabase
        .from('user_recipes')
        .insert({
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
        description: "Your recipe has been submitted for review. It will appear in the community once approved.",
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
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        className="chef-card max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="chef-heading-lg text-chef-charcoal">Share Your Recipe</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-chef-royal-green/10 transition-colors"
          >
            <X className="w-5 h-5 text-chef-charcoal" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-chef-charcoal mb-2">
              Recipe Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-chef-royal-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-chef-royal-green"
              placeholder="Enter your recipe title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-chef-charcoal mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-chef-royal-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-chef-royal-green h-24 resize-none"
              placeholder="Describe your recipe..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-chef-charcoal mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-chef-royal-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-chef-royal-green"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-chef-charcoal mb-2">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-3 border border-chef-royal-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-chef-royal-green"
              >
                {difficulties.map((diff) => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-chef-charcoal mb-2">
                Cook Time (minutes)
              </label>
              <input
                type="number"
                value={cookTime}
                onChange={(e) => setCookTime(Number(e.target.value))}
                className="w-full px-4 py-3 border border-chef-royal-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-chef-royal-green"
                min="1"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-chef-charcoal mb-2">
              Image URL (optional)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-3 border border-chef-royal-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-chef-royal-green"
              placeholder="https://example.com/recipe-image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-chef-charcoal mb-2">
              Ingredients *
            </label>
            <div className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-chef-royal-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-chef-royal-green"
                    placeholder="Enter ingredient"
                    required={index === 0}
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddIngredient}
                className="flex items-center gap-2 text-chef-royal-green hover:text-chef-royal-green/80 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Ingredient
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-chef-charcoal mb-2">
              Instructions *
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-4 py-3 border border-chef-royal-green/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-chef-royal-green h-32 resize-none"
              placeholder="Step-by-step cooking instructions..."
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-chef-royal-green/20 rounded-xl text-chef-charcoal hover:bg-chef-royal-green/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 chef-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Recipe'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default RecipeSubmissionForm;
