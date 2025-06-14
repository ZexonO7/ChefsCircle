import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Shield, BarChart3, FileText, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import AdminRecipeReview from '@/components/AdminRecipeReview';
import AdminAnalytics from '@/components/AdminAnalytics';

const AdminPortal = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('analytics');
  const [isAdmin, setIsAdmin] = useState(false);

  const adminEmails = ['advithya07@gmail.com', 'advithya@chefscircle.in'];

  useEffect(() => {
    if (user?.email) {
      setIsAdmin(adminEmails.includes(user.email));
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-chef-warm-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chef-royal-blue mx-auto mb-4"></div>
          <p className="text-chef-charcoal">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'recipes', label: 'Recipe Reviews', icon: FileText }
  ];

  return (
    <PageLayout showContact={false}>
      <div className="min-h-screen bg-chef-warm-ivory pt-20">
        {/* Admin Header */}
        <section className="bg-gradient-to-br from-chef-royal-blue to-chef-charcoal text-white py-12">
          <div className="chef-container">
            <motion.div 
              className="flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Shield className="w-8 h-8 mr-3" />
              <h1 className="chef-heading-xl">Admin Portal</h1>
            </motion.div>
            <p className="text-center text-white/80 mt-4">
              Welcome, {user.email} - Manage ChefCircle platform
            </p>
          </div>
        </section>

        {/* Navigation Tabs */}
        <section className="bg-white border-b border-chef-royal-blue/10">
          <div className="chef-container">
            <div className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-chef-royal-blue text-chef-royal-blue'
                        : 'border-transparent text-chef-charcoal/60 hover:text-chef-royal-blue'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Tab Content */}
        <section className="chef-section">
          <div className="chef-container">
            {activeTab === 'analytics' && <AdminAnalytics />}
            {activeTab === 'recipes' && <AdminRecipeReview />}
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default AdminPortal;
