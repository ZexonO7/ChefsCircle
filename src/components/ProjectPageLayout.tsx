
import React from 'react';
import PageLayout from './PageLayout';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ProjectPageLayoutProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  brandName: string;
  darkMode?: boolean;
  children: React.ReactNode;
}

const ProjectPageLayout = ({ 
  title, 
  subtitle, 
  imageUrl, 
  brandName, 
  darkMode = false, 
  children 
}: ProjectPageLayoutProps) => {
  return (
    <PageLayout>
      <div 
        className={cn(
          "w-full pt-32 pb-16 relative",
          darkMode ? "bg-chef-charcoal text-chef-warm-ivory" : "bg-chef-warm-ivory text-chef-charcoal"
        )}
        style={{
          backgroundImage: darkMode 
            ? `linear-gradient(rgba(28, 28, 28, 0.8), rgba(28, 28, 28, 0.9)), url('${imageUrl}')`
            : `linear-gradient(rgba(249, 246, 241, 0.9), rgba(249, 246, 241, 0.95)), url('${imageUrl}')`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 rounded-full bg-chef-royal-green/20 text-chef-royal-green mb-4 text-sm font-medium">
              {brandName}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-playfair">{title}</h1>
            <p className={cn(
              "text-xl mb-6 font-inter",
              darkMode ? "text-chef-warm-ivory/90" : "text-chef-charcoal/70"
            )}>
              {subtitle}
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <Link 
            to="/" 
            className={cn(
              "inline-flex items-center mb-8 transition-colors",
              darkMode 
                ? "text-chef-warm-ivory/60 hover:text-chef-warm-ivory" 
                : "text-chef-charcoal/60 hover:text-chef-charcoal"
            )}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          
          <div className="prose prose-lg max-w-none">
            {children}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProjectPageLayout;
