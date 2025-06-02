
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
        isScrolled 
          ? "bg-chef-warm-ivory/95 backdrop-blur-sm shadow-sm border-b border-chef-royal-blue/20" 
          : "bg-chef-charcoal/20 backdrop-blur-sm"
      )}
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex items-center justify-between h-16 bg-chef-navy">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className={cn(
                "text-2xl font-bold font-playfair transition-colors",
                isScrolled ? "text-chef-royal-green" : "text-chef-warm-ivory"
              )}>
                ChefCircle
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu className={cn(isScrolled ? "" : "text-white")}>
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
                    Cook-Alongs
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[400px] bg-chef-warm-ivory">
                      <li>
                        <Link to="/projects/firecat" className="block p-3 space-y-1 rounded-md hover:bg-chef-royal-green/5">
                          <div className="font-medium text-chef-charcoal font-playfair">Live Cooking Sessions</div>
                          <p className="text-sm text-chef-charcoal/70 font-inter">Interactive culinary experiences with master chefs</p>
                        </Link>
                      </li>
                      <li>
                        <Link to="/projects/sport-retail" className="block p-3 space-y-1 rounded-md hover:bg-chef-royal-green/5">
                          <div className="font-medium text-chef-charcoal font-playfair">Technique Masterclasses</div>
                          <p className="text-sm text-chef-charcoal/70 font-inter">Advanced culinary skills and methods</p>
                        </Link>
                      </li>
                      <li>
                        <Link to="/projects/workwear" className="block p-3 space-y-1 rounded-md hover:bg-chef-royal-green/5">
                          <div className="font-medium text-chef-charcoal font-playfair">Seasonal Menus</div>
                          <p className="text-sm text-chef-charcoal/70 font-inter">Farm-to-table cooking with seasonal ingredients</p>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={cn(
                    "bg-chef-royal-blue text-chef-warm-ivory hover:bg-chef-royal-blue/90 font-inter"
                  )}>
                    Membership
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[400px] bg-chef-warm-ivory">
                      <li>
                        <Link to="/tech-details" className="block p-3 space-y-1 rounded-md hover:bg-chef-royal-green/5">
                          <div className="font-medium text-chef-charcoal font-playfair">Exclusive Clubs</div>
                          <p className="text-sm text-chef-charcoal/70 font-inter">Join specialized culinary communities</p>
                        </Link>
                      </li>
                      <li>
                        <Link to="/development-process" className="block p-3 space-y-1 rounded-md hover:bg-chef-royal-green/5">
                          <div className="font-medium text-chef-charcoal font-playfair">Pricing Tiers</div>
                          <p className="text-sm text-chef-charcoal/70 font-inter">Choose your culinary journey level</p>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/blog">
                    <NavigationMenuLink className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-chef-royal-blue text-chef-warm-ivory hover:bg-chef-royal-blue/90 font-inter"
                    )}>
                      Recipes
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <button 
                    onClick={() => scrollToSection('contact')} 
                    className="px-6 py-2 rounded-lg transition-all duration-300 font-inter font-medium bg-chef-royal-blue text-chef-warm-ivory hover:bg-chef-royal-blue/90 shadow-md hover:shadow-lg"
                  >
                    Book a Class
                  </button>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu} 
              className={cn(
                "focus:outline-none",
                isScrolled ? "text-chef-charcoal" : "text-chef-warm-ivory"
              )}
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
        <div className={cn(
          "px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-sm backdrop-blur-sm",
          isScrolled ? "bg-chef-warm-ivory/95" : "bg-chef-charcoal/90"
        )}>
          <Link 
            to="/" 
            className={cn(
              "block px-3 py-2 rounded-md",
              isScrolled ? "text-chef-charcoal hover:bg-chef-50" : "text-chef-warm-ivory hover:bg-chef-900"
            )}
            onClick={() => {
              setIsMenuOpen(false);
              window.scrollTo(0, 0);
            }}
          >
            Home
          </Link>
          
          <Link 
            to="/about" 
            className={cn(
              "block px-3 py-2 rounded-md",
              isScrolled ? "text-chef-charcoal hover:bg-chef-50" : "text-chef-warm-ivory hover:bg-chef-900"
            )}
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
              className={cn(
                "flex w-full justify-between items-center px-3 py-2 rounded-md",
                isScrolled ? "text-chef-charcoal hover:bg-chef-50" : "text-chef-warm-ivory hover:bg-chef-900"
              )}
            >
              <span>Cook-Alongs</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            <div className="hidden ml-4 mt-1 space-y-1">
              <Link 
                to="/projects/firecat" 
                className={cn(
                  "block px-3 py-2 rounded-md",
                  isScrolled ? "text-chef-charcoal hover:bg-chef-50" : "text-chef-warm-ivory hover:bg-chef-900"
                )}
                onClick={() => {
                  setIsMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
              >
                Live Cooking Sessions
              </Link>
              <Link 
                to="/projects/sport-retail" 
                className={cn(
                  "block px-3 py-2 rounded-md",
                  isScrolled ? "text-chef-charcoal hover:bg-chef-50" : "text-chef-warm-ivory hover:bg-chef-900"
                )}
                onClick={() => {
                  setIsMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
              >
                Technique Masterclasses
              </Link>
              <Link 
                to="/projects/workwear" 
                className={cn(
                  "block px-3 py-2 rounded-md",
                  isScrolled ? "text-chef-charcoal hover:bg-chef-50" : "text-chef-warm-ivory hover:bg-chef-900"
                )}
                onClick={() => {
                  setIsMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
              >
                Seasonal Menus
              </Link>
            </div>
          </div>
          
          <div className="block">
            <button 
              onClick={(e) => {
                e.preventDefault();
                const submenu = e.currentTarget.nextElementSibling;
                if (submenu) {
                  submenu.classList.toggle('hidden');
                }
              }}
              className={cn(
                "flex w-full justify-between items-center px-3 py-2 rounded-md",
                isScrolled ? "text-chef-charcoal hover:bg-chef-50" : "text-chef-warm-ivory hover:bg-chef-900"
              )}
            >
              <span>Membership</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            
            <div className="hidden ml-4 mt-1 space-y-1">
              <Link 
                to="/tech-details" 
                className={cn(
                  "block px-3 py-2 rounded-md",
                  isScrolled ? "text-chef-charcoal hover:bg-chef-50" : "text-chef-warm-ivory hover:bg-chef-900"
                )}
                onClick={() => {
                  setIsMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
              >
                Exclusive Clubs
              </Link>
              <Link 
                to="/development-process" 
                className={cn(
                  "block px-3 py-2 rounded-md",
                  isScrolled ? "text-chef-charcoal hover:bg-chef-50" : "text-chef-warm-ivory hover:bg-chef-900"
                )}
                onClick={() => {
                  setIsMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
              >
                Pricing Tiers
              </Link>
            </div>
          </div>
          
          <Link 
            to="/blog" 
            className={cn(
              "block px-3 py-2 rounded-md",
              isScrolled ? "text-chef-charcoal hover:bg-chef-50" : "text-chef-warm-ivory hover:bg-chef-900"
            )}
            onClick={() => {
              setIsMenuOpen(false);
              window.scrollTo(0, 0);
            }}
          >
            Recipes
          </Link>
          
          <button 
            onClick={() => scrollToSection('contact')} 
            className="block w-full text-left px-3 py-2 rounded-md text-chef-warm-ivory bg-chef-royal-blue hover:bg-chef-royal-blue/90"
          >
            Book a Class
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
