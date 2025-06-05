
import PageLayout from '@/components/PageLayout';
import { ArrowLeft, Mail, Linkedin, Phone, ChefHat, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { useEffect } from 'react';
import SEO from '@/components/SEO';

const Careers = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen bg-chef-warm-ivory">
      <PageLayout showContact={false}>
        <SEO 
          title="Join Our Culinary Team - ChefCircle Careers" 
          description="Join ChefCircle's passionate team of culinary educators and food enthusiasts. We're looking for talented individuals to help revolutionize culinary education."
          imageUrl="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          keywords={['culinary careers', 'chef jobs', 'cooking instructor', 'culinary education', 'food industry careers']}
        />
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <Link to="/" className="inline-flex items-center text-chef-charcoal/60 hover:text-chef-charcoal mb-6 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
              
              <motion.h1 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }} 
                className="text-4xl font-bold mb-6 text-chef-charcoal font-playfair"
              >
                Join Our Culinary Team
              </motion.h1>
              
              <div className="prose prose-lg max-w-none">
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ duration: 0.5, delay: 0.2 }} 
                  className="text-xl text-chef-charcoal/70 mb-4 font-inter"
                >
                  We're looking for passionate culinary innovators to help us revolutionize the online cooking education industry.
                </motion.p>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-xl text-chef-charcoal/70 mb-12 font-inter"
                >
                  We welcome both full-time culinary professionals and interns who are eager to contribute to the future of culinary education.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.6 }}
                  className="mb-16"
                >
                  <h2 className="text-3xl font-bold mb-6 text-chef-charcoal font-playfair">Why Join ChefCircle?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[
                      {
                        icon: <ChefHat className="w-8 h-8 text-chef-royal-green" />,
                        title: "Culinary Innovation",
                        description: "Work with cutting-edge culinary education technology that's changing how people learn to cook."
                      },
                      {
                        icon: <Users className="w-8 h-8 text-chef-royal-blue" />,
                        title: "Community Impact",
                        description: "Create experiences that bring together passionate food enthusiasts from around the world."
                      },
                      {
                        icon: <Award className="w-8 h-8 text-chef-royal-green" />,
                        title: "Professional Growth",
                        description: "Develop your skills in a rapidly expanding field with diverse culinary challenges and opportunities."
                      }
                    ].map((benefit, i) => (
                      <div key={i} className="chef-card p-6 h-full chef-hover-lift">
                        <div className="mb-4">{benefit.icon}</div>
                        <h3 className="font-bold text-lg mb-2 text-chef-charcoal font-playfair">{benefit.title}</h3>
                        <p className="text-chef-charcoal/70 font-inter">{benefit.description}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="chef-card p-8 shadow-chef-luxury mt-12">
                    <h3 className="font-bold text-xl mb-6 text-chef-charcoal font-playfair">Contact Our Community Director</h3>
                    <div className="chef-card bg-chef-warm-ivory p-6 border border-chef-royal-green/20">
                      <div className="flex flex-col items-center text-center">
                        <img 
                          src="https://images.unsplash.com/photo-1494790108755-2616b612b098?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                          alt="Elena Dubois"
                          className="w-32 h-32 rounded-full mb-4 object-cover"
                        />
                        <h3 className="text-xl font-bold text-chef-charcoal font-playfair">Elena Dubois</h3>
                        <p className="text-chef-royal-blue mb-4 font-medium">Community Director</p>
                        <div className="flex flex-col space-y-3">
                          <a href="mailto:elena@chefcircle.com" className="flex items-center text-chef-charcoal hover:text-chef-royal-blue transition-colors">
                            <Mail className="w-5 h-5 mr-2" />
                            elena@chefcircle.com
                          </a>
                          <a 
                            href="https://www.linkedin.com/in/elena-dubois-chef/" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-chef-charcoal hover:text-chef-royal-blue transition-colors"
                          >
                            <Linkedin className="w-5 h-5 mr-2" />
                            LinkedIn Profile
                          </a>
                          <a href="tel:+1555-CHEF-123" className="flex items-center text-chef-charcoal hover:text-chef-royal-blue transition-colors">
                            <Phone className="w-5 h-5 mr-2" />
                            +1 (555) CHEF-123
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </PageLayout>
    </div>
  );
};

export default Careers;
