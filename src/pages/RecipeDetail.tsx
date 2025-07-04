
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Users, ChefHat, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock recipe data - in a real app this would come from an API
  const recipe = {
    id: id,
    title: "Classic Pasta Carbonara",
    description: "A traditional Italian pasta dish with eggs, cheese, and pancetta",
    image: "/lovable-uploads/pasta-carbonara.jpg",
    prepTime: "15 minutes",
    cookTime: "20 minutes",
    servings: "4 people",
    difficulty: "Medium",
    rating: 4.8,
    ingredients: [
      "400g spaghetti",
      "200g pancetta or guanciale",
      "4 large eggs",
      "100g Pecorino Romano cheese, grated",
      "Black pepper, freshly ground",
      "Salt for pasta water"
    ],
    instructions: [
      "Bring a large pot of salted water to boil and cook spaghetti according to package directions.",
      "While pasta cooks, cut pancetta into small cubes and cook in a large skillet until crispy.",
      "In a bowl, whisk together eggs, grated cheese, and plenty of black pepper.",
      "Reserve 1 cup pasta cooking water before draining the pasta.",
      "Add hot pasta to the skillet with pancetta and toss.",
      "Remove from heat and quickly stir in the egg mixture, adding pasta water as needed.",
      "Serve immediately with extra cheese and black pepper."
    ],
    tips: [
      "Use room temperature eggs to prevent scrambling",
      "Work quickly when combining pasta with egg mixture",
      "Save some pasta water - it's key to achieving the right consistency"
    ]
  };

  return (
    <PageLayout>
      <SEO 
        title={`${recipe.title} - ChefsCircle`}
        description={recipe.description}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-chef-warm-ivory via-chef-cream to-chef-warm-ivory">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/recipes')}
            className="mb-6 text-chef-charcoal hover:bg-chef-royal-green/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Recipes
          </Button>

          {/* Recipe Header */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-chef-royal-green/20 mb-8">
            <div className="aspect-video bg-gradient-to-r from-chef-royal-green/20 to-chef-cream flex items-center justify-center">
              <ChefHat className="w-24 h-24 text-chef-royal-green/50" />
            </div>
            
            <div className="p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="bg-chef-royal-green/10 text-chef-royal-green">
                  {recipe.difficulty}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-chef-charcoal">{recipe.rating}</span>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-playfair text-chef-charcoal mb-4">
                {recipe.title}
              </h1>
              
              <p className="text-chef-charcoal/70 mb-6">
                {recipe.description}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-chef-charcoal">
                  <Clock className="w-5 h-5 text-chef-royal-green" />
                  <div>
                    <p className="text-sm text-chef-charcoal/60">Prep + Cook</p>
                    <p className="font-medium">35 minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-chef-charcoal">
                  <Users className="w-5 h-5 text-chef-royal-green" />
                  <div>
                    <p className="text-sm text-chef-charcoal/60">Serves</p>
                    <p className="font-medium">{recipe.servings}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-chef-charcoal">
                  <ChefHat className="w-5 h-5 text-chef-royal-green" />
                  <div>
                    <p className="text-sm text-chef-charcoal/60">Difficulty</p>
                    <p className="font-medium">{recipe.difficulty}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Ingredients */}
            <Card className="bg-white/80 backdrop-blur-sm border-chef-royal-green/20">
              <CardHeader>
                <CardTitle className="text-chef-charcoal font-playfair">Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-3 text-chef-charcoal">
                      <span className="w-2 h-2 bg-chef-royal-green rounded-full mt-2 flex-shrink-0"></span>
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Instructions */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border-chef-royal-green/20">
                <CardHeader>
                  <CardTitle className="text-chef-charcoal font-playfair">Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    {recipe.instructions.map((step, index) => (
                      <li key={index} className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 bg-chef-royal-green text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <p className="text-chef-charcoal pt-1">{step}</p>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card className="bg-chef-royal-green/5 backdrop-blur-sm border-chef-royal-green/20">
                <CardHeader>
                  <CardTitle className="text-chef-charcoal font-playfair">Pro Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recipe.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-3 text-chef-charcoal">
                        <span className="w-2 h-2 bg-chef-royal-green rounded-full mt-2 flex-shrink-0"></span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default RecipeDetail;
