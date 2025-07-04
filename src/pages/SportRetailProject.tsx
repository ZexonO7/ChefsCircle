
import ProjectPageLayout from '@/components/ProjectPageLayout';
import { ChefHat, Users, BookOpen, Award, Clock, Utensils } from 'lucide-react';
import SEO from '@/components/SEO';

const SportRetailProject = () => {
  return (
    <div className="min-h-screen bg-chef-warm-ivory">
      <SEO 
        title="Technique Masterclasses - ChefsCircle" 
        description="Master advanced culinary techniques through our exclusive technique-focused masterclasses with world-renowned chefs."
        imageUrl="/lovable-uploads/4bfa0d71-3ed2-4693-90b6-35142468907f.png"
        keywords={['culinary techniques', 'masterclass', 'advanced cooking', 'chef skills', 'professional cooking']}
      />
      <ProjectPageLayout
        title="Technique Masterclasses"
        subtitle="Advanced culinary skills and professional methods"
        imageUrl="/lovable-uploads/4bfa0d71-3ed2-4693-90b6-35142468907f.png"
        brandName="ChefsCircle"
        darkMode={false}
      >
        <h2 className="text-3xl font-bold mb-6 text-chef-charcoal font-playfair">Experience: Technique Masterclasses</h2>
        
        <div className="chef-card p-6 mb-8">
          <h3 className="text-xl font-semibold mb-2 text-chef-charcoal font-playfair">Advanced Culinary Education</h3>
          <p className="text-chef-charcoal/70 font-inter">
            Our technique masterclasses focus on specific culinary skills, from knife work and sauce making to 
            advanced cooking methods. Each class is designed to elevate your cooking through mastery of 
            fundamental and advanced techniques used in professional kitchens worldwide.
          </p>
        </div>
        
        <h3 className="text-2xl font-semibold mb-4 text-chef-charcoal font-playfair">Masterclass Categories</h3>
        <p className="text-chef-charcoal/70 mb-6 font-inter">
          Our comprehensive technique library covers every aspect of professional cooking, from basic knife 
          skills to advanced molecular gastronomy techniques, ensuring complete culinary education.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-chef-charcoal font-playfair">Featured Techniques</h3>
        <p className="text-chef-charcoal/70 mb-6 font-inter">
          Learn from master chefs who have perfected these techniques in Michelin-starred restaurants 
          and culinary institutions around the world:
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="chef-card p-6 chef-hover-lift flex items-start">
            <Utensils className="h-6 w-6 text-chef-royal-green mr-3 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-semibold mb-2 text-chef-charcoal font-playfair">Knife Skills Mastery</h4>
              <p className="text-chef-charcoal/70 font-inter">Professional cutting techniques, knife care, and precision vegetable preparation.</p>
            </div>
          </div>
          
          <div className="chef-card p-6 chef-hover-lift flex items-start">
            <ChefHat className="h-6 w-6 text-chef-royal-blue mr-3 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-semibold mb-2 text-chef-charcoal font-playfair">Sauce Foundations</h4>
              <p className="text-chef-charcoal/70 font-inter">Master the five mother sauces and modern sauce techniques for perfect flavor balance.</p>
            </div>
          </div>
          
          <div className="chef-card p-6 chef-hover-lift flex items-start">
            <BookOpen className="h-6 w-6 text-chef-royal-green mr-3 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-semibold mb-2 text-chef-charcoal font-playfair">Pastry Techniques</h4>
              <p className="text-chef-charcoal/70 font-inter">From basic doughs to advanced patisserie skills and chocolate work.</p>
            </div>
          </div>
          
          <div className="chef-card p-6 chef-hover-lift flex items-start">
            <Award className="h-6 w-6 text-chef-royal-blue mr-3 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-semibold mb-2 text-chef-charcoal font-playfair">Meat & Seafood</h4>
              <p className="text-chef-charcoal/70 font-inter">Butchery, fish preparation, and cooking proteins to perfection.</p>
            </div>
          </div>
        </div>
        
        <h4 className="text-xl font-semibold mb-4 text-chef-charcoal font-playfair">What You'll Master</h4>
        <ul className="list-disc pl-6 space-y-2 mb-8 text-chef-charcoal/70 font-inter">
          <li>Professional knife techniques and kitchen efficiency</li>
          <li>Temperature control and timing for perfect results</li>
          <li>Flavor building and seasoning mastery</li>
          <li>Presentation and plating like a professional chef</li>
          <li>Food safety and professional kitchen practices</li>
        </ul>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-chef-charcoal font-playfair">Masterclass Benefits</h3>
        <div className="space-y-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-chef-royal-green/20 flex items-center justify-center text-chef-royal-green mr-3 mt-1">✓</div>
            <div>
              <h4 className="font-semibold text-chef-charcoal font-playfair">Expert Instruction</h4>
              <p className="text-chef-charcoal/70 font-inter">Learn from chefs who have mastered these techniques in world-class restaurants.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-chef-royal-blue/20 flex items-center justify-center text-chef-royal-blue mr-3 mt-1">✓</div>
            <div>
              <h4 className="font-semibold text-chef-charcoal font-playfair">Progressive Learning</h4>
              <p className="text-chef-charcoal/70 font-inter">Build skills systematically from basic techniques to advanced professional methods.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-chef-royal-green/20 flex items-center justify-center text-chef-royal-green mr-3 mt-1">✓</div>
            <div>
              <h4 className="font-semibold text-chef-charcoal font-playfair">Certification Program</h4>
              <p className="text-chef-charcoal/70 font-inter">Earn recognized certificates for each technique mastered and add to your culinary portfolio.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-chef-royal-blue/20 flex items-center justify-center text-chef-royal-blue mr-3 mt-1">✓</div>
            <div>
              <h4 className="font-semibold text-chef-charcoal font-playfair">Lifetime Access</h4>
              <p className="text-chef-charcoal/70 font-inter">Return to masterclasses anytime to refresh your skills and perfect your techniques.</p>
            </div>
          </div>
        </div>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-chef-charcoal font-playfair">Elevate Your Culinary Skills</h3>
        <p className="text-chef-charcoal/70 font-inter">
          ChefsCircle's technique masterclasses provide the foundation for exceptional cooking. Whether you're 
          looking to improve your home cooking or pursuing professional culinary aspirations, our comprehensive 
          technique training ensures you have the skills and confidence to create extraordinary dishes.
        </p>
      </ProjectPageLayout>
    </div>
  );
};

export default SportRetailProject;
