
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChefHat, User, Settings, LogOut, Bell } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import UserMenu from "./UserMenu";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeUserMenu = () => {
    setIsUserMenuOpen(false);
  };

    const toggleNotification = () => {
        setIsNotificationOpen(!isNotificationOpen);
    };

    const closeNotification = () => {
        setIsNotificationOpen(false);
    };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      signOut();
      navigate('/auth');
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    }
  };

  const navItems = [
    { name: 'About', path: '/about' },
    { name: 'Courses', path: '/courses' },
    { name: 'Clubs', path: '/clubs' },
    { name: 'Library', path: '/library' },
    { name: 'Recipes', path: '/recipes' },
    { name: 'AI recipe', path: '/ingredients-to-recipes' },
    { name: 'Blog', path: '/blog' }
  ];

  return (
    <nav className="bg-chef-warm-ivory border-b border-chef-royal-green/10 sticky top-0 z-50">
      <div className="chef-container py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-chef-royal-green/20 flex items-center justify-center">
            <ChefHat className="w-5 h-5 text-chef-royal-green" />
          </div>
          <span className="font-playfair text-xl text-chef-charcoal font-bold">ChefCircle</span>
        </Link>

        {/* Mobile Menu Button */}
        {isSmallScreen ? (
          <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-chef-charcoal hover:bg-chef-royal-green/10">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        ) : (
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link key={item.name} to={item.path} className="text-chef-charcoal hover:text-chef-royal-green transition-colors">
                {item.name}
              </Link>
            ))}
          </div>
        )}

        {/* Mobile Menu */}
        {isSmallScreen && (
          <div className={`fixed top-0 left-0 w-full h-full bg-chef-warm-ivory z-50 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
            <div className="p-4 flex justify-end">
              <Button variant="ghost" size="icon" onClick={closeMenu} className="text-chef-charcoal hover:bg-chef-royal-green/10">
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex flex-col items-center justify-center h-full">
              {navItems.map((item) => (
                <Link key={item.name} to={item.path} className="text-chef-charcoal hover:text-chef-royal-green transition-colors py-2 text-lg" onClick={closeMenu}>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* User Actions */}
        {user ? (
          <div className="hidden md:flex items-center gap-3">
                        <NotificationBell />
            <UserMenu />
          </div>
        ) : (
          <div className="hidden md:block">
            <Link to="/auth">
              <Button>
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
