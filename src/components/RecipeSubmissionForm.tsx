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
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
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
      const {
        error
      } = await supabase.from('user_recipes').insert({
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
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <motion.div initial={{
      opacity: 0,
      scale: 0.9,
      y: 20
    }} animate={{
      opacity: 1,
      scale: 1,
      y: 0
    }} exit={{
      opacity: 0,
      scale: 0.9,
      y: 20
    }} className="bg-gradient-to-br from-chef-charcoal via-chef-charcoal to-chef-navy max-w-3xl w-full max-h-[90vh] overflow-y-auto mx-4 rounded-3xl shadow-2xl border border-chef-gold/20">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-chef-royal-green to-chef-royal-blue p-6 rounded-t-3xl border-b border-chef-gold/20 bg-[#040b52]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-chef-warm-ivory font-playfair">Share Your Recipe</h2>
              <p className="text-chef-warm-ivory/80 text-sm mt-1">Create something extraordinary for the community</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full bg-chef-warm-ivory/10 hover:bg-chef-warm-ivory/20 transition-all duration-300 hover:rotate-90">
              <X className="w-6 h-6 text-chef-warm-ivory" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 bg-[c] bg-[#030733]">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Recipe Title */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-chef-gold">
                Recipe Title *
              </label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-6 py-4 bg-chef-warm-ivory/5 border-2 border-chef-gold/30 rounded-2xl text-chef-warm-ivory placeholder-chef-warm-ivory/50 focus:outline-none focus:ring-4 focus:ring-chef-gold/30 focus:border-chef-gold transition-all duration-300" placeholder="Enter your recipe title" required />
            </div>

            {/* Description */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-chef-gold">
                Description *
              </label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-6 py-4 bg-chef-warm-ivory/5 border-2 border-chef-gold/30 rounded-2xl text-chef-warm-ivory placeholder-chef-warm-ivory/50 focus:outline-none focus:ring-4 focus:ring-chef-gold/30 focus:border-chef-gold transition-all duration-300 h-28 resize-none" placeholder="Describe your recipe..." required />
            </div>

            {/* Category, Difficulty, Cook Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-chef-gold">
                  Category
                </label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-6 py-4 bg-chef-warm-ivory/5 border-2 border-chef-gold/30 rounded-2xl text-chef-warm-ivory focus:outline-none focus:ring-4 focus:ring-chef-gold/30 focus:border-chef-gold transition-all duration-300">
                  {categories.map(cat => <option key={cat} value={cat} className="bg-chef-charcoal text-chef-warm-ivory">
                      {cat}
                    </option>)}
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-lg font-semibold text-chef-gold">
                  Difficulty
                </label>
                <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full px-6 py-4 bg-chef-warm-ivory/5 border-2 border-chef-gold/30 rounded-2xl text-chef-warm-ivory focus:outline-none focus:ring-4 focus:ring-chef-gold/30 focus:border-chef-gold transition-all duration-300">
                  {difficulties.map(diff => <option key={diff} value={diff} className="bg-chef-charcoal text-chef-warm-ivory">
                      {diff}
                    </option>)}
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-lg font-semibold text-chef-gold">
                  Cook Time (minutes)
                </label>
                <input type="number" value={cookTime} onChange={e => setCookTime(Number(e.target.value))} className="w-full px-6 py-4 bg-chef-warm-ivory/5 border-2 border-chef-gold/30 rounded-2xl text-chef-warm-ivory placeholder-chef-warm-ivory/50 focus:outline-none focus:ring-4 focus:ring-chef-gold/30 focus:border-chef-gold transition-all duration-300" min="1" required />
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-chef-gold">
                Image URL (optional)
              </label>
              <div className="relative">
                <Upload className="absolute left-4 top-1/2 transform -translate-y-1/2 text-chef-warm-ivory/50 w-5 h-5" />
                <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-chef-warm-ivory/5 border-2 border-chef-gold/30 rounded-2xl text-chef-warm-ivory placeholder-chef-warm-ivory/50 focus:outline-none focus:ring-4 focus:ring-chef-gold/30 focus:border-chef-gold transition-all duration-300" placeholder="https://example.com/recipe-image.jpg" />
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-4">
              <label className="block text-lg font-semibold text-chef-gold">
                Ingredients *
              </label>
              <div className="space-y-3">
                {ingredients.map((ingredient, index) => <motion.div key={index} initial={{
                opacity: 0,
                x: -20
              }} animate={{
                opacity: 1,
                x: 0
              }} className="flex gap-3">
                    <input type="text" value={ingredient} onChange={e => handleIngredientChange(index, e.target.value)} className="flex-1 px-6 py-3 bg-chef-warm-ivory/5 border-2 border-chef-gold/30 rounded-2xl text-chef-warm-ivory placeholder-chef-warm-ivory/50 focus:outline-none focus:ring-4 focus:ring-chef-gold/30 focus:border-chef-gold transition-all duration-300" placeholder="Enter ingredient" required={index === 0} />
                    {ingredients.length > 1 && <button type="button" onClick={() => handleRemoveIngredient(index)} className="p-3 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-2xl transition-all duration-300 hover:scale-105">
                        <Minus className="w-5 h-5" />
                      </button>}
                  </motion.div>)}
                <button type="button" onClick={handleAddIngredient} className="flex items-center gap-3 text-chef-gold hover:text-chef-gold/80 font-medium transition-all duration-300 hover:translate-x-2">
                  <Plus className="w-5 h-5" />
                  Add Ingredient
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-chef-gold">
                Instructions *
              </label>
              <textarea value={instructions} onChange={e => setInstructions(e.target.value)} className="w-full px-6 py-4 bg-chef-warm-ivory/5 border-2 border-chef-gold/30 rounded-2xl text-chef-warm-ivory placeholder-chef-warm-ivory/50 focus:outline-none focus:ring-4 focus:ring-chef-gold/30 focus:border-chef-gold transition-all duration-300 h-40 resize-none" placeholder="Step-by-step cooking instructions..." required />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-chef-gold/20">
              <button type="button" onClick={onClose} className="flex-1 px-8 py-4 bg-chef-warm-ivory/10 border-2 border-chef-warm-ivory/30 rounded-2xl text-chef-warm-ivory hover:bg-chef-warm-ivory/20 transition-all duration-300 font-semibold">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="flex-1 px-8 py-4 bg-gradient-to-r from-chef-gold to-chef-bronze rounded-2xl text-chef-charcoal font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-2xl hover:shadow-chef-gold/25 transition-all duration-300 transform hover:scale-105">
                {loading ? <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-chef-charcoal/30 border-t-chef-charcoal rounded-full animate-spin"></div>
                    Submitting...
                  </div> : 'Submit Recipe'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>;
};
export default RecipeSubmissionForm;