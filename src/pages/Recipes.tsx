import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import RecipeSubmissionForm from '@/components/RecipeSubmissionForm';
import { Plus, Search, Filter, Clock, Users, Star, ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Recipes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [userRecipes, setUserRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const categories = ['All', 'Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Breakfast', 'Vegetarian', 'Quick & Easy'];

  const staticRecipes = [
    {
      id: 1,
      title: "Truffle Risotto Perfection",
      author: "Chef Marco",
      description: "Creamy Arborio rice with authentic black truffle and aged Parmesan. A restaurant-quality dish that's surprisingly achievable at home.",
      image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&h=400&fit=crop",
      cookTime: 45,
      difficulty: "Intermediate",
      rating: 4.8,
      category: "Main Course",
      status: "approved",
      likes: 234,
      isPremium: false
    },
    {
      id: 2,
      title: "Mediterranean Quinoa Bowl",
      author: "Sarah Green",
      description: "Fresh quinoa topped with roasted vegetables, feta cheese, and tahini dressing. Perfect for meal prep and healthy eating.",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
      cookTime: 30,
      difficulty: "Easy",
      rating: 4.6,
      category: "Vegetarian",
      status: "approved",
      likes: 189,
      isPremium: false
    },
    {
      id: 3,
      title: "Classic French Macarons",
      author: "Pastry Chef Emma",
      description: "Delicate almond macarons with various fillings. Master the technique with detailed step-by-step instructions.",
      image: "https://images.unsplash.com/photo-1558312657-b2dead562040?w=600&h=400&fit=crop",
      cookTime: 120,
      difficulty: "Advanced",
      rating: 4.9,
      category: "Desserts",
      status: "approved",
      likes: 567,
      isPremium: true
    },
    {
      id: 4,
      title: "Korean BBQ Tacos",
      author: "Chef Jin",
      description: "Fusion street food combining Korean flavors with Mexican classics. Marinated bulgogi beef in soft tortillas.",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop",
      cookTime: 40,
      difficulty: "Intermediate",
      rating: 4.7,
      category: "Main Course",
      status: "approved",
      likes: 298,
      isPremium: false
    },
    {
      id: 5,
      title: "Artisan Sourdough Bread",
      author: "Baker Tom",
      description: "Traditional sourdough with a perfect crust and airy crumb. Includes starter recipe and fermentation tips.",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=400&fit=crop",
      cookTime: 1440, // 24 hours
      difficulty: "Advanced",
      rating: 4.8,
      category: "Breakfast",
      status: "approved",
      likes: 445,
      isPremium: false
    },
    {
      id: 6,
      title: "5-Minute Chocolate Mug Cake",
      author: "QuickBites",
      description: "Satisfying chocolate cake ready in minutes. Perfect for those late-night sweet cravings.",
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=400&fit=crop",
      cookTime: 5,
      difficulty: "Easy",
      rating: 4.4,
      category: "Desserts",
      status: "approved",
      likes: 123,
      isPremium: false
    }
  ];

  useEffect(() => {
    fetchUserRecipes();
  }, []);

  const fetchUserRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('user_recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserRecipes(data || []);
    } catch (error: any) {
      console.error('Error fetching recipes:', error);
      toast({
        title: "Error loading recipes",
        description: error.message || "Failed to load user recipes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Combine static and user recipes
  const allRecipes = [
    ...staticRecipes,
    ...userRecipes.map(recipe => ({
      ...recipe,
      author: 'Community Chef',
      rating: 4.5,
      likes: Math.floor(Math.random() * 200) + 50,
      isPremium: false,
      status: 'approved'
    }))
  ];

  const filteredRecipes = allRecipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatCookTime = (minutes: number) => {
    if (minutes >= 1440) return `${Math.floor(minutes / 1440)}d`;
    if (minutes >= 60) return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  const handleShareRecipe = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to share a recipe.",
        variant: "destructive",
      });
      return;
    }
    setShowSubmissionForm(true);
  };

  const handleRecipeSubmitted = () => {
    fetchUserRecipes(); // Refresh the recipes list
  };

  return (
    <PageLayout>
      <SEO 
        title="Recipe Sharing - ChefCircle Community" 
        description="Discover and share amazing recipes with the ChefCircle community. From quick meals to gourmet dishes, find your next culinary inspiration."
        keywords={['recipe sharing', 'cooking recipes', 'culinary community', 'chef recipes', 'food sharing']}
      />
      
      <div className="min-h-screen bg-chef-warm-ivory pt-20">
        {/* Hero Section */}
        <section className="chef-section bg-gradient-to-br from-chef-royal-green to-chef-forest">
          <div className="chef-container">
            <motion.div 
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="chef-heading-xl text-chef-warm-ivory mb-6">
                Share Your <span className="text-chef-gold">Recipes</span>
              </h1>
              <p className="chef-body-lg text-chef-warm-ivory/90 mb-8">
                Discover amazing recipes from our community and share your own culinary creations
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleShareRecipe}
                  className="chef-button bg-chef-gold text-chef-charcoal hover:bg-chef-bronze"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Share Recipe
                </button>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-chef-charcoal/60 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search recipes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 rounded-xl border border-chef-royal-green/20 focus:outline-none focus:ring-2 focus:ring-chef-gold"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filter Categories */}
        <section className="py-8 bg-chef-warm-ivory border-b border-chef-royal-green/10">
          <div className="chef-container">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-chef-royal-green text-chef-warm-ivory'
                      : 'bg-chef-royal-green/10 text-chef-royal-green hover:bg-chef-royal-green/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Recipes Grid */}
        <section className="chef-section">
          <div className="chef-container">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chef-royal-green mx-auto mb-4"></div>
                <p className="text-chef-charcoal">Loading recipes...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRecipes.map((recipe, index) => (
                  <motion.div
                    key={`${recipe.id}-${recipe.title}`}
                    className="chef-card-luxury group cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="relative overflow-hidden rounded-t-xl">
                      <img 
                        src={recipe.image_url || recipe.image || 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=400&fit=crop'} 
                        alt={recipe.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        {recipe.isPremium && (
                          <span className="chef-badge bg-chef-gold/20 text-chef-gold border-chef-gold/30">
                            Premium
                          </span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                          recipe.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {recipe.difficulty}
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {formatCookTime(recipe.cook_time || recipe.cookTime || 30)}
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="chef-heading-sm text-chef-charcoal group-hover:text-chef-royal-green transition-colors">
                          {recipe.title}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-chef-gold">
                          <Star className="w-4 h-4 fill-current" />
                          <span>{recipe.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-chef-royal-green font-medium mb-2">by {recipe.author}</p>
                      
                      <p className="chef-body-sm text-chef-charcoal/80 mb-4 line-clamp-2">
                        {recipe.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-chef-charcoal/60">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{recipe.likes}</span>
                          </div>
                          <span className="chef-badge-blue">{recipe.category}</span>
                        </div>
                        
                        <button className="text-chef-royal-green hover:text-chef-royal-green/80 font-medium text-sm">
                          View Recipe →
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            {!loading && filteredRecipes.length === 0 && (
              <div className="text-center py-12">
                <p className="chef-body text-chef-charcoal/60">No recipes found matching your criteria.</p>
              </div>
            )}
          </div>
        </section>

        {/* Approval Notice */}
        <section className="chef-section bg-chef-royal-blue/5">
          <div className="chef-container">
            <motion.div 
              className="text-center max-w-3xl mx-auto chef-card p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <ChefHat className="w-12 h-12 text-chef-royal-green mx-auto mb-4" />
              <h2 className="chef-heading-md text-chef-charcoal mb-4">
                Recipe Submission Guidelines
              </h2>
              <p className="chef-body text-chef-charcoal/80 mb-6">
                All recipes go through our community approval process to ensure quality and authenticity. 
                Our expert chefs review each submission to maintain the high standards ChefCircle is known for.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-chef-royal-green/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-chef-royal-green font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-chef-charcoal mb-1">Submit Recipe</h4>
                    <p className="text-sm text-chef-charcoal/70">Share your recipe with detailed instructions and photos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-chef-royal-green/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-chef-royal-green font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-chef-charcoal mb-1">Community Review</h4>
                    <p className="text-sm text-chef-charcoal/70">Our chefs review for quality and authenticity</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-chef-royal-green/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-chef-royal-green font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-chef-charcoal mb-1">Get Published</h4>
                    <p className="text-sm text-chef-charcoal/70">Approved recipes join our community library</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      <RecipeSubmissionForm
        isOpen={showSubmissionForm}
        onClose={() => setShowSubmissionForm(false)}
        onSubmit={handleRecipeSubmitted}
      />
    </PageLayout>
  );
};

export default Recipes;
