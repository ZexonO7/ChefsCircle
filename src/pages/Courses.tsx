import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { Play, Clock, Users, Star, Crown, BookOpen, Filter, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const filters = ['All', 'Free', 'Premium', 'Beginner', 'Intermediate', 'Advanced'];

  const courses = [
    {
      id: 1,
      title: "Knife Skills Mastery",
      instructor: "Chef Isabella Rodriguez",
      description: "Master professional knife techniques, from basic cuts to advanced julienne and chiffonade. Essential skills every chef needs.",
      image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2128&q=80",
      duration: 180, // minutes
      lessons: 12,
      students: 3247,
      rating: 4.9,
      price: 0,
      difficulty: "Beginner",
      category: "Fundamentals",
      isFeatured: true
    },
    {
      id: 2,
      title: "Italian Pasta Making",
      instructor: "Nonna Maria Giuseppe",
      description: "Authentic Italian pasta from scratch. Learn traditional techniques passed down through generations in Tuscany.",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: 240,
      lessons: 8,
      students: 1892,
      rating: 4.8,
      price: 89,
      difficulty: "Intermediate",
      category: "International",
      isFeatured: true
    },
    {
      id: 3,
      title: "Molecular Gastronomy Basics",
      instructor: "Dr. James Chen",
      description: "Introduction to molecular gastronomy techniques. Transform ordinary ingredients into extraordinary culinary art.",
      image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      duration: 360,
      lessons: 15,
      students: 567,
      rating: 4.7,
      price: 199,
      difficulty: "Advanced",
      category: "Innovation",
      isFeatured: false
    },
    {
      id: 4,
      title: "Plant-Based Protein Power",
      instructor: "Chef Green Thompson",
      description: "Discover the world of plant-based proteins. Create satisfying, nutritious meals without meat.",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: 150,
      lessons: 10,
      students: 2134,
      rating: 4.6,
      price: 0,
      difficulty: "Beginner",
      category: "Healthy",
      isFeatured: false
    },
    {
      id: 5,
      title: "French Pastry Techniques",
      instructor: "Maître Patissier Laurent",
      description: "Master classic French pastry techniques. From pâte choux to laminated doughs, elevate your baking skills.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      duration: 480,
      lessons: 20,
      students: 823,
      rating: 4.9,
      price: 299,
      difficulty: "Advanced",
      category: "Baking",
      isFeatured: true
    },
    {
      id: 6,
      title: "Quick Weeknight Dinners",
      instructor: "Chef Busy Mom Sarah",
      description: "Delicious, healthy meals in 30 minutes or less. Perfect for busy professionals and families.",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1081&q=80",
      duration: 120,
      lessons: 6,
      students: 4156,
      rating: 4.5,
      price: 0,
      difficulty: "Beginner",
      category: "Quick & Easy",
      isFeatured: false
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (selectedFilter === 'Free') matchesFilter = course.price === 0;
    else if (selectedFilter === 'Premium') matchesFilter = course.price > 0;
    else if (['Beginner', 'Intermediate', 'Advanced'].includes(selectedFilter)) {
      matchesFilter = course.difficulty === selectedFilter;
    }
    
    return matchesSearch && matchesFilter;
  });

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleEnrollment = (course: any) => {
    if (!user && course.price > 0) {
      toast({
        title: "Authentication required",
        description: "Please sign in to enroll in premium courses.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    if (course.price > 0) {
      toast({
        title: "Payment Required",
        description: `To enroll in ${course.title}, payment processing will be available soon.`,
      });
    } else {
      navigate(`/courses/${course.id}`);
    }
  };

  const handleLearnMore = (course: any) => {
    navigate(`/courses/${course.id}`);
  };

  return (
    <PageLayout>
      <SEO 
        title="Culinary Courses - ChefsCircle Learning" 
        description="Learn from world-class chefs with our comprehensive culinary courses. From basic techniques to advanced skills, enhance your cooking abilities."
        keywords={['culinary courses', 'cooking classes', 'chef training', 'culinary education', 'online cooking']}
      />
      
      <div className="min-h-screen bg-chef-warm-ivory pt-20">
        {/* Hero Section */}
        <section className="chef-section bg-gradient-to-br from-chef-navy to-chef-royal-blue">
          <div className="chef-container">
            <motion.div 
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="chef-heading-xl text-chef-warm-ivory mb-6">
                Master <span className="text-chef-gold">Culinary Arts</span>
              </h1>
              <p className="chef-body-lg text-chef-warm-ivory/90 mb-8">
                Learn from world-renowned chefs with our comprehensive courses, from free basics to premium masterclasses
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-chef-charcoal/60 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 rounded-xl border border-chef-royal-blue/20 focus:outline-none focus:ring-2 focus:ring-chef-gold"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="py-8 bg-chef-warm-ivory border-b border-chef-royal-blue/10">
          <div className="chef-container">
            <div className="flex flex-wrap gap-3 justify-center">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedFilter === filter
                      ? 'bg-chef-royal-blue text-chef-warm-ivory'
                      : 'bg-chef-royal-blue/10 text-chef-royal-blue hover:bg-chef-royal-blue/20'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Courses */}
        {selectedFilter === 'All' && (
          <section className="chef-section bg-chef-royal-blue/5">
            <div className="chef-container">
              <h2 className="chef-heading-lg text-chef-charcoal text-center mb-12">Featured Courses</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {courses.filter(course => course.isFeatured).map((course, index) => (
                  <motion.div
                    key={course.id}
                    className="chef-card-luxury group cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    <div className="relative overflow-hidden rounded-t-xl">
                      <img 
                        src={course.image} 
                        alt={course.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="chef-badge bg-chef-gold/20 text-chef-gold border-chef-gold/30">
                          <Star className="w-3 h-3 fill-current" />
                          Featured
                        </span>
                        {course.price === 0 ? (
                          <span className="chef-badge-green">Free</span>
                        ) : (
                          <span className="chef-badge bg-chef-royal-blue/20 text-chef-royal-blue border-chef-royal-blue/30">
                            <Crown className="w-3 h-3 fill-current" />
                            Premium
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
                        <Play className="w-3 h-3 inline mr-1" />
                        {course.lessons} lessons
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="chef-heading-sm text-chef-charcoal group-hover:text-chef-royal-blue transition-colors">
                          {course.title}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-chef-gold">
                          <Star className="w-4 h-4 fill-current" />
                          <span>{course.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-chef-royal-blue font-medium mb-2">by {course.instructor}</p>
                      
                      <p className="chef-body-sm text-chef-charcoal/80 mb-4 line-clamp-2">
                        {course.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4 text-sm text-chef-charcoal/60">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatDuration(course.duration)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{course.students.toLocaleString()}</span>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          course.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                          course.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {course.difficulty}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-chef-charcoal">
                          {course.price === 0 ? 'Free' : `$${course.price}`}
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEnrollment(course);
                          }}
                          className="chef-button-primary text-sm py-2 px-4"
                        >
                          {course.price === 0 ? 'Start Learning' : 'Enroll Now'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Courses */}
        <section className="chef-section">
          <div className="chef-container">
            <h2 className="chef-heading-lg text-chef-charcoal text-center mb-12">
              {selectedFilter === 'All' ? 'All Courses' : `${selectedFilter} Courses`}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  className="chef-card group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  <div className="relative overflow-hidden rounded-t-xl">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      {course.price === 0 ? (
                        <span className="chef-badge-green">Free</span>
                      ) : (
                        <span className="chef-badge bg-chef-royal-blue/20 text-chef-royal-blue border-chef-royal-blue/30">
                          <Crown className="w-3 h-3 fill-current" />
                          Premium
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
                      <BookOpen className="w-3 h-3 inline mr-1" />
                      {course.lessons} lessons
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="chef-heading-sm text-chef-charcoal group-hover:text-chef-royal-blue transition-colors mb-2">
                      {course.title}
                    </h3>
                    
                    <p className="text-sm text-chef-royal-blue font-medium mb-3">by {course.instructor}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-sm text-chef-gold">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-chef-charcoal/60">
                        <span>{formatDuration(course.duration)}</span>
                        <span>{course.students.toLocaleString()} students</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-chef-charcoal">
                        {course.price === 0 ? 'Free' : `$${course.price}`}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLearnMore(course);
                        }}
                        className="text-chef-royal-blue hover:text-chef-royal-blue/80 font-medium text-sm"
                      >
                        Learn More →
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <p className="chef-body text-chef-charcoal/60">No courses found matching your criteria.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Courses;
