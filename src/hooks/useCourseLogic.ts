
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { getCourseData, type Course } from '@/data/courseData';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

export const useCourseLogic = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { id } = useParams();
  const courseId = parseInt(id || '1', 10);
  
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const course = getCourseData(completedLessons, courseId);

  // Load user's course progress from database
  useEffect(() => {
    const loadProgress = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_course_progress')
          .select('lesson_id')
          .eq('user_id', user.id)
          .eq('course_id', courseId);

        if (error) {
          console.error('Error loading progress:', error);
          toast({
            title: "Error Loading Progress",
            description: "Failed to load your course progress.",
            variant: "destructive",
          });
        } else if (data) {
          const completedLessonIds = data.map(item => item.lesson_id);
          setCompletedLessons(completedLessonIds);
        }
      } catch (error) {
        console.error('Error loading progress:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [user, toast, courseId]);

  // Reset state when course changes
  useEffect(() => {
    setCurrentLesson(0);
  }, [courseId]);

  const handleLessonComplete = async (lessonId: number) => {
    if (completedLessons.includes(lessonId)) {
      return; // Already completed
    }

    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to save your progress.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Save progress to database
      const { error } = await supabase
        .from('user_course_progress')
        .insert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: lessonId,
        });

      if (error) {
        console.error('Error saving progress:', error);
        toast({
          title: "Error Saving Progress",
          description: "Failed to save your progress. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Update local state
      setCompletedLessons([...completedLessons, lessonId]);
      
      // Award XP for course attendance (gamification)
      try {
        await supabase.rpc('track_course_attendance', {
          user_id_param: user.id
        });
      } catch (gamificationError) {
        console.error('Error tracking course attendance:', gamificationError);
      }

      toast({
        title: "Lesson Completed!",
        description: `Great job completing "${course?.lessons[lessonId - 1]?.title}"`,
      });
    } catch (error) {
      console.error('Error completing lesson:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLessonSelect = (index: number) => {
    setCurrentLesson(index);
  };

  const currentLessonData = course?.lessons[currentLesson];
  const isCurrentLessonCompleted = currentLessonData ? completedLessons.includes(currentLessonData.id) : false;

  return {
    course,
    courseId,
    currentLesson,
    completedLessons,
    currentLessonData,
    isCurrentLessonCompleted,
    loading,
    handleLessonComplete,
    handleLessonSelect,
  };
};
