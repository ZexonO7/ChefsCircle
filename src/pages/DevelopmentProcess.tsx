
import { ArrowLeft, CheckCircle, Clock, ChefHat, Users, BookOpen, Award, Utensils, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';

const DevelopmentProcess = () => {
  const [activeProcess, setActiveProcess] = useState(1);
  const processRef = useRef<HTMLDivElement>(null);
  const processSectionsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const processes = [{
    id: 1,
    title: "Skill Assessment & Goals",
    description: "We begin by understanding your current culinary skill level and defining clear learning objectives for your culinary journey.",
    steps: ["Personal cooking skill evaluation", "Goal setting and learning path design", "Kitchen setup and equipment assessment", "Initial technique and preference analysis"]
  }, {
    id: 2,
    title: "Personalized Curriculum",
    description: "Our culinary experts create a customized learning path that matches your skill level, interests, and culinary aspirations.",
    steps: ["Custom course selection based on assessment", "Technique-focused module design", "Seasonal menu planning integration", "Progress tracking and milestone setup"]
  }, {
    id: 3,
    title: "Live Cook-Along Training",
    description: "Join interactive cooking sessions with master chefs, learning professional techniques through hands-on practice and real-time guidance.",
    steps: ["Live chef-led cooking sessions", "Real-time technique correction", "Interactive Q&A during cooking", "Community feedback and peer learning"]
  }, {
    id: 4,
    title: "Skill Mastery & Certification",
    description: "Practice and perfect your techniques through structured challenges, receiving expert feedback and earning recognized culinary certifications.",
    steps: ["Practical cooking challenges", "Expert chef evaluation", "Skill certification upon mastery", "Portfolio building and documentation"]
  }, {
    id: 5,
    title: "Ongoing Development",
    description: "Continue your culinary journey with advanced techniques, seasonal specialties, and exclusive masterclasses from renowned chefs.",
    steps: ["Advanced technique workshops", "Seasonal cooking specializations", "Guest chef masterclasses", "Culinary community leadership opportunities"]
  }];

  useEffect(() => {
    processSectionsRef.current = processes.map((_, i) => processSectionsRef.current[i] || null);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        entries[0].target.classList.add('animate-fade-in');
        (entries[0].target as HTMLElement).style.opacity = '1';
        observer.unobserve(entries[0].target);
      }
    }, {
      threshold: 0.1
    });
    if (processRef.current) {
      observer.observe(processRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const viewportHeight = window.innerHeight;
      const viewportCenter = viewportHeight / 2;
      let closestSection = null;
      let closestDistance = Infinity;
      processSectionsRef.current.forEach((section, index) => {
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestSection = index;
        }
      });
      if (closestSection !== null) {
        setActiveProcess(closestSection + 1);
      }
    };
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });
    setTimeout(handleScroll, 100);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-chef-warm-ivory">
      <PageLayout>
        <SEO 
          title="Our Culinary Learning Process - ChefsCircle" 
          description="Discover how ChefsCircle transforms passionate home cooks into confident chefs through our structured learning methodology and expert guidance."
          imageUrl="/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png"
          keywords={['culinary education', 'cooking process', 'chef training', 'skill development', 'culinary methodology']}
        />
        <section className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <Link to="/" className="flex items-center text-chef-charcoal/60 hover:text-chef-charcoal mb-8 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
              
              <h1 className="text-4xl font-bold mb-8 text-chef-charcoal font-playfair">Our Culinary Learning Process</h1>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-chef-charcoal/70 mb-12 font-inter">
                  We've refined our culinary education methodology to minimize learning curves and maximize skill development, 
                  ensuring your culinary journey moves efficiently from passion to mastery.
                </p>
                
                <div className="relative mt-12" ref={processRef} style={{ opacity: 0 }}>
                  <div className="hidden md:block absolute top-0 left-1/2 w-0.5 h-full bg-chef-royal-green/20 -translate-x-1/2"></div>
                  
                  <div className="space-y-10 relative">
                    {processes.map((process, index) => (
                      <div 
                        key={process.id} 
                        ref={el => processSectionsRef.current[index] = el} 
                        className={cn(
                          "relative flex flex-col md:flex-row md:items-center gap-6", 
                          index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse text-right"
                        )}
                      >
                        <div className="md:w-1/2">
                          <div className={cn(
                            "md:absolute top-0 left-1/2 md:-translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all duration-300",
                            activeProcess === process.id 
                              ? "bg-chef-royal-green text-chef-warm-ivory scale-110" 
                              : "bg-chef-warm-ivory text-chef-royal-green border border-chef-royal-green"
                          )} 
                          onClick={() => setActiveProcess(process.id)}
                          >
                            <span className="font-bold">{process.id}</span>
                          </div>
                          
                          <h3 className="text-xl font-bold mb-2 mt-3 md:mt-0 text-chef-charcoal font-playfair">{process.title}</h3>
                          <p className="text-chef-charcoal/70 mb-3 text-sm font-inter">{process.description}</p>
                          
                          <button 
                            onClick={() => setActiveProcess(process.id)} 
                            className={cn(
                              "text-sm font-medium transition-colors",
                              activeProcess === process.id 
                                ? "text-chef-royal-green" 
                                : "text-chef-charcoal/60 hover:text-chef-royal-green"
                            )}
                          >
                            {activeProcess === process.id ? "Currently Viewing" : "View Details"}
                          </button>
                        </div>
                        
                        <div className={cn(
                          "md:w-1/2 chef-card p-5 transition-all duration-300",
                          activeProcess === process.id 
                            ? "opacity-100 translate-y-0 shadow-chef-luxury border-chef-royal-green/30" 
                            : "opacity-50 md:opacity-30 hover:opacity-70 cursor-pointer"
                        )} 
                        onClick={() => setActiveProcess(process.id)}
                        >
                          <h4 className="font-semibold mb-3 text-chef-charcoal font-playfair">Key Activities:</h4>
                          <ul className="space-y-2">
                            {process.steps.map((step, stepIndex) => (
                              <li key={stepIndex} className="flex items-start">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-chef-royal-green/20 flex items-center justify-center mt-0.5 mr-2">
                                  <CheckCircle className="w-3 h-3 text-chef-royal-green" />
                                </span>
                                <span className="text-chef-charcoal text-sm text-left font-inter">{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="chef-card p-8 my-12 border border-chef-royal-green/20">
                  <h3 className="text-xl font-semibold mb-4 text-chef-charcoal font-playfair">Our Learning Principles</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-chef-royal-green mt-0.5 mr-2" />
                      <span className="font-inter">Hands-on practice with immediate expert feedback</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-chef-royal-green mt-0.5 mr-2" />
                      <span className="font-inter">Progressive skill building from basics to advanced techniques</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-chef-royal-green mt-0.5 mr-2" />
                      <span className="font-inter">Community-driven learning with peer support and inspiration</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-chef-royal-green mt-0.5 mr-2" />
                      <span className="font-inter">Personalized learning paths adapted to individual goals</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-chef-royal-green mt-0.5 mr-2" />
                      <span className="font-inter">Focus on practical skills that enhance everyday cooking</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-12 pt-8 border-t border-chef-royal-green/20">
                <Link 
                  to="/about" 
                  className="chef-button-primary inline-flex items-center group"
                >
                  Learn More About ChefsCircle
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </PageLayout>
    </div>
  );
};

export default DevelopmentProcess;

const ArrowRight = ({ className = "w-4 h-4" }: { className?: string; }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);
