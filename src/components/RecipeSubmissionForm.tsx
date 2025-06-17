import { useState } from 'react';
import { ChefHat, Clock, Users, Star, Upload, X } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
interface RecipeSubmissionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}
const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  ingredients: z.array(z.string()).min(1, 'At least one ingredient is required'),
  instructions: z.string().min(1, 'Instructions are required'),
  cookTime: z.string().optional(),
  difficulty: z.string().optional(),
  category: z.string().optional(),
  imageUrl: z.string().optional()
});
const RecipeSubmissionForm = ({
  isOpen,
  onClose,
  onSubmit
}: RecipeSubmissionFormProps) => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const categories = ['Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Breakfast', 'Vegetarian', 'Quick & Easy', 'International'];
  const difficulties = ['Easy', 'Intermediate', 'Advanced'];
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      ingredients: [''],
      instructions: '',
      cookTime: '',
      difficulty: '',
      category: '',
      imageUrl: ''
    }
  });
  const addIngredient = () => {
    setIngredients([...ingredients, '']);
  };
  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      const newIngredients = ingredients.filter((_, i) => i !== index);
      setIngredients(newIngredients);
    }
  };
  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
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
      // Filter out empty ingredients
      const cleanIngredients = ingredients.filter(ingredient => ingredient.trim() !== '');
      if (cleanIngredients.length === 0) {
        toast({
          title: "Missing ingredients",
          description: "Please add at least one ingredient.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Submit recipe to database
      const {
        data,
        error
      } = await supabase.from('user_recipes').insert({
        user_id: user.id,
        title: values.title,
        description: values.description,
        ingredients: cleanIngredients,
        instructions: values.instructions,
        cook_time: values.cookTime ? parseInt(values.cookTime) : null,
        difficulty: values.difficulty || null,
        category: values.category || null,
        image_url: values.imageUrl || null,
        status: 'pending'
      }).select().single();
      if (error) throw error;

      // Award XP for recipe submission
      const {
        error: xpError
      } = await supabase.rpc('award_xp', {
        user_id_param: user.id,
        xp_amount: 100,
        action_type_param: 'recipe_upload',
        action_description_param: `Uploaded recipe: ${values.title}`
      });
      if (xpError) {
        console.error('Error awarding XP:', xpError);
      }
      toast({
        title: "Recipe submitted successfully!",
        description: "Your recipe is now being reviewed by our culinary experts. You earned 100 XP!"
      });

      // Reset form
      form.reset();
      setIngredients(['']);
      onSubmit();
      onClose();
    } catch (error: any) {
      console.error('Error submitting recipe:', error);
      toast({
        title: "Submission failed",
        description: error.message || "Failed to submit recipe. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-chef-warm-ivory">
        <DialogHeader className="pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-chef-royal-green/20 rounded-full flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-chef-royal-green" />
            </div>
            <div>
              <DialogTitle className="text-chef-charcoal text-2xl font-playfair">
                Share Your Recipe
              </DialogTitle>
              <DialogDescription className="text-chef-charcoal/70">
                Share your culinary creation with the ChefCircle community
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="title" render={({
              field
            }) => <FormItem>
                    <FormLabel className="text-chef-charcoal font-medium">Recipe Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter recipe title" className="border-0 border-b-2 border-chef-royal-green/30 rounded-none bg-transparent focus:border-chef-royal-green focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-3 text-chef-charcoal placeholder:text-chef-charcoal/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              <FormField control={form.control} name="category" render={({
              field
            }) => <FormItem>
                    <FormLabel className="text-chef-charcoal font-medium">Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-0 border-b-2 border-chef-royal-green/30 rounded-none bg-transparent focus:border-chef-royal-green focus:ring-0 focus:ring-offset-0 px-0 py-3">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(category => <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>} />
            </div>

            <FormField control={form.control} name="description" render={({
            field
          }) => <FormItem>
                  <FormLabel className="text-chef-charcoal font-medium">Description *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your recipe..." className="border-0 border-b-2 border-chef-royal-green/30 rounded-none bg-transparent focus:border-chef-royal-green focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-3 min-h-[100px] resize-none text-chef-charcoal placeholder:text-chef-charcoal/50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />

            {/* Ingredients */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-chef-charcoal">Ingredients *</label>
              {ingredients.map((ingredient, index) => <div key={index} className="flex gap-3 items-end">
                  <div className="flex-1">
                    <Input value={ingredient} onChange={e => updateIngredient(index, e.target.value)} placeholder={`Ingredient ${index + 1}`} className="border-0 border-b-2 border-chef-royal-green/30 rounded-none bg-transparent focus:border-chef-royal-green focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-3 text-chef-charcoal placeholder:text-chef-charcoal/50" />
                  </div>
                  {ingredients.length > 1 && <Button type="button" variant="ghost" size="icon" onClick={() => removeIngredient(index)} className="h-10 w-10 text-chef-charcoal/50 hover:text-chef-charcoal hover:bg-chef-royal-green/10">
                      <X className="w-4 h-4" />
                    </Button>}
                </div>)}
              <Button type="button" variant="outline" onClick={addIngredient} className="border-chef-royal-green text-chef-royal-green bg-chef-warm-ivory hover:bg-chef-royal-green hover:text-white transition-colors">
                Add Ingredient
              </Button>
            </div>

            <FormField control={form.control} name="instructions" render={({
            field
          }) => <FormItem>
                  <FormLabel className="text-chef-charcoal font-medium">Instructions *</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Step-by-step cooking instructions..." className="border-0 border-b-2 border-chef-royal-green/30 rounded-none bg-transparent focus:border-chef-royal-green focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-3 min-h-[150px] resize-none text-chef-charcoal placeholder:text-chef-charcoal/50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField control={form.control} name="cookTime" render={({
              field
            }) => <FormItem>
                    <FormLabel className="text-chef-charcoal font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Cook Time (minutes)
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="30" className="border-0 border-b-2 border-chef-royal-green/30 rounded-none bg-transparent focus:border-chef-royal-green focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-3 text-chef-charcoal placeholder:text-chef-charcoal/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />

              <FormField control={form.control} name="difficulty" render={({
              field
            }) => <FormItem>
                    <FormLabel className="text-chef-charcoal font-medium flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Difficulty
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-0 border-b-2 border-chef-royal-green/30 rounded-none bg-transparent focus:border-chef-royal-green focus:ring-0 focus:ring-offset-0 px-0 py-3">
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {difficulties.map(difficulty => <SelectItem key={difficulty} value={difficulty}>
                            {difficulty}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>} />

              <FormField control={form.control} name="imageUrl" render={({
              field
            }) => <FormItem>
                    <FormLabel className="text-chef-charcoal font-medium flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Image URL
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/image.jpg" className="border-0 border-b-2 border-chef-royal-green/30 rounded-none bg-transparent focus:border-chef-royal-green focus-visible:ring-0 focus-visible:ring-offset-0 px-0 py-3 text-chef-charcoal placeholder:text-chef-charcoal/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6 border-t border-chef-royal-green/20">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-chef-royal-green/30 hover:bg-chef-royal-green/10 text-slate-50 bg-rose-950 hover:bg-rose-800">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1 bg-chef-royal-green hover:bg-chef-royal-green/90 text-white">
                {loading ? 'Submitting...' : 'Submit Recipe'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>;
};
export default RecipeSubmissionForm;