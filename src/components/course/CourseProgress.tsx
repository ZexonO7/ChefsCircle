
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

interface CourseProgressProps {
  completedLessons: number[];
  totalLessons: number;
}

const CourseProgress = ({ completedLessons, totalLessons }: CourseProgressProps) => {
  const progress = (completedLessons.length / totalLessons) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <Card className="bg-white border-chef-royal-blue/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-chef-charcoal text-lg">Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-chef-charcoal/70">Completed</span>
              <span className="font-medium text-chef-charcoal">
                {completedLessons.length} / {totalLessons} lessons
              </span>
            </div>
            <Progress value={progress} className="h-3 bg-gray-100" />
            <p className="text-sm text-chef-charcoal/70">
              {Math.round(progress)}% complete
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CourseProgress;
