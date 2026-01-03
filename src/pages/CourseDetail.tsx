import { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useCourseLogic } from '@/hooks/useCourseLogic';
import { useAuth } from '@/components/AuthProvider';
import { useEnrollment } from '@/hooks/useEnrollment';
import CourseHeader from '@/components/course/CourseHeader';
import CourseProgress from '@/components/course/CourseProgress';
import LessonsList from '@/components/course/LessonsList';
import CurrentLesson from '@/components/course/CurrentLesson';
import EnrollmentModal, { EnrollmentData } from '@/components/course/EnrollmentModal';
import { GraduationCap, Clock, BookOpen } from 'lucide-react';

const CourseDetail = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  
  const {
    course,
    courseId,
    currentLesson,
    completedLessons,
    currentLessonData,
    isCurrentLessonCompleted,
    loading,
    handleLessonComplete,
    handleLessonSelect,
  } = useCourseLogic();

  const { isEnrolled, enrollmentData, loading: enrollmentLoading, enroll } = useEnrollment(courseId);

  const handleEnroll = async (data: EnrollmentData) => {
    await enroll(data);
    setShowEnrollmentModal(false);
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

  if (loading || enrollmentLoading) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-chef-warm-ivory pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chef-royal-blue mx-auto mb-4"></div>
            <p className="text-chef-charcoal">Loading your progress...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Show enrollment prompt if not enrolled
  if (!isEnrolled) {
    return (
      <PageLayout>
        <SEO 
          title={`${course.title} - ChefsCircle Learning`}
          description={course.description}
          keywords={['culinary course', 'cooking class', 'chef training']}
        />
        
        <div className="min-h-screen bg-chef-warm-ivory">
          <CourseHeader course={course} />
          
          <section className="py-16 bg-chef-warm-ivory">
            <div className="chef-container max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-chef-gold/20">
                <div className="w-16 h-16 bg-chef-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <GraduationCap className="w-8 h-8 text-chef-gold" />
                </div>
                
                <h2 className="text-2xl font-semibold text-chef-charcoal mb-3">
                  Ready to Start Learning?
                </h2>
                <p className="text-chef-charcoal/70 mb-6">
                  Enroll now to access all lessons and receive a certificate upon completion.
                </p>

                <div className="flex justify-center gap-8 mb-8 text-sm text-chef-charcoal/60">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.totalLessons} Lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                <Button
                  onClick={() => setShowEnrollmentModal(true)}
                  className="bg-chef-gold hover:bg-chef-gold/90 text-chef-charcoal font-medium px-8 py-3 text-lg"
                >
                  Enroll in This Course
                </Button>
              </div>
            </div>
          </section>
        </div>

        <EnrollmentModal
          isOpen={showEnrollmentModal}
          onClose={() => setShowEnrollmentModal(false)}
          onEnroll={handleEnroll}
          courseTitle={course.title}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <SEO 
        title={`${course.title} - ChefsCircle Learning`}
        description={course.description}
        keywords={['knife skills', 'culinary techniques', 'cooking course', 'chef training']}
      />
      
      <div className="min-h-screen bg-chef-warm-ivory">
        <CourseHeader course={course} />

        {!user && (
          <div className="bg-chef-gold/10 border-l-4 border-chef-gold p-4 mx-4 mb-6">
            <div className="flex">
              <div>
                <p className="text-chef-charcoal font-medium">
                  Sign in to save your progress
                </p>
                <p className="text-chef-charcoal/70 text-sm mt-1">
                  Your course progress will be lost when you refresh the page unless you're logged in.
                </p>
                <Button 
                  onClick={() => navigate('/auth')} 
                  className="mt-3 bg-chef-gold hover:bg-chef-gold/90 text-chef-charcoal"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        )}

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
