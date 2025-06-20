
export interface Lesson {
  id: number;
  title: string;
  duration: string;
  description: string;
  videoUrl: string;
  isLocked: boolean;
}

export interface Course {
  id: number;
  title: string;
  instructor: string;
  description: string;
  image: string;
  duration: number;
  totalLessons: number;
  students: number;
  rating: number;
  price: number;
  difficulty: string;
  category: string;
  lessons: Lesson[];
}

export const getCourseData = (completedLessons: number[]): Course => ({
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
      isLocked: !completedLessons.includes(1) || !completedLessons.includes(2)
    },
    {
      id: 4,
      title: "Module 4: Knife Maintenance and Sharpening",
      duration: "14:25",
      description: "Learn proper knife care, maintenance techniques, and sharpening methods. Understand how to keep your knives in optimal condition for peak performance and longevity.",
      videoUrl: "https://www.youtube.com/watch?v=Gl1wLtpdpKs",
      isLocked: !completedLessons.includes(1) || !completedLessons.includes(2) || !completedLessons.includes(3)
    },
    {
      id: 5,
      title: "Bonus: Professional Tips and Troubleshooting",
      duration: "10:15",
      description: "Extra insights from professional chefs including common mistakes to avoid, troubleshooting techniques, and pro tips for building speed while maintaining precision.",
      videoUrl: "https://www.youtube.com/watch?v=VJNA4vrdWec&t=3s",
      isLocked: !completedLessons.includes(1) || !completedLessons.includes(2) || !completedLessons.includes(3) || !completedLessons.includes(4)
    }
  ]
});
