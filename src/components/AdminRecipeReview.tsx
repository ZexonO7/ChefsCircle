import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Clock, CheckCircle, XCircle, Eye, User, Calendar, ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';

interface Recipe {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  cook_time: number;
  ingredients: string[];
  instructions: string;
  image_url: string;
  status: 'pending' | 'approved' | 'rejected';
  user_id: string;
  created_at: string;
  admin_notes?: string;
}

const AdminRecipeReview = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecipes();
  }, [filter]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('user_recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRecipes(data || []);
    } catch (error: any) {
      console.error('Error fetching recipes:', error);
      toast({
        title: "Error loading recipes",
        description: error.message || "Failed to load recipes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeAction = async (recipeId: string, action: 'approve' | 'reject') => {
    try {
      setActionLoading(recipeId);
      
      const status = action === 'approve' ? 'approved' : 'rejected';
      const { error } = await supabase
        .from('user_recipes')
        .update({
          status,
          reviewed_by: (await supabase.auth.getUser()).data.user?.id,
          reviewed_at: new Date().toISOString(),
          admin_notes: adminNotes || null
        })
        .eq('id', recipeId);

      if (error) throw error;

      // Log admin action
      await supabase.rpc('log_admin_action', {
        action_text: `Recipe ${action}d`,
        target_type_text: 'recipe',
        target_id_param: recipeId,
        details_param: { admin_notes: adminNotes }
      });

      toast({
        title: `Recipe ${action}d successfully`,
        description: `The recipe has been ${action}d and the user will be notified.`
      });

      setSelectedRecipe(null);
      setAdminNotes('');
      fetchRecipes();
    } catch (error: any) {
      console.error(`Error ${action}ing recipe:`, error);
      toast({
        title: `Error ${action}ing recipe`,
        description: error.message || `Failed to ${action} recipe.`,
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatCookTime = (minutes: number) => {
    if (minutes >= 60) return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chef-royal-blue mx-auto mb-4"></div>
        <p className="text-chef-charcoal">Loading recipes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="chef-heading-lg text-chef-charcoal">Recipe Reviews</h2>
          <p className="chef-body text-chef-charcoal/60">Review and moderate community recipe submissions</p>
        </div>
        
        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-chef-royal-blue text-white'
                  : 'bg-chef-royal-blue/10 text-chef-royal-blue hover:bg-chef-royal-blue/20'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {recipes.map((recipe, index) => (
          <motion.div
            key={recipe.id}
            className="chef-card bg-white overflow-hidden group cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -2 }}
            onClick={() => setSelectedRecipe(recipe)}
          >
            <div className="relative">
              <img 
                src={recipe.image_url || 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=400&fit=crop'} 
                alt={recipe.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-4 left-4">
                {getStatusBadge(recipe.status)}
              </div>
              <div className="absolute top-4 right-4">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                  recipe.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {recipe.difficulty}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="chef-heading-sm text-chef-charcoal mb-2 line-clamp-1">
                {recipe.title}
              </h3>
              
              <p className="chef-body-sm text-chef-charcoal/70 mb-3 line-clamp-2">
                {recipe.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-chef-charcoal/60 mb-3">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatCookTime(recipe.cook_time)}
                </div>
                <span className="chef-badge-blue">{recipe.category}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-chef-charcoal/60">
                  <Calendar className="w-4 h-4" />
                  {new Date(recipe.created_at).toLocaleDateString()}
                </div>
                <button className="text-chef-royal-blue hover:text-chef-royal-blue/80 font-medium text-sm flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  Review
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {recipes.length === 0 && (
        <div className="text-center py-12">
          <ChefHat className="w-16 h-16 text-chef-charcoal/30 mx-auto mb-4" />
          <p className="chef-body text-chef-charcoal/60">
            No recipes found for the selected filter.
          </p>
        </div>
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto mx-4"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className="chef-heading-md text-chef-charcoal">{selectedRecipe.title}</h2>
                  {getStatusBadge(selectedRecipe.status)}
                </div>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <XCircle className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recipe Image */}
                <div>
                  <img 
                    src={selectedRecipe.image_url || 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=400&fit=crop'} 
                    alt={selectedRecipe.title}
                    className="w-full h-64 object-cover rounded-xl"
                  />
                </div>

                {/* Recipe Details */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-chef-charcoal mb-2">Description</h4>
                    <p className="chef-body text-chef-charcoal/80">{selectedRecipe.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-chef-charcoal mb-1">Category</h4>
                      <p className="chef-body text-chef-charcoal/80">{selectedRecipe.category}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-chef-charcoal mb-1">Difficulty</h4>
                      <p className="chef-body text-chef-charcoal/80">{selectedRecipe.difficulty}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-chef-charcoal mb-1">Cook Time</h4>
                      <p className="chef-body text-chef-charcoal/80">{formatCookTime(selectedRecipe.cook_time)}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-chef-charcoal mb-1">Submitted</h4>
                      <p className="chef-body text-chef-charcoal/80">{new Date(selectedRecipe.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ingredients */}
              <div className="mt-6">
                <h4 className="font-semibold text-chef-charcoal mb-3">Ingredients</h4>
                <ul className="space-y-2">
                  {selectedRecipe.ingredients?.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-2 chef-body text-chef-charcoal/80">
                      <span className="w-2 h-2 bg-chef-royal-blue rounded-full mt-2 flex-shrink-0"></span>
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div className="mt-6">
                <h4 className="font-semibold text-chef-charcoal mb-3">Instructions</h4>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="chef-body text-chef-charcoal/80 whitespace-pre-line">{selectedRecipe.instructions}</p>
                </div>
              </div>

              {/* Admin Notes */}
              {selectedRecipe.status === 'pending' && (
                <div className="mt-6">
                  <h4 className="font-semibold text-chef-charcoal mb-3">Admin Notes (Optional)</h4>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-chef-royal-blue/50 focus:border-chef-royal-blue"
                    rows={3}
                    placeholder="Add notes for the user about this review..."
                  />
                </div>
              )}

              {/* Existing Admin Notes */}
              {selectedRecipe.admin_notes && (
                <div className="mt-6">
                  <h4 className="font-semibold text-chef-charcoal mb-3">Previous Admin Notes</h4>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <p className="chef-body text-chef-charcoal/80">{selectedRecipe.admin_notes}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {selectedRecipe.status === 'pending' && (
                <div className="flex gap-3 pt-6 border-t border-gray-200 mt-6">
                  <button
                    onClick={() => handleRecipeAction(selectedRecipe.id, 'reject')}
                    disabled={actionLoading === selectedRecipe.id}
                    className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {actionLoading === selectedRecipe.id ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                    Reject Recipe
                  </button>
                  <button
                    onClick={() => handleRecipeAction(selectedRecipe.id, 'approve')}
                    disabled={actionLoading === selectedRecipe.id}
                    className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {actionLoading === selectedRecipe.id ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <CheckCircle className="w-5 h-5" />
                    )}
                    Approve Recipe
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminRecipeReview;
