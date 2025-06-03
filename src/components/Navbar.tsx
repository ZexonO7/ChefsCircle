
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <motion.nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full",
        "bg-chef-royal-blue/95 backdrop-blur-sm shadow-sm border-b border-chef-royal-blue/20"
      )}
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex items-center justify-between h-16 bg-chef-royal-blue">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="text-2xl font-bold font-playfair transition-colors text-chef-warm-ivory">
                ChefCircle
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-chef-royal-blue text-chef-warm-ivory hover:bg-chef-royal-blue/90 font-inter"
                    )}>
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/about">
                    <NavigationMenuLink className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-chef-royal-blue text-chef-warm-ivory hover:bg-chef-royal-blue/90 font-inter"
                    )}>
                      About
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={cn(
                    "bg-chef-royal-blue text-chef-warm-ivory hover:bg-chef-royal-blue/90 font-inter"
                  )}>
                    Community
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[400px] bg-chef-warm-ivory">
                      <li>
                        <Link to="/clubs" className="block p-3 space-y-1 rounded-md hover:bg-chef-royal-green/5">
                          <div className="font-medium text-chef-charcoal font-playfair">Clubs</div>
                          <p className="text-sm text-chef-charcoal/70 font-inter">Join culinary clubs and connect with like-minded chefs</p>
                        </Link>
                      </li>
                      <li>
                        <Link to="/recipes" className="block p-3 space-y-1 rounded-md hover:bg-chef-royal-green/5">
                          <div className="font-medium text-chef-charcoal font-playfair">Recipe Sharing</div>
                          <p className="text-sm text-chef-charcoal/70 font-inter">Share your favorite recipes with the community</p>
                        </Link>
                      </li>
                      <li>
                        <Link to="/library" className="block p-3 space-y-1 rounded-md hover:bg-chef-royal-green/5">
                          <div className="font-medium text-chef-charcoal font-playfair">Knowledge Library</div>
                          <p className="text-sm text-chef-charcoal/70 font-inter">Search cooking questions and get expert answers</p>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/courses">
                    <NavigationMenuLink className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-chef-royal-blue text-chef-warm-ivory hover:bg-chef-royal-blue/90 font-inter"
                    )}>
                      Courses
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/blog">
                    <NavigationMenuLink className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-chef-royal-blue text-chef-warm-ivory hover:bg-chef-royal-blue/90 font-inter"
                    )}>
                      Blog
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <button 
                    onClick={() => scrollToSection('contact')} 
                    className="px-6 py-2 rounded-lg transition-all duration-300 font-inter font-medium bg-chef-royal-green text-chef-warm-ivory hover:bg-chef-royal-green/90 shadow-md hover:shadow-lg"
                  >
                    Join Community
                  </button>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu} 
              className="focus:outline-none text-chef-warm-ivory"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={cn(
        "md:hidden transition-all duration-300 overflow-hidden w-full",
        isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-sm backdrop-blur-sm bg-chef-royal-blue/95">
          <Link 
            to="/" 
            className="block px-3 py-2 rounded-md text-chef-warm-ivory hover:bg-chef-royal-blue/70"
            onClick={() => {
              setIsMenuOpen(false);
              window.scrollTo(0, 0);
            }}
          >
            Home
          </Link>
          
          <Link 
            to="/about" 
            className="block px-3 py-2 rounded-md text-chef-warm-ivory hover:bg-chef-royal-blue/70"
            onClick={() => {
              setIsMenuOpen(false);
              window.scrollTo(0, 0);
            }}
          >
            About
          </Link>
          
          <div className="block">
            <button 
              onClick={(e) => {
                e.preventDefault();
                const submenu = e.currentTarget.nextElementSibling;
                if (submenu) {
                  submenu.classList.toggle('hidden');
                }
              }}
              className="flex w-full justify-between items-center px-3 py-2 rounded-md text-chef-warm-ivory hover:bg-chef-royal-blue/70"
            >
              <span>Community</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            <div className="hidden ml-4 mt-1 space-y-1">
              <Link 
                to="/clubs" 
                className="block px-3 py-2 rounded-md text-chef-warm-ivory hover:bg-chef-royal-blue/70"
                onClick={() => {
                  setIsMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
              >
                Clubs
              </Link>
              <Link 
                to="/recipes" 
                className="block px-3 py-2 rounded-md text-chef-warm-ivory hover:bg-chef-royal-blue/70"
                onClick={() => {
                  setIsMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
              >
                Recipe Sharing
              </Link>
              <Link 
                to="/library" 
                className="block px-3 py-2 rounded-md text-chef-warm-ivory hover:bg-chef-royal-blue/70"
                onClick={() => {
                  setIsMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
              >
                Knowledge Library
              </Link>
            </div>
          </div>
          
          <Link 
            to="/courses" 
            className="block px-3 py-2 rounded-md text-chef-warm-ivory hover:bg-chef-royal-blue/70"
            onClick={() => {
              setIsMenuOpen(false);
              window.scrollTo(0, 0);
            }}
          >
            Courses
          </Link>
          
          <Link 
            to="/blog" 
            className="block px-3 py-2 rounded-md text-chef-warm-ivory hover:bg-chef-royal-blue/70"
            onClick={() => {
              setIsMenuOpen(false);
              window.scrollTo(0, 0);
            }}
          >
            Blog
          </Link>
          
          <button 
            onClick={() => scrollToSection('contact')} 
            className="block w-full text-left px-3 py-2 rounded-md text-chef-warm-ivory bg-chef-royal-green hover:bg-chef-royal-green/90"
          >
            Join Community
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
