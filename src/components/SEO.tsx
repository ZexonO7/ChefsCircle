
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  keywords?: string[];
}

const SEO = ({ 
  title = "ChefCircle - Exclusive Online Culinary Club", 
  description = "Join ChefCircle, the premium online culinary club for Gen Z and millennials. Master cooking skills through live cook-alongs, exclusive classes, and an elite community of food enthusiasts.",
  imageUrl = "/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png",
  keywords = ['culinary club', 'cooking classes', 'online cooking', 'chef training', 'culinary education', 'cooking community', 'gourmet cooking', 'culinary skills']
}: SEOProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:type" content="website" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="ChefCircle" />
      <link rel="canonical" href={window.location.href} />
    </Helmet>
  );
};

export default SEO;
