
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BlogPostCard from '@/components/BlogPostCard';
import { blogPosts } from '@/data/blogPosts';
import { ScrollArea } from '@/components/ui/scroll-area';

const BlogPreview = () => {
  // Get the 3 most recent blog posts
  const recentPosts = [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);

  return (
    <section id="news" className="py-16 md:py-24 px-4 md:px-12 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={20} className="text-chef-royal-blue" />
              <span className="text-chef-royal-blue font-medium">Culinary Mastery</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-chef-charcoal font-playfair">Latest from Our Kitchen</h2>
            <p className="text-chef-charcoal/70 max-w-xl font-inter">
              Discover expert culinary techniques, exclusive recipes, seasonal ingredients, and behind-the-scenes stories from our community of passionate chefs.
            </p>
          </div>
          <Link to="/news" className="mt-4 md:mt-0">
            <Button variant="outline" className="group border-chef-royal-blue text-chef-royal-blue hover:bg-chef-royal-blue bg-[t] bg-[#141c74] text-white">
              View All Posts
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        
        <div className="relative">
          <ScrollArea className="w-full">
            <div className="flex gap-6 pb-4 md:hidden overflow-x-auto snap-x snap-mandatory pl-1">
              {recentPosts.map(post => <div key={post.id} className="flex-none w-[85%] snap-center">
                  <BlogPostCard title={post.title} excerpt={post.excerpt} imageUrl={post.imageUrl || '/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png'} date={post.date} slug={post.slug} category={post.category} />
                </div>)}
            </div>
          </ScrollArea>
          
          {/* Show grid layout on non-mobile screens */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map(post => <BlogPostCard key={post.id} title={post.title} excerpt={post.excerpt} imageUrl={post.imageUrl || '/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png'} date={post.date} slug={post.slug} category={post.category} />)}
          </div>
          
          <div className="mt-4 flex justify-center md:hidden">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => <div key={i} className={`h-1.5 rounded-full ${i === 0 ? 'w-6 bg-chef-royal-blue' : 'w-2 bg-chef-charcoal/30'}`} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
