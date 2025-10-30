import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AdvithyaBhardwaj = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageLayout>
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <Link 
              to="/about" 
              className="inline-flex items-center text-chef-charcoal/60 hover:text-chef-charcoal mb-6 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to About
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-chef-royal-blue/20">
                <img 
                  src="/lovable-uploads/6ee4e578-88a2-4aed-b6ff-ac4750539739.png" 
                  alt="Advithya Bhardwaj" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-chef-charcoal font-playfair">
                Advithya Bhardwaj
              </h1>
              <p className="text-xl text-chef-royal-blue font-medium mb-4">
                Founder & CEO
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  asChild
                  variant="outline"
                  className="border-chef-royal-blue text-chef-royal-blue hover:bg-chef-royal-blue hover:text-white"
                >
                  <a 
                    href="https://www.linkedin.com/in/advithya-bhardwaj" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    LinkedIn Profile
                  </a>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-8"
            >
              <Card className="bg-chef-warm-ivory border border-chef-royal-green/20">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4 text-chef-charcoal font-playfair">
                    About Advithya
                  </h2>
                  <div className="space-y-4 text-chef-charcoal/70">
                    <p>
                      Advithya Bhardwaj is the visionary founder and CEO of ChefsCircle, an aspiring 
                      restaurateur with a passion for elevating home cooking to professional standards.
                    </p>
                    <p>
                      With a deep commitment to culinary excellence, Advithya founded ChefsCircle to 
                      bridge the gap between amateur cooking enthusiasts and professional expertise. 
                      His vision is to create an elite community where passionate food lovers can 
                      access world-class culinary education, premium ingredients, and connect with 
                      like-minded individuals.
                    </p>
                    <p>
                      As an aspiring restaurateur, Advithya brings both entrepreneurial spirit and 
                      culinary passion to ChefsCircle, constantly innovating to provide members with 
                      the best possible experience in their gastronomic journey.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-chef-warm-ivory border border-chef-royal-green/20">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4 text-chef-charcoal font-playfair">
                    Vision & Mission
                  </h2>
                  <div className="space-y-4 text-chef-charcoal/70">
                    <p>
                      Advithya's mission is to democratize premium culinary education and make it 
                      accessible to the next generation of food enthusiasts who demand quality, 
                      authenticity, and innovation.
                    </p>
                    <p>
                      Under his leadership, ChefsCircle has become a trusted platform for culinary 
                      education, focusing on:
                    </p>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      <li>Exclusive access to professional culinary techniques</li>
                      <li>Building a community of passionate food enthusiasts</li>
                      <li>Providing premium ingredients and resources</li>
                      <li>Creating innovative live cook-along experiences</li>
                      <li>Fostering excellence in home cooking</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-chef-warm-ivory border border-chef-royal-green/20">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-4 text-chef-charcoal font-playfair">
                    Connect
                  </h2>
                  <p className="text-chef-charcoal/70 mb-4">
                    Interested in joining ChefsCircle or learning more about our programs? 
                    Connect with Advithya on LinkedIn or reach out through our contact page.
                  </p>
                  <div className="flex gap-4">
                    <Button asChild>
                      <a 
                        href="https://www.linkedin.com/in/advithya-bhardwaj" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        LinkedIn
                      </a>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to="/contact">Contact Us</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default AdvithyaBhardwaj;
