
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Play, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Lesson {
  id: number;
  title: string;
  duration: string;
  isLocked: boolean;
}

interface LessonsListProps {
  lessons: Lesson[];
  currentLesson: number;
  completedLessons: number[];
  onLessonSelect: (index: number) => void;
}

const LessonsList = ({ lessons, currentLesson, completedLessons, onLessonSelect }: LessonsListProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="bg-white border-chef-royal-blue/20 shadow-lg">
        <CardHeader>
          <CardTitle className="text-chef-charcoal text-lg">Course Modules</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0">
            {lessons.map((lesson, index) => (
              <button
                key={lesson.id}
                onClick={() => !lesson.isLocked && onLessonSelect(index)}
                disabled={lesson.isLocked}
                className={`w-full p-4 text-left hover:bg-chef-royal-blue/5 transition-colors border-b border-gray-100 last:border-b-0 ${
                  currentLesson === index ? 'bg-chef-royal-blue/10' : ''
                } ${lesson.isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {completedLessons.includes(lesson.id) ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : lesson.isLocked ? (
                      <Lock className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Play className="w-5 h-5 text-chef-royal-blue" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-chef-charcoal truncate text-sm">
                      {lesson.title}
                    </p>
                    <p className="text-xs text-chef-charcoal/60">
                      {lesson.duration}
                    </p>
                    {lesson.id === 5 && (
                      <Badge variant="secondary" className="mt-1 text-xs bg-chef-gold/10 text-chef-gold border-chef-gold/20">
                        Bonus
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LessonsList;
