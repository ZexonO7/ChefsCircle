
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { useParams, useNavigate } from 'react-router-dom';
import { useCourseLogic } from '@/hooks/useCourseLogic';
import CourseHeader from '@/components/course/CourseHeader';
import CourseProgress from '@/components/course/CourseProgress';
import LessonsList from '@/components/course/LessonsList';
import CurrentLesson from '@/components/course/CurrentLesson';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    course,
    currentLesson,
    completedLessons,
    currentLessonData,
    isCurrentLessonCompleted,
    handleLessonComplete,
    handleLessonSelect,
  } = useCourseLogic();

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
