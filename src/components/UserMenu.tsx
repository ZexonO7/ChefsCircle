
import React from 'react';
import { User, LogOut, Settings, Trophy } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

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

  if (!user) return null;

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-chef-royal-blue/10 transition-colors">
        <div className="w-8 h-8 bg-chef-royal-blue rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-chef-warm-ivory" />
        </div>
        <span className="text-chef-charcoal font-medium hidden md:block">
          {user.user_metadata?.full_name || user.email?.split('@')[0]}
        </span>
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-chef-royal-blue/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="p-4 border-b border-chef-royal-blue/10">
          <p className="text-sm font-medium text-chef-charcoal">
            {user.user_metadata?.full_name || 'Chef'}
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
    </div>
  );
};

export default UserMenu;
