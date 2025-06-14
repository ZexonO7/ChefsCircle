
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  image: string;
  index: number;
}

const FeatureCard = ({ icon, title, description, image, index }: FeatureCardProps) => {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  return (
    <div
      className="feature-item rounded-xl overflow-hidden transform transition-all duration-500 relative shadow-lg h-[320px] hover:-translate-y-1"
      style={{ transitionDelay: `${index * 100}ms` }}
      onMouseEnter={() => setHoveredFeature(index)}
      onMouseLeave={() => setHoveredFeature(null)}
    >
      <div className="absolute inset-0 w-full h-full">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-all duration-300 grayscale hover:grayscale-0"
        />
        <div className={cn(
          "absolute inset-0 transition-opacity duration-300",
          hoveredFeature === index ? "bg-chef-royal-green/60" : "bg-chef-charcoal/70"
        )}></div>
      </div>
      
      <div className="relative z-10 flex flex-col justify-between p-6 h-full">
        <div>
          <div className={cn(
            "inline-block p-3 bg-chef-gold/20 backdrop-blur-sm rounded-lg transition-all duration-300 transform mb-4",
            hoveredFeature === index ? "hover:scale-110" : ""
          )}>
            <div className={`transform transition-transform duration-300 ${hoveredFeature === index ? 'rotate-12' : ''}`}>
              {icon}
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3 font-playfair">
            {title}
          </h3>
          <p className="text-white/90 font-inter">
            {description}
          </p>
        </div>
        <div className={`h-0.5 bg-chef-gold mt-4 transition-all duration-500 ${hoveredFeature === index ? 'w-full' : 'w-0'}`}></div>
      </div>
    </div>
  );
};

export default FeatureCard;
