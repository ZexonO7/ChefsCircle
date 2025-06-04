import PageLayout from '@/components/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import BlogPostCard from '@/components/BlogPostCard';
import { blogPosts } from '@/data/blogPosts';
const Blog = () => {
  // Get the newest blog post for the featured post section
  const featuredPost = blogPosts.find(post => post.id === '4') || blogPosts[0]; // Feature the new post about sensor technology
  // Get the rest of the blog posts for the grid section
  const otherPosts = blogPosts.filter(post => post.id !== featuredPost?.id);
  return <PageLayout>
      <SEO title="ChefCircle - Culinary Insights and Expert Cooking Tips" description="Discover the latest culinary techniques, exclusive recipes, chef interviews, and cooking insights from the ChefCircle community of passionate food enthusiasts." imageUrl={featuredPost?.imageUrl || "/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png"} keywords={['culinary techniques', 'cooking tips', 'chef recipes', 'culinary education', 'cooking skills', 'gourmet cooking', 'culinary community']} type="website" />
      
      <div className="w-full pt-24 pb-12 bg-gradient-to-b from-chef-charcoal to-chef-royal-green text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-playfair">Culinary Insights &amp; Expertise</h1>
            <p className="text-xl text-chef-warm-ivory/90 mb-6 font-inter">
              The latest culinary techniques, exclusive recipes, and expert insights from our community of passionate chefs
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPost && <Link to={`/blog/${featuredPost.slug}`} className="col-span-1 md:col-span-2 lg:col-span-3">
              <Card className="overflow-hidden hover:shadow-chef-luxury transition-shadow duration-300 h-full border border-chef-royal-green/20">
                <div className="grid md:grid-cols-2 h-full">
                  <div className="bg-cover bg-center h-64 md:h-full p-8 flex items-center justify-center" style={{
                backgroundImage: `url('${featuredPost.imageUrl}')`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
              }}>
                    <div className="text-white text-center bg-chef-charcoal/60 backdrop-blur-sm p-4 rounded-lg">
                      <span className="px-3 py-1 bg-chef-royal-blue/20 rounded-full text-sm font-medium inline-block mb-4">Featured Recipe</span>
                      <h3 className="text-2xl md:text-3xl font-bold font-playfair">{featuredPost.title}</h3>
                    </div>
                  </div>
                  <CardContent className="p-8 bg-chef-navy bg-[141c74]">
                    <p className="text-chef-charcoal/60 text-sm mb-2">Published: {featuredPost.date}</p>
                    <p className="text-chef-charcoal/70 mb-6 font-inter">
                      {featuredPost.excerpt}
                    </p>
                    <Button variant="outline" className="group border-chef-royal-blue text-chef-royal-blue hover:bg-chef-royal-blue hover:text-white">
                      Read more 
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </div>
              </Card>
            </Link>}
          
          {/* Other blog posts */}
          {otherPosts.map(post => <BlogPostCard key={post.id} title={post.title} excerpt={post.excerpt} imageUrl={post.imageUrl || '/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png'} date={post.date} slug={post.slug} category={post.category} />)}
          
          {/* If there are fewer than 3 published posts, add placeholders */}
          {blogPosts.length < 4 && Array.from({
          length: Math.max(0, 4 - blogPosts.length)
        }).map((_, index) => <BlogPostCard key={`placeholder-${index}`} title="Upcoming Culinary Masterclass" excerpt="Stay tuned for more exciting culinary tutorials, exclusive recipes, and expert cooking techniques from our renowned chef community." imageUrl={index % 2 === 0 ? "/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png" : "/lovable-uploads/4bfa0d71-3ed2-4693-90b6-35142468907f.png"} date="Coming soon" slug="#" category="Upcoming" />)}
        </div>
      </div>
    </PageLayout>;
};
export default Blog;