
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Award, Lock, Play } from 'lucide-react';
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
  const [videoProgress, setVideoProgress] = useState(0);
  const [canComplete, setCanComplete] = useState(false);

  // Reset progress when lesson changes
  useEffect(() => {
    if (!isCompleted) {
      setVideoProgress(0);
      setCanComplete(false);
    }
  }, [lesson.id, isCompleted]);

  const handleVideoComplete = () => {
    setCanComplete(true);
  };

  const handleProgressUpdate = (progress: number) => {
    setVideoProgress(Math.min(progress, 100));
    if (progress >= 90) {
      setCanComplete(true);
    }
  };

  const handleMarkComplete = () => {
    if (canComplete || isCompleted) {
      onLessonComplete(lesson.id);
    }
  };

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
          onVideoComplete={handleVideoComplete}
          onProgressUpdate={handleProgressUpdate}
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
          <CardContent className="space-y-4">
            {/* Video Progress Bar */}
            {!isCompleted && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-chef-charcoal/70 flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Video Progress
                  </span>
                  <span className={`font-medium ${canComplete ? 'text-green-600' : 'text-chef-charcoal/70'}`}>
                    {Math.round(videoProgress)}%
                  </span>
                </div>
                <Progress 
                  value={videoProgress} 
                  className="h-2"
                />
                {!canComplete && videoProgress < 90 && (
                  <p className="text-xs text-chef-charcoal/60 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Watch at least 90% of the video to unlock completion
                  </p>
                )}
                {canComplete && !isCompleted && (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Video watched! You can now mark this lesson as complete.
                  </p>
                )}
              </div>
            )}

            <Button 
              onClick={handleMarkComplete}
              className={`w-full ${canComplete || isCompleted ? 'chef-button-primary' : 'bg-gray-300 cursor-not-allowed'} text-white`}
              disabled={isCompleted || (!canComplete && !isCompleted)}
            >
              {isCompleted ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2 text-white" />
                  <span className="text-white">Completed</span>
                </>
              ) : canComplete ? (
                <>
                  <Award className="w-4 h-4 mr-2 text-white" />
                  <span className="text-white">Mark as Complete</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  <span>Watch Video to Unlock</span>
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
