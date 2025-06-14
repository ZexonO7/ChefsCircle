import React from "react";
import { motion } from "framer-motion";
import { Menu, X, ChefHat, Shield } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from '@/components/AuthProvider';
import UserMenu from '@/components/UserMenu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [{
    name: "Home",
    href: "/"
  }, {
    name: "About",
    href: "/about"
  }, {
    name: "Clubs",
    href: "/clubs"
  }, {
    name: "Recipes",
    href: "/recipes"
  }, {
    name: "Courses",
    href: "/courses"
  }, {
    name: "Library",
    href: "/library"
  }, {
    name: "News",
    href: "/news"
  }];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const adminEmails = ['advithya07@gmail.com', 'advithya@chefscircle.in'];
  const isAdmin = user?.email && adminEmails.includes(user.email);

  return <motion.nav className="fixed top-0 w-full bg-chef-warm-ivory/95 backdrop-blur-sm z-50 border-b border-chef-royal-blue/10" initial={{
    y: -100
  }} animate={{
    y: 0
  }} transition={{
    duration: 0.6,
    ease: "easeOut"
  }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 bg-transparent">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-chef-royal-blue rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <ChefHat className="w-6 h-6 text-chef-warm-ivory" />
            </div>
            <span className="text-2xl font-bold text-chef-charcoal font-playfair">ChefsCircle</span>
          </Link>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map(item => <Link key={item.name} to={item.href} className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${isActive(item.href) ? "text-chef-royal-blue bg-chef-royal-blue/10" : "text-chef-charcoal hover:text-chef-royal-blue hover:bg-chef-royal-blue/5"}`}>
                  {item.name}
                </Link>)}
              {isAdmin && (
                <Link to="/admin" className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-2 ${isActive("/admin") ? "text-chef-royal-blue bg-chef-royal-blue/10" : "text-chef-charcoal hover:text-chef-royal-blue hover:bg-chef-royal-blue/5"}`}>
                  <Shield className="w-4 h-4" />
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? <UserMenu /> : <Link to="/auth">
                <button className="chef-button-primary text-sm">
                  Sign In
                </button>
              </Link>}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-chef-charcoal hover:text-chef-royal-blue p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && <motion.div className="md:hidden bg-chef-warm-ivory border-t border-chef-royal-blue/10" initial={{
      opacity: 0,
      height: 0
    }} animate={{
      opacity: 1,
      height: "auto"
    }} exit={{
      opacity: 0,
      height: 0
    }} transition={{
      duration: 0.3
    }}>
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navItems.map(item => <Link key={item.name} to={item.href} className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${isActive(item.href) ? "text-chef-royal-blue bg-chef-royal-blue/10" : "text-chef-charcoal hover:text-chef-royal-blue hover:bg-chef-royal-blue/5"}`} onClick={() => setIsOpen(false)}>
                {item.name}
              </Link>)}
            {isAdmin && (
              <Link to="/admin" className={`block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 flex items-center gap-2 ${isActive("/admin") ? "text-chef-royal-blue bg-chef-royal-blue/10" : "text-chef-charcoal hover:text-chef-royal-blue hover:bg-chef-royal-blue/5"}`} onClick={() => setIsOpen(false)}>
                <Shield className="w-4 h-4" />
                Admin Portal
              </Link>
            )}
            {!user && <Link to="/auth" onClick={() => setIsOpen(false)}>
                <button className="w-full chef-button-primary text-sm mt-4">
                  Sign In
                </button>
              </Link>}
          </div>
        </motion.div>}
    </motion.nav>;
};

export default Navbar;
