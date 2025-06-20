
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Star, ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';

interface CourseHeaderProps {
  course: {
    title: string;
    instructor: string;
    description: string;
    category: string;
    duration: number;
    students: number;
    rating: number;
    difficulty: string;
  };
}

const CourseHeader = ({ course }: CourseHeaderProps) => {
  return (
    <section className="pt-20 pb-12 bg-gradient-to-br from-chef-navy to-chef-royal-blue">
      <div className="chef-container">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-4 bg-chef-gold/20 text-chef-gold border-chef-gold/30 hover:bg-chef-gold/30">
            {course.category}
          </Badge>
          <h1 className="chef-heading-xl text-white mb-4">
            {course.title}
          </h1>
          <p className="chef-body-lg text-white/90 mb-6">
            {course.description}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/80">
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-white" />
              <span className="text-white">by {course.instructor}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-white" />
              <span className="text-white">{Math.floor(course.duration / 60)}h {course.duration % 60}m</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-white" />
              <span className="text-white">New Course</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-current text-chef-gold" />
              <span className="text-white">{course.difficulty}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CourseHeader;
