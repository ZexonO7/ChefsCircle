
import React from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import ContactForm from '@/components/ContactForm';
import ContactInfo from '@/components/ContactInfo';

const Contact = () => {
  return (
    <PageLayout>
      <SEO 
        title="Contact Us - ChefsCircle"
        description="Get in touch with ChefsCircle. We'd love to hear from you about our culinary programs, courses, and community."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-chef-warm-ivory via-chef-cream to-chef-warm-ivory">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-playfair text-chef-charcoal mb-6">
              Get in <span className="text-chef-royal-green">Touch</span>
            </h1>
            
            <p className="chef-body text-chef-charcoal/70 mb-8 max-w-2xl mx-auto">
              Have questions about our programs? Want to join our culinary community? 
              We'd love to hear from you!
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12 px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8 border border-chef-royal-green/20">
              <h2 className="text-2xl font-playfair text-chef-charcoal mb-6">Send us a Message</h2>
              <ContactForm />
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <ContactInfo />
              
              {/* Additional Info */}
              <div className="bg-chef-royal-green/10 rounded-lg p-6 border border-chef-royal-green/20">
                <h3 className="text-xl font-playfair text-chef-charcoal mb-4">Quick Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-chef-charcoal">
                    <Clock className="w-5 h-5 text-chef-royal-green" />
                    <span>Response time: Within 24 hours</span>
                  </div>
                  <div className="flex items-center gap-3 text-chef-charcoal">
                    <Mail className="w-5 h-5 text-chef-royal-green" />
                    <span>We reply to all inquiries</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Contact;
