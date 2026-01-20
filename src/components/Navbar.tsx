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
  
  // Check if on membership page for dark theme
  const isMembershipPage = location.pathname === '/membership';
  
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
  
  // Dynamic navbar styles based on page
  const navbarClasses = isMembershipPage
    ? `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-foreground/95 backdrop-blur-xl border-b border-background/10' : 'bg-foreground/80 backdrop-blur-md'}`
    : `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border/40' : 'bg-background/60 backdrop-blur-md'}`;
  
  return <nav className={navbarClasses}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Desktop Menu Button - Left */}
        {!isSmallScreen && <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={`gap-2 font-medium transition-colors ${isMembershipPage ? 'text-background hover:bg-background/10' : 'hover:bg-accent'}`}
                >
                  <Menu className="w-4 h-4" />
                  Menu
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl z-50 mt-2">
                {navItems.map(item => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                        isActivePath(item.path) 
                          ? 'text-primary bg-accent font-medium' 
                          : 'hover:bg-accent/50'
                      } ${item.isSpecial ? 'bg-gradient-to-r from-primary/10 to-primary/5' : ''}`}
                    >
                      {item.isSpecial && <Sparkles className="w-4 h-4 text-primary" />}
                      <span>{item.name}</span>
                      {item.isSpecial && <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">AI</span>}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>}

        {/* Modern Logo - Center */}
        <Link to="/" className={`flex items-center gap-2.5 group absolute left-1/2 transform -translate-x-1/2 ${isMembershipPage ? 'text-background' : ''}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-lg">
            <ChefHat className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className={`font-playfair text-xl font-bold tracking-tight transition-colors duration-300 ${isMembershipPage ? 'text-background group-hover:text-background/80' : 'group-hover:text-primary'}`}>ChefsCircle</span>
        </Link>

        {/* Mobile Menu Button */}
        {isSmallScreen && <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMenu} 
            className={`rounded-xl transition-all duration-300 ${isMenuOpen ? 'bg-accent' : ''} ${isMembershipPage ? 'text-background hover:bg-background/10' : 'hover:bg-accent'}`}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>}

        {/* Modern Mobile Menu */}
        {isSmallScreen && <div className={`fixed inset-0 z-50 transform transition-all duration-500 ease-in-out ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={closeMenu}></div>
            <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-background/95 backdrop-blur-xl shadow-2xl border-l border-border/50">
              <div className="p-6 border-b border-border/50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                      <ChefHat className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-playfair text-xl font-bold">Menu</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={closeMenu} className="hover:bg-accent rounded-xl">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="p-6 space-y-1">
                {navItems.map((item, index) => <Link key={item.name} to={item.path} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-accent transition-all duration-300 ${isActivePath(item.path) ? 'bg-accent text-primary font-medium' : ''} ${item.isSpecial ? 'bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20' : ''}`} onClick={closeMenu} style={{
              animationDelay: `${index * 50}ms`
            }}>
                    {item.isSpecial && <Sparkles className="w-4 h-4 text-primary" />}
                    <span className="font-medium">{item.name}</span>
                    {item.isSpecial && <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">AI</span>}
                  </Link>)}
              </div>
            </div>
          </div>}

        {/* User Actions - Right */}
        {user ? <div className="hidden md:flex items-center gap-2">
            <UserSearch />
            <NotificationBell />
            <UserMenu />
          </div> : <div className="hidden md:block">
            <Link to="/auth">
              <Button size="sm" className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
          </div>}
      </div>
    </nav>;
};
export default Navbar;