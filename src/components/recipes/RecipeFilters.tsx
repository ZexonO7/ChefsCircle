
import React from 'react';

interface RecipeFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const RecipeFilters = ({ categories, selectedCategory, onCategoryChange }: RecipeFiltersProps) => {
  return (
    <section className="py-8 bg-chef-warm-ivory border-b border-chef-royal-green/10">
      <div className="chef-container">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-chef-royal-green text-chef-warm-ivory'
                  : 'bg-chef-royal-green/10 text-chef-royal-green hover:bg-chef-royal-green/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecipeFilters;
