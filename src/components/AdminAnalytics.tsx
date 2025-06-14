
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BarChart3, Users, FileText, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalyticsData {
  total_users: number;
  total_recipes: number;
  pending_recipes: number;
  approved_recipes: number;
  rejected_recipes: number;
}

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    total_users: 0,
    total_recipes: 0,
    pending_recipes: 0,
    approved_recipes: 0,
    rejected_recipes: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Get real-time counts from actual tables
      const [usersResult, recipesResult, pendingResult, approvedResult, rejectedResult] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('user_recipes').select('id', { count: 'exact' }),
        supabase.from('user_recipes').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('user_recipes').select('id', { count: 'exact' }).eq('status', 'approved'),
        supabase.from('user_recipes').select('id', { count: 'exact' }).eq('status', 'rejected')
      ]);

      setAnalytics({
        total_users: usersResult.count || 0,
        total_recipes: recipesResult.count || 0,
        pending_recipes: pendingResult.count || 0,
        approved_recipes: approvedResult.count || 0,
        rejected_recipes: rejectedResult.count || 0
      });

      // Update analytics table with current data
      await updateAnalyticsTable({
        total_users: usersResult.count || 0,
        total_recipes: recipesResult.count || 0,
        pending_recipes: pendingResult.count || 0,
        approved_recipes: approvedResult.count || 0,
        rejected_recipes: rejectedResult.count || 0
      });

    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error loading analytics",
        description: error.message || "Failed to load analytics data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateAnalyticsTable = async (data: AnalyticsData) => {
    try {
      const updates = Object.entries(data).map(([metric, value]) => ({
        metric_name: metric,
        metric_value: value,
        date: new Date().toISOString().split('T')[0]
      }));

      for (const update of updates) {
        await supabase
          .from('website_analytics')
          .upsert(update, { 
            onConflict: 'metric_name,date',
            ignoreDuplicates: false 
          });
      }
    } catch (error) {
      console.error('Error updating analytics table:', error);
    }
  };

  const analyticsCards = [
    {
      title: 'Total Users',
      value: analytics.total_users,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Recipes',
      value: analytics.total_recipes,
      icon: FileText,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Pending Reviews',
      value: analytics.pending_recipes,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Approved Recipes',
      value: analytics.approved_recipes,
      icon: CheckCircle,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Rejected Recipes',
      value: analytics.rejected_recipes,
      icon: XCircle,
      color: 'bg-red-500',
      textColor: 'text-red-600'
    }
  ];

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chef-royal-blue mx-auto mb-4"></div>
        <p className="text-chef-charcoal">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="chef-heading-lg text-chef-charcoal">Platform Analytics</h2>
          <p className="chef-body text-chef-charcoal/60">Real-time insights into ChefCircle performance</p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="chef-button-primary flex items-center gap-2"
        >
          <TrendingUp className="w-4 h-4" />
          Refresh Data
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {analyticsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              className="chef-card bg-white p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-chef-charcoal/60 mb-1">
                    {card.title}
                  </p>
                  <p className={`text-2xl font-bold ${card.textColor}`}>
                    {card.value.toLocaleString()}
                  </p>
                </div>
                <div className={`p-3 ${card.color} rounded-xl`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="chef-card bg-white p-6">
        <h3 className="chef-heading-md text-chef-charcoal mb-4">Platform Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-chef-royal-blue mb-2">
              {analytics.total_recipes > 0 
                ? Math.round((analytics.approved_recipes / analytics.total_recipes) * 100) 
                : 0}%
            </div>
            <div className="text-sm text-chef-charcoal/60">Approval Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-chef-gold mb-2">
              {analytics.pending_recipes}
            </div>
            <div className="text-sm text-chef-charcoal/60">Awaiting Review</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-chef-forest mb-2">
              {analytics.total_users}
            </div>
            <div className="text-sm text-chef-charcoal/60">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-chef-royal-green mb-2">
              {analytics.approved_recipes}
            </div>
            <div className="text-sm text-chef-charcoal/60">Live Recipes</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
