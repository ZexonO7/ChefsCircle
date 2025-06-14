
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPostCardProps {
  title: string;
  excerpt: string;
  imageUrl: string;
  date: string;
  slug: string;
  category: string;
}

const BlogPostCard = ({
  title,
  excerpt,
  imageUrl,
  date,
  slug,
  category
}: BlogPostCardProps) => {
  return (
    <Link to={`/news/${slug}`}>
      <Card className="overflow-hidden hover:shadow-chef-luxury transition-shadow duration-300 h-full border border-chef-royal-green/20">
        <div className="grid grid-rows-[200px,1fr]">
          <div className="bg-cover bg-center" style={{
          backgroundImage: `url('${imageUrl}')`
        }}>
            <div className="w-full h-full bg-chef-charcoal/20 flex items-center justify-center">
              <span className="px-3 py-1 bg-chef-royal-blue/20 backdrop-blur-sm rounded-full text-sm font-medium text-white inline-block">
                {category}
              </span>
            </div>
          </div>
          <CardContent className="p-6 bg-chef-cream">
            <p className="text-chef-charcoal/60 text-sm mb-2">{date}</p>
            <h3 className="text-xl font-bold mb-2 line-clamp-2 text-chef-charcoal font-playfair">{title}</h3>
            <p className="text-chef-charcoal/70 mb-4 line-clamp-3 font-inter">{excerpt}</p>
            <Button variant="outline" className="group mt-auto border-chef-royal-blue text-chef-royal-blue hover:bg-chef-royal-blue bg-[c] bg-[#141c73] text-chef-cream">
              Read more 
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
};

export default BlogPostCard;
