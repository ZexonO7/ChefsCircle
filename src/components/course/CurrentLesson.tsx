
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import VideoPlayer from '@/components/VideoPlayer';

interface Lesson {
  id: number;
  title: string;
  duration: string;
  description: string;
  videoUrl: string;
}

interface CurrentLessonProps {
  lesson: Lesson;
  isCompleted: boolean;
  onLessonComplete: (lessonId: number) => void;
}

const CurrentLesson = ({ lesson, isCompleted, onLessonComplete }: CurrentLessonProps) => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <VideoPlayer
          videoUrl={lesson.videoUrl}
          title={lesson.title}
          duration={lesson.duration}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="bg-white border-chef-royal-blue/20 shadow-lg">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-chef-charcoal text-xl">
                  {lesson.title}
                </CardTitle>
                <p className="text-chef-charcoal/70 mt-2">
                  {lesson.description}
                </p>
              </div>
              <Badge variant={isCompleted ? "default" : "secondary"} 
                     className={isCompleted 
                       ? "bg-green-100 text-green-800 border-green-200" 
                       : "bg-gray-100 text-gray-600 border-gray-200"}>
                {isCompleted ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1 text-green-800" />
                    <span className="text-green-800">Completed</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3 h-3 mr-1 text-gray-600" />
                    <span className="text-gray-600">{lesson.duration}</span>
                  </>
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => onLessonComplete(lesson.id)}
              className="chef-button-primary text-white"
              disabled={isCompleted}
            >
              {isCompleted ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2 text-white" />
                  <span className="text-white">Completed</span>
                </>
              ) : (
                <>
                  <Award className="w-4 h-4 mr-2 text-white" />
                  <span className="text-white">Mark as Complete</span>
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CurrentLesson;
