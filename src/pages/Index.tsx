
import PageLayout from '@/components/PageLayout';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Projects from '@/components/Projects';
import WhyChefCircle from '@/components/WhyChefsCircle';
import GamificationDashboard from '@/components/GamificationDashboard';
import BlogPreview from '@/components/BlogPreview';
import SEO from '@/components/SEO';
import { useEffect } from 'react';

const Index = () => {
  // Fix any ID conflicts when the page loads
  useEffect(() => {
    const contactElements = document.querySelectorAll('[id="contact"]');
    if (contactElements.length > 1) {
      // If there are multiple elements with id="contact", rename one
      contactElements[1].id = 'contact-footer';
    }
  }, []);

  return (
    <PageLayout>
      <SEO 
        title="ChefCircle - Exclusive Online Culinary Club for Gen Z & Millennials" 
        description="Join ChefCircle, the premium online culinary club for passionate home cooks. Master cooking skills through live cook-alongs, exclusive classes, and an elite community of culinary enthusiasts."
        imageUrl="/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png"
        keywords={['culinary club', 'cooking classes', 'online cooking', 'chef training', 'culinary education', 'gen z cooking', 'millennial chefs', 'gourmet cooking', 'culinary community']}
      />
      <Hero />
      <Features />
      <WhyChefCircle />
      <GamificationDashboard />
      <Projects />
      <BlogPreview />
    </PageLayout>
  );
};

export default Index;
