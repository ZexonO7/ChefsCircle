
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getCourseData, type Course } from '@/data/courseData';

export const useCourseLogic = () => {
  const { toast } = useToast();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  const course = getCourseData(completedLessons);

  const handleLessonComplete = (lessonId: number) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
      toast({
        title: "Lesson Completed!",
        description: `Great job completing "${course.lessons[lessonId - 1].title}"`,
      });
    }
  };

  const handleLessonSelect = (index: number) => {
    setCurrentLesson(index);
  };

  const currentLessonData = course.lessons[currentLesson];
  const isCurrentLessonCompleted = completedLessons.includes(currentLessonData.id);

  return {
    course,
    currentLesson,
    completedLessons,
    currentLessonData,
    isCurrentLessonCompleted,
    handleLessonComplete,
    handleLessonSelect,
  };
};
