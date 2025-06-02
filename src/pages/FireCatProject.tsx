
import ProjectPageLayout from '@/components/ProjectPageLayout';
import { ChefHat, Users, BookOpen, Award, Clock, Utensils } from 'lucide-react';
import SEO from '@/components/SEO';

const FireCatProject = () => {
  return (
    <div className="min-h-screen bg-chef-warm-ivory">
      <SEO 
        title="Live Cook-Along Sessions - ChefCircle" 
        description="Experience our signature live cook-along sessions where master chefs guide you through gourmet recipes in real-time."
        imageUrl="/lovable-uploads/93ab0638-8190-4ccf-897f-21fda7f4f5ad.png"
        keywords={['live cooking', 'cook-along', 'chef classes', 'culinary education', 'interactive cooking']}
      />
      <ProjectPageLayout
        title="Live Cook-Along Sessions"
        subtitle="Interactive culinary experiences with master chefs"
        imageUrl="/lovable-uploads/93ab0638-8190-4ccf-897f-21fda7f4f5ad.png"
        brandName="ChefCircle"
        darkMode={false}
      >
        <h2 className="text-3xl font-bold mb-6 text-chef-charcoal font-playfair">Experience: Live Cook-Along Sessions</h2>
        
        <div className="chef-card p-6 mb-8">
          <h3 className="text-xl font-semibold mb-2 text-chef-charcoal font-playfair">About Our Sessions</h3>
          <p className="text-chef-charcoal/70 font-inter">
            ChefCircle's live cook-along sessions represent the pinnacle of interactive culinary education. 
            Our members join renowned chefs in real-time cooking experiences, learning professional techniques 
            while preparing restaurant-quality dishes from their own kitchens.
          </p>
        </div>
        
        <h3 className="text-2xl font-semibold mb-4 text-chef-charcoal font-playfair">What Makes Our Sessions Special</h3>
        <p className="text-chef-charcoal/70 mb-6 font-inter">
          Unlike traditional cooking shows, our live sessions provide interactive guidance, real-time Q&A, 
          and personalized instruction tailored to each participant's skill level and kitchen setup.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-chef-charcoal font-playfair">Session Features</h3>
        <p className="text-chef-charcoal/70 mb-6 font-inter">
          Our comprehensive approach combines expert instruction with premium ingredients and exclusive 
          techniques, creating an unparalleled culinary learning experience:
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="chef-card p-6 chef-hover-lift flex items-start">
            <ChefHat className="h-6 w-6 text-chef-royal-green mr-3 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-semibold mb-2 text-chef-charcoal font-playfair">Expert Instruction</h4>
              <p className="text-chef-charcoal/70 font-inter">Live guidance from Michelin-starred chefs and culinary masters.</p>
            </div>
          </div>
          
          <div className="chef-card p-6 chef-hover-lift flex items-start">
            <Users className="h-6 w-6 text-chef-royal-blue mr-3 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-semibold mb-2 text-chef-charcoal font-playfair">Interactive Community</h4>
              <p className="text-chef-charcoal/70 font-inter">Real-time chat and Q&A with fellow culinary enthusiasts.</p>
            </div>
          </div>
          
          <div className="chef-card p-6 chef-hover-lift flex items-start">
            <BookOpen className="h-6 w-6 text-chef-royal-green mr-3 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-semibold mb-2 text-chef-charcoal font-playfair">Recipe Collections</h4>
              <p className="text-chef-charcoal/70 font-inter">Access to exclusive recipes and preparation guides after each session.</p>
            </div>
          </div>
          
          <div className="chef-card p-6 chef-hover-lift flex items-start">
            <Award className="h-6 w-6 text-chef-royal-blue mr-3 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-semibold mb-2 text-chef-charcoal font-playfair">Skill Certification</h4>
              <p className="text-chef-charcoal/70 font-inter">Earn certificates for completed techniques and mastered dishes.</p>
            </div>
          </div>
        </div>
        
        <h4 className="text-xl font-semibold mb-4 text-chef-charcoal font-playfair">Session Highlights</h4>
        <ul className="list-disc pl-6 space-y-2 mb-8 text-chef-charcoal/70 font-inter">
          <li>Professional knife skills and cutting techniques</li>
          <li>Sauce making and flavor balancing</li>
          <li>Seasonal ingredient selection and preparation</li>
          <li>Plating and presentation mastery</li>
          <li>Wine and food pairing guidance</li>
        </ul>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-chef-charcoal font-playfair">Member Benefits</h3>
        <div className="space-y-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-chef-royal-green/20 flex items-center justify-center text-chef-royal-green mr-3 mt-1">✓</div>
            <div>
              <h4 className="font-semibold text-chef-charcoal font-playfair">Premium Ingredients Delivered</h4>
              <p className="text-chef-charcoal/70 font-inter">Receive curated ingredient boxes for each session, sourced from premium suppliers.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-chef-royal-blue/20 flex items-center justify-center text-chef-royal-blue mr-3 mt-1">✓</div>
            <div>
              <h4 className="font-semibold text-chef-charcoal font-playfair">Personalized Feedback</h4>
              <p className="text-chef-charcoal/70 font-inter">Get individual attention and constructive feedback on your culinary creations.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-chef-royal-green/20 flex items-center justify-center text-chef-royal-green mr-3 mt-1">✓</div>
            <div>
              <h4 className="font-semibold text-chef-charcoal font-playfair">Exclusive Access</h4>
              <p className="text-chef-charcoal/70 font-inter">Join intimate sessions limited to 20 participants for optimal learning experience.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-chef-royal-blue/20 flex items-center justify-center text-chef-royal-blue mr-3 mt-1">✓</div>
            <div>
              <h4 className="font-semibold text-chef-charcoal font-playfair">Recording Access</h4>
              <p className="text-chef-charcoal/70 font-inter">Review sessions anytime with high-quality recordings and supplementary materials.</p>
            </div>
          </div>
        </div>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-chef-charcoal font-playfair">Transform Your Cooking</h3>
        <p className="text-chef-charcoal/70 font-inter">
          ChefCircle's live cook-along sessions have successfully elevated thousands of home cooks to confident, 
          skilled chefs. Our innovative approach combines expert instruction with community support, creating 
          an environment where culinary mastery flourishes and passion for exceptional food grows.
        </p>
      </ProjectPageLayout>
    </div>
  );
};

export default FireCatProject;
