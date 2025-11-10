import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, ChefHat, User, Sparkles } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import UserMenu from "./UserMenu";
import NotificationBell from "./NotificationBell";
import UserSearch from "./UserSearch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    name: 'News',
    path: '/blog'
  }];
  const isActivePath = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };
  return <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-chef-warm-ivory/95 backdrop-blur-lg border-b border-chef-royal-green/20 shadow-sm' : 'bg-chef-warm-ivory/80 backdrop-blur-sm border-b border-chef-royal-green/10'}`}>
      <div className="chef-container py-2 flex items-center justify-between">
        {/* Desktop Navigation Dropdown - Left side */}
        {!isSmallScreen && <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-chef-royal-green/10 transition-all duration-300">
                  <Menu className="w-5 h-5 text-chef-royal-green" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-chef-warm-ivory border-chef-royal-green/20 shadow-chef-luxury z-50">
                {navItems.map(item => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-2 px-3 py-2 cursor-pointer ${
                        isActivePath(item.path) 
                          ? 'text-chef-royal-green bg-chef-royal-green/10 font-medium' 
                          : 'text-chef-charcoal hover:text-chef-royal-green hover:bg-chef-royal-green/5'
                      } ${item.isSpecial ? 'bg-gradient-to-r from-chef-royal-blue/5 to-chef-royal-green/5' : ''}`}
                    >
                      {item.isSpecial && <Sparkles className="w-4 h-4 text-chef-royal-blue animate-pulse" />}
                      <span>{item.name}</span>
                      {item.isSpecial && <span className="ml-auto text-xs bg-chef-gold/20 text-chef-gold px-2 py-1 rounded-full">AI</span>}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>}

        {/* Compact Logo - Center */}
        <Link to="/" className="flex items-center gap-2 group absolute left-1/2 transform -translate-x-1/2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-chef-royal-green to-chef-green-light flex items-center justify-center group-hover:scale-110 transition-all duration-300">
            <ChefHat className="w-4 h-4 text-chef-warm-ivory" />
          </div>
          <span className="font-playfair text-lg text-chef-charcoal font-bold tracking-tight group-hover:text-chef-royal-green transition-colors duration-300">ChefsCircle</span>
        </Link>

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

        {/* User Actions - Right side */}
        {user ? <div className="hidden md:flex items-center gap-2">
            <UserSearch />
            <NotificationBell />
            <UserMenu />
          </div> : <div className="hidden md:block">
            <Link to="/auth">
              <Button size="sm" className="bg-gradient-to-r from-chef-royal-green to-chef-green-light hover:from-chef-green-light hover:to-chef-royal-green text-chef-warm-ivory font-medium rounded-lg transition-all duration-300">
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
          </div>}
      </div>
    </nav>;
};
export default Navbar;