
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import VideoPlayer from '@/components/VideoPlayer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, Users, Star, Play, Lock, Award, ChefHat } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

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

  const progress = (completedLessons.length / course.totalLessons) * 100;

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
        {/* Course Header */}
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

        {/* Course Content */}
        <section className="py-12 bg-chef-warm-ivory">
          <div className="chef-container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Video Player and Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <VideoPlayer
                    videoUrl={course.lessons[currentLesson]?.videoUrl || ""}
                    title={course.lessons[currentLesson]?.title || ""}
                    duration={course.lessons[currentLesson]?.duration || "0:00"}
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
                            {course.lessons[currentLesson]?.title}
                          </CardTitle>
                          <p className="text-chef-charcoal/70 mt-2">
                            {course.lessons[currentLesson]?.description}
                          </p>
                        </div>
                        <Badge variant={completedLessons.includes(currentLesson + 1) ? "default" : "secondary"} 
                               className={completedLessons.includes(currentLesson + 1) 
                                 ? "bg-green-100 text-green-800 border-green-200" 
                                 : "bg-gray-100 text-gray-600 border-gray-200"}>
                          {completedLessons.includes(currentLesson + 1) ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1 text-green-800" />
                              <span className="text-green-800">Completed</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 mr-1 text-gray-600" />
                              <span className="text-gray-600">{course.lessons[currentLesson]?.duration}</span>
                            </>
                          )}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => handleLessonComplete(currentLesson + 1)}
                        className="chef-button-primary text-white"
                        disabled={completedLessons.includes(currentLesson + 1)}
                      >
                        {completedLessons.includes(currentLesson + 1) ? (
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

              {/* Course Sidebar */}
              <div className="space-y-6">
                {/* Progress Card */}
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
                            {completedLessons.length} / {course.totalLessons} lessons
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

                {/* Lessons List */}
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
                        {course.lessons.map((lesson, index) => (
                          <button
                            key={lesson.id}
                            onClick={() => !lesson.isLocked && setCurrentLesson(index)}
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
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default CourseDetail;
