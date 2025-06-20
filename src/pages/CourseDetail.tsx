
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

  // Course data (in a real app, this would come from an API)
  const course = {
    id: 1,
    title: "Knife Skills Mastery",
    instructor: "Chef Isabella Rodriguez",
    description: "Master professional knife techniques, from basic cuts to advanced julienne and chiffonade. Essential skills every chef needs to develop precision, safety, and efficiency in the kitchen.",
    image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2128&q=80",
    duration: 180,
    totalLessons: 12,
    students: 3247,
    rating: 4.9,
    price: 0,
    difficulty: "Beginner",
    category: "Fundamentals",
    lessons: [
      {
        id: 1,
        title: "Introduction to Kitchen Knives",
        duration: "8:45",
        description: "Understanding different types of knives and their purposes",
        videoUrl: "",
        isLocked: false
      },
      {
        id: 2,
        title: "Proper Knife Grip and Stance",
        duration: "12:30",
        description: "Learn the fundamental grip techniques for safety and control",
        videoUrl: "",
        isLocked: false
      },
      {
        id: 3,
        title: "Basic Cuts: Slice, Dice, and Chop",
        duration: "15:20",
        description: "Master the three essential cutting techniques",
        videoUrl: "",
        isLocked: false
      },
      {
        id: 4,
        title: "Precision Cuts: Brunoise and Small Dice",
        duration: "18:15",
        description: "Achieve restaurant-quality precision cuts",
        videoUrl: "",
        isLocked: completedLessons.length < 3
      },
      {
        id: 5,
        title: "Vegetable Preparation Techniques",
        duration: "14:50",
        description: "Specific techniques for different vegetables",
        videoUrl: "",
        isLocked: completedLessons.length < 4
      },
      {
        id: 6,
        title: "Julienne and Matchstick Cuts",
        duration: "16:40",
        description: "Create uniform julienne cuts for professional presentations",
        videoUrl: "",
        isLocked: completedLessons.length < 5
      },
      {
        id: 7,
        title: "Chiffonade Technique for Herbs",
        duration: "10:25",
        description: "Perfect herb cutting technique for garnishes",
        videoUrl: "",
        isLocked: completedLessons.length < 6
      },
      {
        id: 8,
        title: "Knife Maintenance and Sharpening",
        duration: "20:10",
        description: "Keep your knives in perfect condition",
        videoUrl: "",
        isLocked: completedLessons.length < 7
      },
      {
        id: 9,
        title: "Speed and Efficiency Techniques",
        duration: "13:35",
        description: "Build speed while maintaining precision",
        videoUrl: "",
        isLocked: completedLessons.length < 8
      },
      {
        id: 10,
        title: "Advanced Protein Preparation",
        duration: "22:15",
        description: "Professional techniques for meat and fish",
        videoUrl: "",
        isLocked: completedLessons.length < 9
      },
      {
        id: 11,
        title: "Troubleshooting Common Mistakes",
        duration: "11:20",
        description: "Fix common knife skill problems",
        videoUrl: "",
        isLocked: completedLessons.length < 10
      },
      {
        id: 12,
        title: "Final Assessment and Certification",
        duration: "25:30",
        description: "Demonstrate your mastery and earn certification",
        videoUrl: "",
        isLocked: completedLessons.length < 11
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
            <Button onClick={() => navigate('/courses')} className="chef-button-primary">
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
                  <span className="text-white">{course.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-current text-chef-gold" />
                  <span className="text-white">{course.rating}</span>
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
                            Lesson {currentLesson + 1}: {course.lessons[currentLesson]?.title}
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
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3 mr-1" />
                              {course.lessons[currentLesson]?.duration}
                            </>
                          )}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => handleLessonComplete(currentLesson + 1)}
                        className="chef-button-primary"
                        disabled={completedLessons.includes(currentLesson + 1)}
                      >
                        {completedLessons.includes(currentLesson + 1) ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Completed
                          </>
                        ) : (
                          <>
                            <Award className="w-4 h-4 mr-2" />
                            Mark as Complete
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
                      <CardTitle className="text-chef-charcoal text-lg">Course Lessons</CardTitle>
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
