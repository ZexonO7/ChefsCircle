
import React, { useState, useEffect } from 'react';
import { User, LogOut, Settings, Trophy, Shield, Crown } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import MembershipModal from '@/components/MembershipModal';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    username: '',
    full_name: '',
    profile_image_url: ''
  });
  const [imageKey, setImageKey] = useState(0); // Force re-render of avatar
  const [isAdmin, setIsAdmin] = useState(false);
  const [showMembershipModal, setShowMembershipModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('check-admin-status');
      
      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return;
      }
      
      setIsAdmin(data?.isAdmin || false);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      console.log('UserMenu: Profile update event received');
      fetchProfile();
      setImageKey(prev => prev + 1); // Force avatar re-render
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      console.log('UserMenu: Fetching profile for user:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, profile_image_url')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('UserMenu: Error fetching profile:', error);
        return;
      }

      if (data) {
        console.log('UserMenu: Profile data fetched:', data);
        setProfile({
          username: data.username || '',
          full_name: data.full_name || '',
          profile_image_url: data.profile_image_url || ''
        });
      }
    } catch (error) {
      console.error('UserMenu: Error in fetchProfile:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Error signing out",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };

  const getDisplayName = () => {
    // Prioritize username over full name
    return profile.username || profile.full_name || user.email?.split('@')[0] || 'Chef';
  };

  const getFallbackText = () => {
    if (profile.username) return profile.username.charAt(0).toUpperCase();
    if (profile.full_name) return getInitials(profile.full_name);
    return 'U';
  };

  if (!user) return null;

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-chef-royal-blue/10 transition-colors">
        <Avatar key={imageKey} className="w-8 h-8">
          <AvatarImage 
            src={profile.profile_image_url} 
            alt={getDisplayName()}
            onError={(e) => {
              console.log('UserMenu: Avatar image failed to load:', profile.profile_image_url);
              e.currentTarget.style.display = 'none';
            }}
            onLoad={() => {
              console.log('UserMenu: Avatar image loaded successfully:', profile.profile_image_url);
            }}
          />
          <AvatarFallback className="bg-chef-royal-blue text-chef-warm-ivory text-xs">
            {getFallbackText()}
          </AvatarFallback>
        </Avatar>
        <span className="text-chef-charcoal font-medium hidden md:block">
          {getDisplayName()}
        </span>
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-chef-royal-blue/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-4 border-b border-chef-royal-blue/10">
          <p className="text-sm font-medium text-chef-charcoal">
            {getDisplayName()}
          </p>
          <p className="text-xs text-chef-charcoal/60">{user.email}</p>
        </div>
        
        <div className="py-2">
          <Link 
            to="/dashboard"
            className="w-full px-4 py-2 text-left text-sm text-chef-charcoal hover:bg-chef-royal-blue/5 flex items-center gap-2"
          >
            <Trophy className="w-4 h-4" />
            Dashboard
          </Link>
          {isAdmin && (
            <Link 
              to="/admin"
              className="w-full px-4 py-2 text-left text-sm text-chef-charcoal hover:bg-chef-royal-blue/5 flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Admin
            </Link>
          )}
          <button 
            onClick={() => setShowMembershipModal(true)}
            className="w-full px-4 py-2 text-left text-sm text-chef-charcoal hover:bg-chef-royal-blue/5 flex items-center gap-2"
          >
            <Crown className="w-4 h-4" />
            Membership
          </button>
          <Link 
            to="/settings"
            className="w-full px-4 py-2 text-left text-sm text-chef-charcoal hover:bg-chef-royal-blue/5 flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          <button 
            onClick={handleSignOut}
            className="w-full px-4 py-2 text-left text-sm text-chef-charcoal hover:bg-chef-royal-blue/5 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      <MembershipModal 
        isOpen={showMembershipModal}
        onClose={() => setShowMembershipModal(false)}
      />
    </div>
  );
};

export default UserMenu;

