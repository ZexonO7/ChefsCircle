
import ProjectPageLayout from '@/components/ProjectPageLayout';
import { ChefHat, Leaf, Calendar, Award, Clock, Utensils } from 'lucide-react';
import SEO from '@/components/SEO';

const WorkwearProject = () => {
  return (
    <div className="min-h-screen bg-chef-warm-ivory">
      <SEO 
        title="Seasonal Menus - ChefCircle" 
        description="Discover the art of seasonal cooking with our farm-to-table menu experiences featuring the finest seasonal ingredients."
        imageUrl="/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png"
        keywords={['seasonal cooking', 'farm to table', 'seasonal menus', 'fresh ingredients', 'seasonal recipes']}
      />
      <ProjectPageLayout
        title="Seasonal Menus"
        subtitle="Farm-to-table cooking with seasonal ingredients"
        imageUrl="/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png"
        brandName="ChefCircle"
        darkMode={false}
      >
        <h2 className="text-3xl font-bold mb-6 text-chef-charcoal font-playfair">Experience: Seasonal Menu Collection</h2>
        
        <div className="chef-card p-6 mb-8">
          <h3 className="text-xl font-semibold mb-2 text-chef-charcoal font-playfair">Celebrate Every Season</h3>
          <p className="text-chef-charcoal/70 font-inter">
            Our seasonal menu collection celebrates the finest ingredients each season has to offer. From spring's 
            delicate vegetables to winter's hearty comfort foods, learn to create menus that capture the essence 
            of each season while supporting local farmers and sustainable cooking practices.
          </p>
        </div>
        
        <h3 className="text-2xl font-semibold mb-4 text-chef-charcoal font-playfair">Seasonal Philosophy</h3>
        <p className="text-chef-charcoal/70 mb-6 font-inter">
          Cooking with the seasons isn't just about flavor—it's about connecting with nature's rhythm, 
          supporting local agriculture, and discovering how ingredients at their peak can transform your cooking.
        </p>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-chef-charcoal font-playfair">Seasonal Highlights</h3>
        <p className="text-chef-charcoal/70 mb-6 font-inter">
          Each season brings unique opportunities to explore new flavors, techniques, and presentations 
          that celebrate nature's bounty at its finest:
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 my-8">
          <div className="chef-card p-6 chef-hover-lift flex items-start">
            <Leaf className="h-6 w-6 text-chef-royal-green mr-3 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-semibold mb-2 text-chef-charcoal font-playfair">Spring Awakening</h4>
              <p className="text-chef-charcoal/70 font-inter">Fresh herbs, tender vegetables, and light preparations that celebrate renewal.</p>
            </div>
          </div>
          
          <div className="chef-card p-6 chef-hover-lift flex items-start">
            <ChefHat className="h-6 w-6 text-chef-royal-blue mr-3 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-semibold mb-2 text-chef-charcoal font-playfair">Summer Abundance</h4>
              <p className="text-chef-charcoal/70 font-inter">Peak produce, grilling techniques, and fresh preparations for warm weather dining.</p>
            </div>
          </div>
          
          <div className="chef-card p-6 chef-hover-lift flex items-start">
            <Calendar className="h-6 w-6 text-chef-royal-green mr-3 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-semibold mb-2 text-chef-charcoal font-playfair">Autumn Harvest</h4>
              <p className="text-chef-charcoal/70 font-inter">Rich flavors, warming spices, and preservation techniques for the season's bounty.</p>
            </div>
          </div>
          
          <div className="chef-card p-6 chef-hover-lift flex items-start">
            <Award className="h-6 w-6 text-chef-royal-blue mr-3 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-lg font-semibold mb-2 text-chef-charcoal font-playfair">Winter Comfort</h4>
              <p className="text-chef-charcoal/70 font-inter">Hearty dishes, slow cooking methods, and warming flavors for cold months.</p>
            </div>
          </div>
        </div>
        
        <h4 className="text-xl font-semibold mb-4 text-chef-charcoal font-playfair">What You'll Learn</h4>
        <ul className="list-disc pl-6 space-y-2 mb-8 text-chef-charcoal/70 font-inter">
          <li>Identifying peak seasonal ingredients and their optimal uses</li>
          <li>Menu planning that showcases seasonal flavors and textures</li>
          <li>Preservation techniques to extend seasonal enjoyment</li>
          <li>Sustainable cooking practices and supporting local producers</li>
          <li>Seasonal wine and beverage pairings</li>
        </ul>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-chef-charcoal font-playfair">Program Benefits</h3>
        <div className="space-y-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-chef-royal-green/20 flex items-center justify-center text-chef-royal-green mr-3 mt-1">✓</div>
            <div>
              <h4 className="font-semibold text-chef-charcoal font-playfair">Local Partnerships</h4>
              <p className="text-chef-charcoal/70 font-inter">Connect with local farmers and producers for the freshest seasonal ingredients.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-chef-royal-blue/20 flex items-center justify-center text-chef-royal-blue mr-3 mt-1">✓</div>
            <div>
              <h4 className="font-semibold text-chef-charcoal font-playfair">Year-Round Learning</h4>
              <p className="text-chef-charcoal/70 font-inter">Four complete seasonal menu collections with monthly ingredient spotlights.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-chef-royal-green/20 flex items-center justify-center text-chef-royal-green mr-3 mt-1">✓</div>
            <div>
              <h4 className="font-semibold text-chef-charcoal font-playfair">Sustainable Practices</h4>
              <p className="text-chef-charcoal/70 font-inter">Learn environmentally conscious cooking methods and zero-waste techniques.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-chef-royal-blue/20 flex items-center justify-center text-chef-royal-blue mr-3 mt-1">✓</div>
            <div>
              <h4 className="font-semibold text-chef-charcoal font-playfair">Menu Planning Tools</h4>
              <p className="text-chef-charcoal/70 font-inter">Comprehensive guides for creating your own seasonal menus and meal planning.</p>
            </div>
          </div>
        </div>
        
        <h3 className="text-2xl font-semibold mb-4 mt-8 text-chef-charcoal font-playfair">Cook with Nature's Calendar</h3>
        <p className="text-chef-charcoal/70 font-inter">
          ChefCircle's seasonal menu collection teaches you to cook in harmony with nature's cycles, 
          creating dishes that not only taste better but also support sustainable food systems. 
          Discover how seasonal cooking can transform your approach to food and deepen your 
          connection to the ingredients you use.
        </p>
      </ProjectPageLayout>
    </div>
  );
};

export default WorkwearProject;
