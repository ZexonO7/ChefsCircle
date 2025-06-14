
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, ChefHat, Clock, Users, Star } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface RecipeSubmissionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const RecipeSubmissionForm = ({ isOpen, onClose, onSubmit }: RecipeSubmissionFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [''],
    instructions: '',
    cookTime: '',
    difficulty: '',
    category: '',
    imageUrl: ''
  });

  const categories = [
    'Appetizers', 'Main Course', 'Desserts', 'Beverages', 
    'Breakfast', 'Vegetarian', 'Quick & Easy', 'International'
  ];

  const difficulties = ['Easy', 'Intermediate', 'Advanced'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index] = value;
    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setFormData(prev => ({ ...prev, ingredients: [...prev.ingredients, ''] }));
  };

  const removeIngredient = (index: number) => {
    if (formData.ingredients.length > 1) {
      const newIngredients = formData.ingredients.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, ingredients: newIngredients }));
    }
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
      // Validate required fields
      if (!formData.title || !formData.description || !formData.instructions) {
        toast({
          title: "Missing required fields",
          description: "Please fill in title, description, and instructions.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Filter out empty ingredients
      const cleanIngredients = formData.ingredients.filter(ingredient => ingredient.trim() !== '');
      
      // Submit recipe to database
      const { data, error } = await supabase
        .from('user_recipes')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          ingredients: cleanIngredients,
          instructions: formData.instructions,
          cook_time: formData.cookTime ? parseInt(formData.cookTime) : null,
          difficulty: formData.difficulty || null,
          category: formData.category || null,
          image_url: formData.imageUrl || null,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Award XP for recipe submission (this will also update challenge progress)
      const { error: xpError } = await supabase.rpc('award_xp', {
        user_id_param: user.id,
        xp_amount: 100,
        action_type_param: 'recipe_upload',
        action_description_param: `Uploaded recipe: ${formData.title}`
      });

      if (xpError) {
        console.error('Error awarding XP:', xpError);
        // Don't fail the submission if XP award fails
      }

      toast({
        title: "Recipe submitted successfully!",
        description: "Your recipe is now being reviewed by our culinary experts. You earned 100 XP!",
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        ingredients: [''],
        instructions: '',
        cookTime: '',
        difficulty: '',
        category: '',
        imageUrl: ''
      });

      onSubmit();
      onClose();

    } catch (error: any) {
      console.error('Error submitting recipe:', error);
      toast({
        title: "Submission failed",
        description: error.message || "Failed to submit recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-chef-warm-ivory rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="border-0 shadow-none">
            <CardHeader className="relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-chef-royal-green/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-chef-charcoal" />
              </button>
              
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-chef-royal-green/20 rounded-full flex items-center justify-center">
                  <ChefHat className="w-6 h-6 text-chef-royal-green" />
                </div>
                <div>
                  <CardTitle className="text-chef-charcoal text-2xl font-playfair">Share Your Recipe</CardTitle>
                  <CardDescription className="text-chef-charcoal/70">
                    Share your culinary creation with the ChefCircle community
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-chef-charcoal">Recipe Title *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter recipe title"
                      className="chef-input"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-chef-charcoal">Category</label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger className="chef-input">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-chef-charcoal">Description *</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your recipe..."
                    className="chef-input min-h-[100px]"
                    required
                  />
                </div>

                {/* Ingredients */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-chef-charcoal">Ingredients</label>
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={ingredient}
                        onChange={(e) => handleIngredientChange(index, e.target.value)}
                        placeholder={`Ingredient ${index + 1}`}
                        className="chef-input flex-1"
                      />
                      {formData.ingredients.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeIngredient(index)}
                          className="shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addIngredient}
                    className="chef-button-outline"
                  >
                    Add Ingredient
                  </Button>
                </div>

                {/* Instructions */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-chef-charcoal">Instructions *</label>
                  <Textarea
                    value={formData.instructions}
                    onChange={(e) => handleInputChange('instructions', e.target.value)}
                    placeholder="Step-by-step cooking instructions..."
                    className="chef-input min-h-[150px]"
                    required
                  />
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-chef-charcoal flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Cook Time (minutes)
                    </label>
                    <Input
                      type="number"
                      value={formData.cookTime}
                      onChange={(e) => handleInputChange('cookTime', e.target.value)}
                      placeholder="30"
                      className="chef-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-chef-charcoal flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Difficulty
                    </label>
                    <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                      <SelectTrigger className="chef-input">
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map((difficulty) => (
                          <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-chef-charcoal flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Image URL
                    </label>
                    <Input
                      value={formData.imageUrl}
                      onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="chef-input"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="chef-button-outline flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="chef-button-primary flex-1"
                  >
                    {loading ? 'Submitting...' : 'Submit Recipe'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RecipeSubmissionForm;
