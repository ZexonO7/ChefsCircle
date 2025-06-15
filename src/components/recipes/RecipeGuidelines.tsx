
import React from 'react';
import { ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';

const RecipeGuidelines = () => {
  return (
    <section className="chef-section bg-chef-royal-blue/5">
      <div className="chef-container">
        <motion.div 
          className="text-center max-w-3xl mx-auto chef-card p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <ChefHat className="w-12 h-12 text-chef-royal-green mx-auto mb-4" />
          <h2 className="chef-heading-md text-chef-charcoal mb-4">
            Recipe Submission Guidelines
          </h2>
          <p className="chef-body text-chef-charcoal/80 mb-6">
            All recipes go through our community approval process to ensure quality and authenticity. 
            Our expert chefs review each submission to maintain the high standards ChefCircle is known for.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-chef-royal-green/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-chef-royal-green font-bold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-chef-charcoal mb-1">Submit Recipe</h4>
                <p className="text-sm text-chef-charcoal/70">Share your recipe with detailed instructions and photos</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-chef-royal-green/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-chef-royal-green font-bold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-chef-charcoal mb-1">Community Review</h4>
                <p className="text-sm text-chef-charcoal/70">Our chefs review for quality and authenticity</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-chef-royal-green/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-chef-royal-green font-bold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-chef-charcoal mb-1">Get Published</h4>
                <p className="text-sm text-chef-charcoal/70">Approved recipes join our community library</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RecipeGuidelines;
