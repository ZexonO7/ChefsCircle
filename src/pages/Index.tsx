import PageLayout from '@/components/PageLayout';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import WhyChefCircle from '@/components/WhyChefsCircle';
import GamificationDashboard from '@/components/GamificationDashboard';
import BlogPreview from '@/components/BlogPreview';
import SEO from '@/components/SEO';
import ScrollMarquee from '@/components/motion/ScrollMarquee';
import Reveal from '@/components/motion/Reveal';
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
        title="ChefsCircle - The Exclusive Culinary Club" 
        description="Join ChefsCircle, the premium online culinary club for passionate home cooks. Master cooking skills through live cook-alongs, exclusive classes, and an elite community of culinary enthusiasts, Founded & Built by Advithya Bhardwaj."
        imageUrl="/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png"
        keywords={['culinary club', 'cooking classes', 'online cooking', 'chef training', 'culinary education', 'gen z cooking', 'millennial chefs', 'gourmet cooking', 'culinary community']}
      />
      <Hero />
      
      <Reveal variant="fade" duration={1.2}>
        <ScrollMarquee />
      </Reveal>

      <Reveal variant="up" y={40} delay={0.1}>
        <Features />
      </Reveal>

      <Reveal variant="scale" delay={0.1}>
        <WhyChefCircle />
      </Reveal>

      {/* Accent divider line */}
      <Reveal variant="fade" delay={0.2}>
        <div className="relative py-6 overflow-hidden">
          <div className="mx-auto max-w-6xl px-6">
            <div className="h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          </div>
        </div>
      </Reveal>

      <Reveal variant="up" y={50}>
        <GamificationDashboard />
      </Reveal>

      <Reveal variant="up" y={30} delay={0.2}>
        <BlogPreview />
      </Reveal>
    </PageLayout>
  );
};

export default Index;
