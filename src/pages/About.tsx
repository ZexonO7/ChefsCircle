import { ArrowLeft, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
const About = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return <PageLayout>
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <Link to="/" className="inline-flex items-center text-chef-charcoal/60 hover:text-chef-charcoal mb-6 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            
            <motion.h1 initial={{
            opacity: 0,
            y: -10
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }} className="text-4xl font-bold mb-6 text-chef-charcoal font-playfair">About ChefsCircle</motion.h1>
            
            <div className="prose prose-lg max-w-none">
              <motion.p initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} transition={{
              duration: 0.5,
              delay: 0.2
            }} className="text-xl text-chef-charcoal/70 mb-12">
                Founded by Advithya Bhardwaj, we're a passionate community of culinary innovators dedicated to transforming home cooking through exclusive education and elite networking.
              </motion.p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                <motion.div initial={{
                opacity: 0,
                x: -20
              }} animate={{
                opacity: 1,
                x: 0
              }} transition={{
                duration: 0.6
              }} className="space-y-6">
                  <h2 className="text-3xl font-bold text-chef-charcoal font-playfair">Our Mission</h2>
                  <p className="text-chef-charcoal/70">
                    At ChefCircle, we're on a mission to elevate home cooking to professional standards through 
                    exclusive access to world-class culinary education, premium ingredients, and an elite community 
                    of passionate food enthusiasts.
                  </p>
                  <p className="text-chef-charcoal/70">
                    We believe that exceptional cooking skills should be accessible to the next generation of 
                    culinary enthusiasts who demand quality, authenticity, and innovation in their gastronomic journey.
                  </p>
                </motion.div>
                
                <motion.div initial={{
                opacity: 0,
                x: 20
              }} animate={{
                opacity: 1,
                x: 0
              }} transition={{
                duration: 0.6,
                delay: 0.2
              }} className="bg-chef-warm-ivory rounded-2xl p-8 border border-chef-royal-blue/20">
                  <h3 className="text-2xl font-bold mb-4 text-chef-charcoal font-playfair">Our Values</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-chef-royal-blue mt-1 mr-3 flex-shrink-0" />
                      <span><strong>Excellence:</strong> We maintain the highest standards in culinary education and community experience.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-chef-royal-blue mt-1 mr-3 flex-shrink-0" />
                      <span><strong>Authenticity:</strong> Every recipe, technique, and ingredient we share is carefully curated for quality.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-chef-royal-blue mt-1 mr-3 flex-shrink-0" />
                      <span><strong>Community:</strong> We foster connections between passionate culinary enthusiasts worldwide.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-chef-royal-blue mt-1 mr-3 flex-shrink-0" />
                      <span><strong>Innovation:</strong> We continuously explore new techniques and trends in modern gastronomy.</span>
                    </li>
                  </ul>
                </motion.div>
              </div>
              
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.4
            }} className="mb-16">
                <h2 className="text-3xl font-bold mb-6 text-chef-charcoal font-playfair">Our Story</h2>
                <div className="bg-white rounded-xl border border-chef-royal-green/20 p-8 shadow-chef-luxury">
                  <p className="text-chef-charcoal/70 mb-4">ChefsCircle was born from a simple observation by founder Advithya Bhardwaj: while the culinary world was experiencing a renaissance, young food enthusiasts lacked access to truly premium culinary education and exclusive community experiences.</p>
                  <p className="text-chef-charcoal/70 mb-4">
                    Advithya started with the ambition to create an elite culinary club that would bridge the gap between 
                    amateur cooking and professional expertise. After connecting with renowned chefs and culinary experts 
                    worldwide, we developed our unique live cook-along format and premium membership experience.
                  </p>
                  <p className="text-chef-charcoal/70">Today, ChefsCircle serves passionate Gen Z and millennial home chefs who demand excellence in their culinary journey. Our members gain access to exclusive techniques, premium ingredients, and a community of like-minded culinary enthusiasts.</p>
                </div>
              </motion.div>
              
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.6,
              delay: 0.6
            }} className="mb-16">
                <h2 className="text-3xl font-bold mb-6 text-chef-charcoal font-playfair">Our Culinary Team</h2>
                <p className="text-chef-charcoal/70 mb-8">
                  Our team combines Michelin-trained chefs, culinary educators, and food innovation experts to deliver 
                  an unparalleled cooking education experience.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[{
                  name: "Advithya Bhardwaj",
                  role: "Founder and CEO",
                  bio: "Founder and CEO of ChefsCircle and Aspiring restaurateur",
                  image: "/lovable-uploads/6ee4e578-88a2-4aed-b6ff-ac4750539739.png"
                }, {
                  name: "hiring",
                  role: "Social Media Manager",
                  bio: "Please contact Advithya Bhardwaj or view the details for the internship on Linkedin.",
                  image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                }, {
                  name: "Chef Elena Dubois",
                  role: "Pastry & Dessert Expert",
                  bio: "French-trained pastry chef specializing in modern dessert techniques and artisanal confections.",
                  image: "https://images.unsplash.com/photo-1494790108755-2616b612b098?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                }, {
                  name: "Chef David Thompson",
                  role: "Community Experience Manager",
                  bio: "Culinary educator focused on creating engaging cooking experiences and building culinary communities.",
                  image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
                }].map((member, i) => <Card key={i} className="bg-chef-warm-ivory border border-chef-royal-green/20 overflow-hidden hover:shadow-chef-luxury transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col items-center text-center">
                          <div className="w-32 h-32 relative mb-4 rounded-full overflow-hidden">
                            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                          </div>
                          <h3 className="font-bold text-lg text-chef-charcoal font-playfair">{member.name}</h3>
                          <p className="text-chef-royal-blue text-sm mb-2 font-medium">{member.role}</p>
                          <p className="text-chef-charcoal/70 text-sm">{member.bio}</p>
                        </div>
                      </CardContent>
                    </Card>)}
                </div>
              </motion.div>
            </div>
            
            <div className="mt-16 pt-8 border-t border-chef-royal-green/20">
              <Link to="/careers" className="inline-flex items-center px-6 py-3 bg-chef-royal-blue text-white rounded-lg hover:bg-chef-blue-light transition-all group">
                Join Our Culinary Team
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>;
};
export default About;