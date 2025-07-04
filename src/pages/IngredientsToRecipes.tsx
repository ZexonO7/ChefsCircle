
import React, { useState } from 'react';
import { ChefHat, Sparkles, Plus, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

interface AIRecipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookTime: string;
  difficulty: string;
  servings: string;
}

const IngredientsToRecipes = () => {
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [availableIngredients, setAvailableIngredients] = useState<string[]>([]);
  const [generatedRecipes, setGeneratedRecipes] = useState<AIRecipe[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const addIngredient = () => {
    if (currentIngredient.trim() && !availableIngredients.includes(currentIngredient.trim())) {
      setAvailableIngredients([...availableIngredients, currentIngredient.trim()]);
      setCurrentIngredient('');
    }
  };

  const removeIngredient = (ingredient: string) => {
    setAvailableIngredients(availableIngredients.filter(item => item !== ingredient));
  };

  const trackAIRecipeGeneration = async () => {
    if (user) {
      try {
        const { error } = await supabase.rpc('track_ai_recipe_generation', {
          user_id_param: user.id
        });
        
        if (error) {
          console.error('Error tracking AI recipe generation:', error);
        }
      } catch (error) {
        console.error('Error in trackAIRecipeGeneration:', error);
      }
    }
  };

  const generateRecipes = async () => {
    if (availableIngredients.length === 0) {
      toast({
        title: "No ingredients",
        description: "Please add some ingredients first.",
        variant: "destructive"
      });
      return;
    }
    setIsGenerating(true);
    try {
      console.log('Generating recipes for ingredients:', availableIngredients);
      const {
        data,
        error
      } = await supabase.functions.invoke('generate-recipes-from-ingredients', {
        body: {
          ingredients: availableIngredients
        }
      });
      if (error) {
        console.error('Error calling recipe generation function:', error);
        throw error;
      }
      if (data?.recipes) {
        console.log('Generated recipes:', data.recipes);
        setGeneratedRecipes(data.recipes);
        
        // Track AI recipe generation for gamification
        await trackAIRecipeGeneration();
        
        toast({
          title: "Recipes generated!",
          description: `Found ${data.recipes.length} delicious recipes for your ingredients.`
        });
      } else {
        throw new Error('No recipes were generated');
      }
    } catch (error: any) {
      console.error('Error generating recipes:', error);
      toast({
        title: "Generation failed",
        description: error.message || "Failed to generate recipes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addIngredient();
    }
  };

  return (
    <PageLayout>
      <SEO title="Ingredients to Recipes - ChefsCircle" description="Transform your available ingredients into delicious recipes with AI-powered suggestions from ChefsCircle." />
      
      <div className="min-h-screen bg-gradient-to-br from-chef-warm-ivory via-chef-cream to-chef-warm-ivory">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-chef-royal-green/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-chef-royal-green" />
              </div>
              <ChefHat className="w-12 h-12 text-chef-royal-green" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-playfair text-chef-charcoal mb-6">
              Ingredients to <span className="text-chef-royal-green">Recipes</span>
            </h1>
            
            <p className="chef-body text-chef-charcoal/70 mb-8 max-w-2xl mx-auto">
              Transform your available ingredients into delicious recipes with AI-powered suggestions. 
              Just tell us what you have, and we'll create personalized recipes for you!
            </p>
          </div>
        </section>

        {/* Ingredients Input Section */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm border-chef-royal-green/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-chef-charcoal font-playfair text-2xl">
                  What ingredients do you have?
                </CardTitle>
                <CardDescription>
                  Add the ingredients available in your kitchen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Input for adding ingredients */}
                <div className="flex gap-3">
                  <Input 
                    value={currentIngredient} 
                    onChange={(e) => setCurrentIngredient(e.target.value)} 
                    onKeyPress={handleKeyPress} 
                    placeholder="e.g., chicken breast, tomatoes, garlic..." 
                    className="flex-1 bg-white border-2 border-chef-royal-green/30 text-chef-charcoal placeholder:text-chef-charcoal/50 focus:border-chef-royal-green focus:ring-2 focus:ring-chef-royal-green/20 focus:ring-offset-0" 
                  />
                  <Button 
                    onClick={addIngredient} 
                    className="bg-chef-royal-green hover:bg-chef-royal-green/90 text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Display added ingredients */}
                {availableIngredients.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-medium text-chef-charcoal">Your ingredients:</h3>
                    <div className="flex flex-wrap gap-2">
                      {availableIngredients.map((ingredient, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="bg-chef-royal-green/10 text-chef-royal-green border-chef-royal-green/20 px-3 py-1 flex items-center gap-2"
                        >
                          {ingredient}
                          <button 
                            onClick={() => removeIngredient(ingredient)} 
                            className="hover:text-chef-royal-green/80"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Generate button */}
                <Button 
                  onClick={generateRecipes} 
                  disabled={isGenerating || availableIngredients.length === 0} 
                  className="w-full bg-chef-royal-green hover:bg-chef-royal-green/90 text-white py-3 text-lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating recipes...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Recipes
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Generated Recipes Section */}
        {generatedRecipes.length > 0 && (
          <section className="py-12 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-playfair text-chef-charcoal text-center mb-8">
                Your AI-Generated Recipes
              </h2>
              
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {generatedRecipes.map((recipe, index) => (
                  <Card key={index} className="bg-white/80 backdrop-blur-sm border-chef-royal-green/20 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-chef-charcoal font-playfair text-xl">
                        {recipe.title}
                      </CardTitle>
                      <CardDescription className="text-chef-charcoal/70">
                        {recipe.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Recipe details */}
                      <div className="flex flex-wrap gap-2 text-sm">
                        <Badge variant="outline" className="border-chef-royal-green/30">
                          ⏱️ {recipe.cookTime}
                        </Badge>
                        <Badge variant="outline" className="border-chef-royal-green/30">
                          📊 {recipe.difficulty}
                        </Badge>
                        <Badge variant="outline" className="border-chef-royal-green/30">
                          👥 {recipe.servings}
                        </Badge>
                      </div>

                      {/* Ingredients */}
                      <div>
                        <h4 className="font-medium text-chef-charcoal mb-2">Ingredients:</h4>
                        <ul className="text-sm text-chef-charcoal/70 space-y-1">
                          {recipe.ingredients.slice(0, 5).map((ingredient, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-chef-royal-green mt-1">•</span>
                              {ingredient}
                            </li>
                          ))}
                          {recipe.ingredients.length > 5 && (
                            <li className="text-chef-royal-green text-xs">
                              +{recipe.ingredients.length - 5} more ingredients
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Instructions preview */}
                      <div>
                        <h4 className="font-medium text-chef-charcoal mb-2">Instructions:</h4>
                        <div className="text-sm text-chef-charcoal/70 space-y-1">
                          {recipe.instructions.slice(0, 2).map((step, idx) => (
                            <p key={idx} className="flex items-start gap-2">
                              <span className="text-chef-royal-green font-medium">{idx + 1}.</span>
                              {step}
                            </p>
                          ))}
                          {recipe.instructions.length > 2 && (
                            <p className="text-chef-royal-green text-xs">
                              +{recipe.instructions.length - 2} more steps
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </PageLayout>
  );
};

export default IngredientsToRecipes;
