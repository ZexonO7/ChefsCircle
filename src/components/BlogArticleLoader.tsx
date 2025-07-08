import { motion } from 'framer-motion';
import { Newspaper } from 'lucide-react';

const BlogArticleLoader = ({ featured = false }: { featured?: boolean }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-chef-cream overflow-hidden ${
      featured ? 'col-span-1 md:col-span-2 lg:col-span-3' : ''
    }`}>
      {/* Image placeholder */}
      <div className={`bg-gradient-to-br from-chef-warm-ivory to-chef-cream relative overflow-hidden ${
        featured ? 'h-64' : 'h-48'
      }`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Newspaper className="w-12 h-12 text-chef-charcoal/30" />
          </motion.div>
        </div>
        
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      {/* Content placeholder */}
      <div className="p-6">
        {/* Category badge */}
        <div className="mb-3">
          <motion.div 
            className="h-6 w-20 bg-chef-royal-blue/20 rounded-full"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
        
        {/* Title */}
        <div className="space-y-2 mb-4">
          <motion.div 
            className={`bg-chef-charcoal/10 rounded ${featured ? 'h-8' : 'h-6'}`}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div 
            className={`bg-chef-charcoal/10 rounded w-3/4 ${featured ? 'h-8' : 'h-6'}`}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
          />
        </div>
        
        {/* Description */}
        <div className="space-y-2 mb-4">
          <motion.div 
            className="h-4 bg-chef-charcoal/10 rounded"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
          />
          <motion.div 
            className="h-4 bg-chef-charcoal/10 rounded w-5/6"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
          />
          {featured && (
            <motion.div 
              className="h-4 bg-chef-charcoal/10 rounded w-2/3"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
            />
          )}
        </div>
        
        {/* Meta info */}
        <div className="flex items-center gap-4">
          <motion.div 
            className="h-3 w-16 bg-chef-charcoal/10 rounded"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 1.2 }}
          />
          <motion.div 
            className="h-3 w-20 bg-chef-charcoal/10 rounded"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 1.4 }}
          />
        </div>
      </div>
    </div>
  );
};

export default BlogArticleLoader;