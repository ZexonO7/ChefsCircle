
import React, { useState, useEffect } from 'react';
import { ChefHat, Sparkles, Plus, X, Loader2, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useNavigate } from 'react-router-dom';

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
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [availableIngredients, setAvailableIngredients] = useState<string[]>([]);
  const [generatedRecipes, setGeneratedRecipes] = useState<AIRecipe[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedRecipes, setExpandedRecipes] = useState<Set<number>>(new Set());
  const [dailyUsage, setDailyUsage] = useState({ current_count: 0, remaining_count: 10, can_generate: true });
  const [loadingUsage, setLoadingUsage] = useState(true);
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

  // Check authentication and load daily usage on component mount
  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
        return;
      }
      
      loadDailyUsage();
    }
  }, [user, loading, navigate]);

  const loadDailyUsage = async () => {
    if (!user) return;
    
    console.log('Loading daily usage for user:', user.id);
    setLoadingUsage(true);
    try {
      const { data, error } = await supabase.rpc('get_daily_recipe_usage', {
        user_id_param: user.id,
        max_daily_limit: 10
      });
      
      console.log('Daily usage response:', { data, error });
      
      if (error) {
        console.error('Error loading daily usage:', error);
        return;
      }
      
      if (data && data.length > 0) {
        console.log('Setting daily usage:', data[0]);
        setDailyUsage(data[0]);
      } else {
        console.log('No usage data found, setting defaults');
        setDailyUsage({ current_count: 0, remaining_count: 10, can_generate: true });
      }
    } catch (error) {
      console.error('Error in loadDailyUsage:', error);
    } finally {
      setLoadingUsage(false);
    }
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
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to generate recipes.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    if (availableIngredients.length === 0) {
      toast({
        title: "No ingredients",
        description: "Please add some ingredients first.",
        variant: "destructive"
      });
      return;
    }

    // Check daily usage limit before generation
    if (!dailyUsage.can_generate) {
      toast({
        title: "Daily limit reached",
        description: "You've reached your daily limit of 10 recipe generations. Try again tomorrow!",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Check and update daily usage
      const { data: usageData, error: usageError } = await supabase.rpc('check_and_update_daily_recipe_usage', {
        user_id_param: user.id,
        max_daily_limit: 10
      });

      if (usageError) {
        console.error('Error checking daily usage:', usageError);
        throw new Error('Failed to check daily usage limit');
      }

      if (usageData && usageData.length > 0) {
        const usage = usageData[0];
        setDailyUsage(usage);
        
        if (!usage.can_generate) {
          toast({
            title: "Daily limit reached",
            description: "You've reached your daily limit of 10 recipe generations. Try again tomorrow!",
            variant: "destructive"
          });
          return;
        }
      }

      console.log('Generating recipes for ingredients:', availableIngredients);
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
        
        // Reload daily usage to show updated counts
        await loadDailyUsage();
        
        toast({
          title: "Recipes generated!",
          description: `Found ${data.recipes.length} delicious recipes for your ingredients. You have ${dailyUsage.remaining_count - 1} generations left today.`
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

  const toggleRecipeExpansion = (recipeIndex: number) => {
    const newExpanded = new Set(expandedRecipes);
    if (newExpanded.has(recipeIndex)) {
      newExpanded.delete(recipeIndex);
    } else {
      newExpanded.add(recipeIndex);
    }
    setExpandedRecipes(newExpanded);
  };

  // Show loading screen while checking authentication
  if (loading || loadingUsage) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gradient-to-br from-chef-warm-ivory via-chef-cream to-chef-warm-ivory flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chef-royal-green mx-auto mb-4"></div>
            <p className="text-chef-charcoal">Loading...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    return null;
  }

  return (
    <PageLayout>
      <SEO title="Ingredients to Recipes - ChefsCircle" description="Transform your available ingredients into delicious recipes with AI-powered suggestions from ChefsCircle." />
      
      <div className="min-h-screen bg-gradient-to-br from-chef-warm-ivory via-chef-cream to-chef-warm-ivory">
        {/* Hero Section */}
        <section className="pt-20 pb-8 px-4">
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

            {/* Daily Usage Alert */}
            <Alert className="max-w-md mx-auto mb-8 border-chef-royal-green/30 bg-chef-royal-green/5">
              <Shield className="h-4 w-4 text-chef-royal-green" />
              <AlertTitle className="text-chef-charcoal">Daily Usage</AlertTitle>
              <AlertDescription className="text-chef-charcoal/70">
                You have <span className="font-semibold text-chef-royal-green">{dailyUsage.remaining_count}</span> recipe generations remaining today.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Ingredients Input Section */}
        <section className="pt-4 pb-12 px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/80 backdrop-blur-sm border-chef-royal-green/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-chef-charcoal font-playfair text-2xl">
                  What ingredients do you have?
                </CardTitle>
                <CardDescription className="text-chef-charcoal/70">
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

                {/* Daily limit warning */}
                {dailyUsage.remaining_count <= 2 && dailyUsage.remaining_count > 0 && (
                  <Alert className="border-yellow-500/30 bg-yellow-500/5">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-chef-charcoal/70">
                      You only have {dailyUsage.remaining_count} recipe generation{dailyUsage.remaining_count === 1 ? '' : 's'} left today!
                    </AlertDescription>
                  </Alert>
                )}

                {/* Generate button */}
                <Button 
                  onClick={generateRecipes} 
                  disabled={isGenerating || availableIngredients.length === 0 || !dailyUsage.can_generate} 
                  className="w-full bg-chef-royal-green hover:bg-chef-royal-green/90 text-white py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating recipes...
                    </>
                  ) : !dailyUsage.can_generate ? (
                    <>
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Daily limit reached
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Recipes ({dailyUsage.remaining_count} left)
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
                          {(expandedRecipes.has(index) ? recipe.instructions : recipe.instructions.slice(0, 2)).map((step, idx) => (
                            <p key={idx} className="flex items-start gap-2">
                              <span className="text-chef-royal-green font-medium">{idx + 1}.</span>
                              {step}
                            </p>
                          ))}
                          {recipe.instructions.length > 2 && (
                            <button 
                              onClick={() => toggleRecipeExpansion(index)}
                              className="text-chef-royal-green text-xs hover:underline cursor-pointer transition-colors"
                            >
                              {expandedRecipes.has(index) 
                                ? "- show less" 
                                : `+${recipe.instructions.length - 2} more steps`}
                            </button>
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
