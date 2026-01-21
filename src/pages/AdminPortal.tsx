import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';
import PageLayout from '@/components/PageLayout';
import { Shield, BarChart3, FileText, Users, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import AdminRecipeReview from '@/components/AdminRecipeReview';
import AdminAnalytics from '@/components/AdminAnalytics';
import AdminEnrollments from '@/components/AdminEnrollments';
import AdminPayments from '@/components/AdminPayments';

const AdminPortal = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('analytics');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckLoading, setAdminCheckLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    } else {
      setAdminCheckLoading(false);
    }
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      setAdminCheckLoading(false);
      return;
    }
    
    try {
      console.log('Checking admin status for user:', user.email);
      const { data, error } = await supabase.functions.invoke('check-admin-status');
      
      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } else {
        console.log('Admin status response:', data);
        setIsAdmin(data?.isAdmin || false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setAdminCheckLoading(false);
    }
  };

  // Show loading while auth is loading OR while we're checking admin status
  if (loading || adminCheckLoading) {
    return (
      <div className="min-h-screen bg-chef-warm-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chef-royal-blue mx-auto mb-4"></div>
          <p className="text-chef-charcoal">Loading...</p>
        </div>
      </div>
    );
  }

  // Only redirect after we've completed both auth loading and admin check
  if (!user || !isAdmin) {
    console.log('Redirecting - User:', !!user, 'IsAdmin:', isAdmin);
    return <Navigate to="/auth" replace />;
  }

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'payments', label: 'Payments', icon: Wallet },
    { id: 'recipes', label: 'Recipe Reviews', icon: FileText },
    { id: 'enrollments', label: 'Enrollments', icon: Users }
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
              Welcome, {user.email} - Manage ChefsCircle platform
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
            {activeTab === 'payments' && <AdminPayments />}
            {activeTab === 'recipes' && <AdminRecipeReview />}
            {activeTab === 'enrollments' && <AdminEnrollments />}
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default AdminPortal;
