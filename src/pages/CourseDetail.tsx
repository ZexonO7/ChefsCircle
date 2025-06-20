
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import CourseHeader from '@/components/course/CourseHeader';
import CourseProgress from '@/components/course/CourseProgress';
import LessonsList from '@/components/course/LessonsList';
import CurrentLesson from '@/components/course/CurrentLesson';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  // Course data with detailed structure and YouTube videos
  const course = {
    id: 1,
    title: "Knife Skills Mastery",
    instructor: "Professional Chef Instructor",
    description: "Master essential knife techniques and kitchen safety fundamentals. This comprehensive course covers everything from basic cuts to advanced precision techniques used in professional kitchens.",
    image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2128&q=80",
    duration: 240,
    totalLessons: 5,
    students: 0,
    rating: 0,
    price: 0,
    difficulty: "Beginner to Intermediate",
    category: "Fundamentals",
    lessons: [
      {
        id: 1,
        title: "Module 1: Introduction to Knives and Basic Safety",
        duration: "12:30",
        description: "Understanding different types of knives, their purposes, proper handling techniques, and essential kitchen safety practices. Learn how to hold a knife correctly and maintain a safe workspace.",
        videoUrl: "https://www.youtube.com/watch?v=G-Fg7l7G1zw",
        isLocked: false
      },
      {
        id: 2,
        title: "Module 2: Basic Cutting Techniques",
        duration: "15:45",
        description: "Master fundamental cutting methods including slicing, dicing, and chopping. Learn proper knife grip, cutting board positioning, and finger placement for safety and efficiency.",
        videoUrl: "https://www.youtube.com/watch?v=YrHpeEwk_-U",
        isLocked: false
      },
      {
        id: 3,
        title: "Module 3: Precision Cuts and Advanced Techniques",
        duration: "18:20",
        description: "Develop advanced skills with julienne, brunoise, chiffonade, and other precision cuts. Focus on consistency, speed, and professional presentation standards.",
        videoUrl: "https://www.youtube.com/watch?v=0Kn2IOb28bc",
        isLocked: completedLessons.length < 2
      },
      {
        id: 4,
        title: "Module 4: Knife Maintenance and Sharpening",
        duration: "14:25",
        description: "Learn proper knife care, maintenance techniques, and sharpening methods. Understand how to keep your knives in optimal condition for peak performance and longevity.",
        videoUrl: "https://www.youtube.com/watch?v=Gl1wLtpdpKs",
        isLocked: completedLessons.length < 3
      },
      {
        id: 5,
        title: "Bonus: Professional Tips and Troubleshooting",
        duration: "10:15",
        description: "Extra insights from professional chefs including common mistakes to avoid, troubleshooting techniques, and pro tips for building speed while maintaining precision.",
        videoUrl: "https://www.youtube.com/watch?v=VJNA4vrdWec&t=3s",
        isLocked: completedLessons.length < 4
      }
    ]
  };

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

  if (!course) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-chef-warm-ivory pt-20 flex items-center justify-center">
          <div className="text-center">
            <h1 className="chef-heading-lg text-chef-charcoal mb-4">Course Not Found</h1>
            <Button onClick={() => navigate('/courses')} className="chef-button-primary text-white">
              Back to Courses
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const currentLessonData = course.lessons[currentLesson];
  const isCurrentLessonCompleted = completedLessons.includes(currentLessonData.id);

  return (
    <PageLayout>
      <SEO 
        title={`${course.title} - ChefCircle Learning`}
        description={course.description}
        keywords={['knife skills', 'culinary techniques', 'cooking course', 'chef training']}
      />
      
      <div className="min-h-screen bg-chef-warm-ivory">
        <CourseHeader course={course} />

        <section className="py-12 bg-chef-warm-ivory">
          <div className="chef-container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Video Player and Main Content */}
              <div className="lg:col-span-2">
                <CurrentLesson
                  lesson={currentLessonData}
                  isCompleted={isCurrentLessonCompleted}
                  onLessonComplete={handleLessonComplete}
                />
              </div>

              {/* Course Sidebar */}
              <div className="space-y-6">
                <CourseProgress
                  completedLessons={completedLessons}
                  totalLessons={course.totalLessons}
                />
                
                <LessonsList
                  lessons={course.lessons}
                  currentLesson={currentLesson}
                  completedLessons={completedLessons}
                  onLessonSelect={handleLessonSelect}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default CourseDetail;
