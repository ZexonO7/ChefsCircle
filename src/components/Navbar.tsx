import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChefHat, User, Sparkles } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import UserMenu from "./UserMenu";
import NotificationBell from "./NotificationBell";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    toast
  } = useToast();
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
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  const navItems = [{
    name: 'About',
    path: '/about'
  }, {
    name: 'Courses',
    path: '/courses'
  }, {
    name: 'Clubs',
    path: '/clubs'
  }, {
    name: 'Library',
    path: '/library'
  }, {
    name: 'Recipes',
    path: '/recipes'
  }, {
    name: 'AI recipe',
    path: '/ingredients-to-recipes',
    isSpecial: true
  }, {
    name: 'Membership',
    path: '/membership',
    isSpecial: true
  }, {
    name: 'News',
    path: '/blog'
  }];
  const isActivePath = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };
  return <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-chef-warm-ivory/95 backdrop-blur-lg border-b border-chef-royal-green/20 shadow-chef-luxury' : 'bg-chef-warm-ivory border-b border-chef-royal-green/10'}`}>
      <div className="chef-container py-4 flex items-center justify-between">
        {/* Enhanced Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-chef-royal-green to-chef-green-light flex items-center justify-center shadow-lg group-hover:shadow-chef-luxury transition-all duration-300 group-hover:scale-110">
              <ChefHat className="w-6 h-6 text-chef-warm-ivory" />
            </div>
            
          </div>
          <div className="flex flex-col">
            <span className="font-playfair text-2xl text-chef-charcoal font-bold tracking-tight group-hover:text-chef-royal-green transition-colors duration-300">ChefsCircle</span>
            <span className="text-xs text-chef-charcoal/60 font-inter tracking-wide -mt-1">
              Culinary Excellence
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        {!isSmallScreen && <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => <Link key={item.name} to={item.path} className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${isActivePath(item.path) ? 'text-chef-royal-green bg-chef-royal-green/10' : 'text-chef-charcoal hover:text-chef-royal-green hover:bg-chef-royal-green/5'} ${item.isSpecial ? 'bg-gradient-to-r from-chef-royal-blue/10 to-chef-royal-green/10 border border-chef-royal-blue/20' : ''}`}>
                {item.isSpecial && <Sparkles className="w-3 h-3 inline-block mr-1 text-chef-royal-blue animate-pulse" />}
                {item.name}
                {item.isSpecial}
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-chef-royal-green transition-all duration-300 group-hover:w-full ${isActivePath(item.path) ? 'w-full' : ''}`}></div>
              </Link>)}
          </div>}

        {/* Mobile Menu Button */}
        {isSmallScreen && <Button variant="ghost" size="icon" onClick={toggleMenu} className={`hover:bg-chef-royal-green/10 rounded-full transition-all duration-300 ${isMenuOpen ? 'bg-chef-royal-green/10 rotate-90' : ''}`}>
            {isMenuOpen ? <X className="h-6 w-6 text-chef-charcoal" /> : <Menu className="h-6 w-6 text-chef-charcoal" />}
          </Button>}

        {/* Enhanced Mobile Menu */}
        {isSmallScreen && <div className={`fixed inset-0 z-50 transform transition-all duration-500 ease-in-out ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
            <div className="absolute inset-0 bg-chef-charcoal/20 backdrop-blur-sm" onClick={closeMenu}></div>
            <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-chef-warm-ivory shadow-2xl">
              <div className="p-6 border-b border-chef-royal-green/20">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-chef-royal-green to-chef-green-light flex items-center justify-center">
                      <ChefHat className="w-5 h-5 text-chef-warm-ivory" />
                    </div>
                    <span className="font-playfair text-xl text-chef-charcoal font-bold">Menu</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={closeMenu} className="text-chef-charcoal hover:bg-chef-royal-green/10 rounded-full">
                    <X className="h-6 w-6" />
                  </Button>
                </div>
              </div>
              <div className="p-6 space-y-2">
                {navItems.map((item, index) => <Link key={item.name} to={item.path} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-chef-charcoal hover:text-chef-royal-green hover:bg-chef-royal-green/10 transition-all duration-300 transform hover:translate-x-2 ${isActivePath(item.path) ? 'bg-chef-royal-green/10 text-chef-royal-green' : ''} ${item.isSpecial ? 'bg-gradient-to-r from-chef-royal-blue/5 to-chef-royal-green/5 border border-chef-royal-blue/20' : ''}`} onClick={closeMenu} style={{
              animationDelay: `${index * 50}ms`
            }}>
                    {item.isSpecial && <Sparkles className="w-4 h-4 text-chef-royal-blue animate-pulse" />}
                    <span className="font-medium">{item.name}</span>
                    {item.isSpecial && <span className="ml-auto text-xs bg-chef-gold/20 text-chef-gold px-2 py-1 rounded-full">AI</span>}
                  </Link>)}
              </div>
            </div>
          </div>}

        {/* Enhanced User Actions */}
        {user ? <div className="hidden md:flex items-center gap-3">
            <NotificationBell />
            <UserMenu />
          </div> : <div className="hidden md:block">
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-chef-royal-green to-chef-green-light hover:from-chef-green-light hover:to-chef-royal-green text-chef-warm-ivory font-medium px-6 py-2 rounded-xl shadow-lg hover:shadow-chef-luxury transition-all duration-300 transform hover:-translate-y-0.5">
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
          </div>}
      </div>
    </nav>;
};
export default Navbar;