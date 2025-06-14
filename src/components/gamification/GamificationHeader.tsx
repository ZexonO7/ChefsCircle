
import { Trophy } from 'lucide-react';

const GamificationHeader = () => {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-chef-royal-blue/20 text-chef-royal-blue rounded-full text-sm font-medium">
        <Trophy className="w-4 h-4" />
        Culinary Journey
      </div>
      <h2 className="text-4xl md:text-5xl font-bold mb-6 text-chef-charcoal font-playfair">
        Your Cooking Progress
      </h2>
      <p className="text-chef-charcoal/70 text-lg max-w-3xl mx-auto font-inter">
        Level up your culinary skills, earn badges, and compete with fellow chefs in our gamified cooking experience.
      </p>
    </div>
  );
};

export default GamificationHeader;
