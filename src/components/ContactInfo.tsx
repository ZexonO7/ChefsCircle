import React from 'react';
import { Mail, Linkedin, Phone, ChefHat } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
const ContactInfo = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const handleScheduleConsultation = () => {
    // Open email to schedule a consultation
    window.location.href = 'mailto:Advithya@chefscircle.in?subject=Schedule a Culinary Consultation&body=Hi Advithya,%0D%0A%0D%0AI would like to schedule a consultation to discuss my culinary goals and how ChefsCircle can help me improve my cooking skills.%0D%0A%0D%0APlease let me know your availability.%0D%0A%0D%0AThank you!';
  };
  const handleJoinChefCircle = () => {
    if (user) {
      return; // Button shouldn't be visible when logged in
    }
    navigate('/auth');
  };
  return <section id="contact" className="bg-gradient-to-b from-chef-warm-ivory to-chef-royal-green text-white relative py-[25px] md:py-[40px]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-chef-warm-ivory text-chef-royal-green rounded-full text-sm font-medium font-inter">
            <ChefHat className="w-4 h-4" />
            Connect With Our Culinary Team
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-chef-warm-ivory font-playfair">
            Ready to Elevate Your Culinary Journey?
          </h2>
          <p className="text-chef-warm-ivory/90 text-lg max-w-3xl mx-auto font-inter">
            Join the ChefsCircle community and discover the art of exceptional cooking. Connect with our founder and start your journey to culinary mastery.
          </p>
        </div>

        <div className="flex justify-center">
          {/* Chef-Founder Profile */}
          <div className="chef-card p-8 border border-chef-gold/20 max-w-md">
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full mb-6 overflow-hidden border-4 border-chef-royal-green/20">
                <img src="/lovable-uploads/ad136f24-0f60-4aaf-a6d0-06788da943c4.png" alt="Advithya Bhardwaj - Founder & CEO of ChefsCircle" className="w-full h-full object-cover scale-125" style={{
                objectPosition: '25% 10%'
              }} />
              </div>
              <h3 className="text-2xl font-bold text-chef-charcoal mb-2 font-playfair">Advithya Bhardwaj</h3>
              <p className="text-chef-gold font-semibold mb-2 font-inter">Founder & Head Chef</p>
              <p className="text-chef-charcoal/70 mb-6 font-inter">Teen culinary prodigy turned entrepreneur, bringing innovative cooking communitys to the next generation.</p>
              <div className="flex flex-col space-y-3">
                <a href="mailto:Advithya@chefscircle.in" className="flex items-center text-chef-charcoal hover:text-chef-royal-green transition-colors font-inter">
                  <Mail className="w-5 h-5 mr-2" />
                  Advithya@chefscircle.in
                </a>
                <a href="https://www.linkedin.com/in/advithya-bhardwaj-05412a313/" target="_blank" rel="noopener noreferrer" className="flex items-center text-chef-charcoal hover:text-chef-royal-green transition-colors font-inter">
                  <Linkedin className="w-5 h-5 mr-2" />
                  LinkedIn Profile
                </a>
                <a href="tel:+919810273085" className="flex items-center text-chef-charcoal hover:text-chef-royal-green transition-colors font-inter">
                  <Phone className="w-5 h-5 mr-2" />
                  +91 98102 73085
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          
        </div>
      </div>
    </section>;
};
export default ContactInfo;