
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

// Course 1: Knife Skills Mastery
const getKnifeSkillsCourse = (completedLessons: number[]): Course => ({
  id: 1,
  title: "Knife Skills Mastery",
  instructor: "Chef Isabella Rodriguez",
  description: "Master essential knife techniques and kitchen safety fundamentals. This comprehensive course covers everything from basic cuts to advanced precision techniques used in professional kitchens.",
  image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2128&q=80",
  duration: 180,
  totalLessons: 5,
  students: 0,
  rating: 0,
  price: 0,
  difficulty: "Beginner",
  category: "Fundamentals",
  lessons: [
    {
      id: 1,
      title: "Module 1: Introduction to Knives and Basic Safety",
      duration: "12:30",
      description: "Understanding different types of knives, their purposes, proper handling techniques, and essential kitchen safety practices.",
      videoUrl: "https://www.youtube.com/watch?v=G-Fg7l7G1zw",
      isLocked: false
    },
    {
      id: 2,
      title: "Module 2: Basic Cutting Techniques",
      duration: "15:45",
      description: "Master fundamental cutting methods including slicing, dicing, and chopping with proper knife grip and finger placement.",
      videoUrl: "https://www.youtube.com/watch?v=YrHpeEwk_-U",
      isLocked: !completedLessons.includes(1)
    },
    {
      id: 3,
      title: "Module 3: Precision Cuts and Advanced Techniques",
      duration: "18:20",
      description: "Develop advanced skills with julienne, brunoise, chiffonade, and other precision cuts for professional presentation.",
      videoUrl: "https://www.youtube.com/watch?v=0Kn2IOb28bc",
      isLocked: !completedLessons.includes(2)
    },
    {
      id: 4,
      title: "Module 4: Knife Maintenance and Sharpening",
      duration: "14:25",
      description: "Learn proper knife care, maintenance techniques, and sharpening methods to keep your knives in optimal condition.",
      videoUrl: "https://www.youtube.com/watch?v=Gl1wLtpdpKs",
      isLocked: !completedLessons.includes(3)
    },
    {
      id: 5,
      title: "Bonus: Professional Tips and Troubleshooting",
      duration: "10:15",
      description: "Extra insights from professional chefs including common mistakes to avoid and pro tips for building speed.",
      videoUrl: "https://www.youtube.com/watch?v=VJNA4vrdWec",
      isLocked: !completedLessons.includes(4)
    }
  ]
});

// Course 2: Italian Pasta Making
const getItalianPastaCourse = (completedLessons: number[]): Course => ({
  id: 2,
  title: "Italian Pasta Making",
  instructor: "Nonna Maria Giuseppe",
  description: "Authentic Italian pasta from scratch. Learn traditional techniques passed down through generations in Tuscany, from classic egg pasta to filled varieties.",
  image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  duration: 240,
  totalLessons: 8,
  students: 0,
  rating: 0,
  price: 89,
  difficulty: "Intermediate",
  category: "International",
  lessons: [
    {
      id: 1,
      title: "Module 1: The Art of Fresh Pasta Dough",
      duration: "18:30",
      description: "Learn the fundamentals of making perfect pasta dough - the right flour, egg ratio, kneading technique, and resting time.",
      videoUrl: "https://www.youtube.com/watch?v=HdSLKZ6LN94",
      isLocked: false
    },
    {
      id: 2,
      title: "Module 2: Rolling and Shaping Techniques",
      duration: "22:15",
      description: "Master the art of rolling pasta by hand and with a machine, achieving the perfect thickness for different pasta types.",
      videoUrl: "https://www.youtube.com/watch?v=Ew-3-8itpjc",
      isLocked: !completedLessons.includes(1)
    },
    {
      id: 3,
      title: "Module 3: Classic Tagliatelle and Fettuccine",
      duration: "16:45",
      description: "Create beautiful ribbon pastas with consistent width and perfect texture for rich meat and cream sauces.",
      videoUrl: "https://www.youtube.com/watch?v=wkeL_0BnxCQ",
      isLocked: !completedLessons.includes(2)
    },
    {
      id: 4,
      title: "Module 4: Filled Pasta - Ravioli",
      duration: "25:30",
      description: "Learn to make classic ravioli with ricotta and spinach filling, proper sealing techniques to prevent bursting.",
      videoUrl: "https://www.youtube.com/watch?v=hXS3gTcc8SM",
      isLocked: !completedLessons.includes(3)
    },
    {
      id: 5,
      title: "Module 5: Tortellini and Cappelletti",
      duration: "28:20",
      description: "Master the intricate folding techniques for these beloved filled pastas from Emilia-Romagna.",
      videoUrl: "https://www.youtube.com/watch?v=qW5fmPj98po",
      isLocked: !completedLessons.includes(4)
    },
    {
      id: 6,
      title: "Module 6: Gnocchi and Potato Pasta",
      duration: "20:15",
      description: "Create light, fluffy gnocchi that melt in your mouth - the secrets to avoiding dense, heavy dumplings.",
      videoUrl: "https://www.youtube.com/watch?v=NEQWM-oSdGg",
      isLocked: !completedLessons.includes(5)
    },
    {
      id: 7,
      title: "Module 7: Classic Italian Sauces",
      duration: "24:40",
      description: "Pair your fresh pasta with authentic sauces - Bolognese, Carbonara, Cacio e Pepe, and Aglio e Olio.",
      videoUrl: "https://www.youtube.com/watch?v=bJUiWdM__Qw",
      isLocked: !completedLessons.includes(6)
    },
    {
      id: 8,
      title: "Module 8: Plating and Presentation",
      duration: "15:25",
      description: "Finish like a true Italian chef - proper plating, garnishing, and serving traditions.",
      videoUrl: "https://www.youtube.com/watch?v=43rcV1PWlN4",
      isLocked: !completedLessons.includes(7)
    }
  ]
});

// Course 3: Molecular Gastronomy Basics
const getMolecularGastronomyCourse = (completedLessons: number[]): Course => ({
  id: 3,
  title: "Molecular Gastronomy Basics",
  instructor: "Dr. James Chen",
  description: "Introduction to molecular gastronomy techniques. Transform ordinary ingredients into extraordinary culinary art using science-based methods.",
  image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
  duration: 360,
  totalLessons: 6,
  students: 0,
  rating: 0,
  price: 199,
  difficulty: "Advanced",
  category: "Innovation",
  lessons: [
    {
      id: 1,
      title: "Module 1: Introduction to Molecular Gastronomy",
      duration: "20:45",
      description: "Understanding the science behind cooking - emulsification, gelification, and spherification basics.",
      videoUrl: "https://www.youtube.com/watch?v=slsFCs5wKpc",
      isLocked: false
    },
    {
      id: 2,
      title: "Module 2: Essential Equipment and Ingredients",
      duration: "18:30",
      description: "Learn about precision tools, hydrocolloids, and specialty ingredients used in molecular cooking.",
      videoUrl: "https://www.youtube.com/watch?v=Y-zAQGGLzac",
      isLocked: !completedLessons.includes(1)
    },
    {
      id: 3,
      title: "Module 3: Spherification Techniques",
      duration: "28:15",
      description: "Create caviar, ravioli, and other spherical delights using basic and reverse spherification.",
      videoUrl: "https://www.youtube.com/watch?v=7xJ0XQKPEJ4",
      isLocked: !completedLessons.includes(2)
    },
    {
      id: 4,
      title: "Module 4: Gels and Foams",
      duration: "25:40",
      description: "Master agar gels, fluid gels, and light foams to add texture and visual appeal to dishes.",
      videoUrl: "https://www.youtube.com/watch?v=cVdlLLmZJfc",
      isLocked: !completedLessons.includes(3)
    },
    {
      id: 5,
      title: "Module 5: Sous Vide Fundamentals",
      duration: "32:20",
      description: "Precision cooking with temperature control for perfect proteins and vegetables every time.",
      videoUrl: "https://www.youtube.com/watch?v=L1RDM90aPL8",
      isLocked: !completedLessons.includes(4)
    },
    {
      id: 6,
      title: "Module 6: Creating a Modernist Dish",
      duration: "35:10",
      description: "Combine all techniques to create a stunning multi-component modernist dish from start to finish.",
      videoUrl: "https://www.youtube.com/watch?v=oV0-Q-OaBKE",
      isLocked: !completedLessons.includes(5)
    }
  ]
});

// Course 4: Plant-Based Protein Power
const getPlantBasedCourse = (completedLessons: number[]): Course => ({
  id: 4,
  title: "Plant-Based Protein Power",
  instructor: "Chef Green Thompson",
  description: "Discover the world of plant-based proteins. Create satisfying, nutritious meals without meat that are delicious and sustainable.",
  image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  duration: 150,
  totalLessons: 5,
  students: 0,
  rating: 0,
  price: 0,
  difficulty: "Beginner",
  category: "Healthy",
  lessons: [
    {
      id: 1,
      title: "Module 1: Understanding Plant Proteins",
      duration: "14:20",
      description: "Learn about complete proteins, amino acids, and combining plant foods for optimal nutrition.",
      videoUrl: "https://www.youtube.com/watch?v=tJtFGEpmQNw",
      isLocked: false
    },
    {
      id: 2,
      title: "Module 2: Cooking with Legumes",
      duration: "18:45",
      description: "Master lentils, chickpeas, and beans - from soaking to creating flavorful main dishes.",
      videoUrl: "https://www.youtube.com/watch?v=8SqPR6jCL08",
      isLocked: !completedLessons.includes(1)
    },
    {
      id: 3,
      title: "Module 3: Tofu and Tempeh Techniques",
      duration: "22:15",
      description: "Transform bland tofu and tempeh into crispy, flavorful centerpieces with proper pressing and marinating.",
      videoUrl: "https://www.youtube.com/watch?v=quQSGNoF50s",
      isLocked: !completedLessons.includes(2)
    },
    {
      id: 4,
      title: "Module 4: Whole Grains and Seeds",
      duration: "16:30",
      description: "Explore quinoa, farro, hemp seeds, and other protein-rich grains for complete meals.",
      videoUrl: "https://www.youtube.com/watch?v=gJBz6zJHjxg",
      isLocked: !completedLessons.includes(3)
    },
    {
      id: 5,
      title: "Module 5: Complete Plant-Based Meals",
      duration: "20:10",
      description: "Bring it all together with balanced, satisfying plant-based meals the whole family will love.",
      videoUrl: "https://www.youtube.com/watch?v=I4l4sDuzjGw",
      isLocked: !completedLessons.includes(4)
    }
  ]
});

// Course 5: French Pastry Techniques
const getFrenchPastryCourse = (completedLessons: number[]): Course => ({
  id: 5,
  title: "French Pastry Techniques",
  instructor: "Maître Patissier Laurent",
  description: "Master classic French pastry techniques. From pâte choux to laminated doughs, elevate your baking skills to professional levels.",
  image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
  duration: 480,
  totalLessons: 8,
  students: 0,
  rating: 0,
  price: 299,
  difficulty: "Advanced",
  category: "Baking",
  lessons: [
    {
      id: 1,
      title: "Module 1: Pastry Fundamentals and Equipment",
      duration: "16:30",
      description: "Essential equipment, ingredient temperatures, and the science behind perfect pastry.",
      videoUrl: "https://www.youtube.com/watch?v=YxLLsLjHZ6s",
      isLocked: false
    },
    {
      id: 2,
      title: "Module 2: Pâte Brisée and Tart Shells",
      duration: "24:15",
      description: "Create flaky, buttery tart shells that don't shrink - the foundation of French patisserie.",
      videoUrl: "https://www.youtube.com/watch?v=L6ETPvMxFTs",
      isLocked: !completedLessons.includes(1)
    },
    {
      id: 3,
      title: "Module 3: Pâte Choux - Eclairs and Profiteroles",
      duration: "28:45",
      description: "Master the magical choux pastry - light, hollow puffs perfect for filling with cream.",
      videoUrl: "https://www.youtube.com/watch?v=6csoT1k1bEs",
      isLocked: !completedLessons.includes(2)
    },
    {
      id: 4,
      title: "Module 4: Croissant and Laminated Doughs",
      duration: "45:20",
      description: "The art of lamination - create hundreds of flaky layers for croissants and pain au chocolat.",
      videoUrl: "https://www.youtube.com/watch?v=vpwY3nmLLaA",
      isLocked: !completedLessons.includes(3)
    },
    {
      id: 5,
      title: "Module 5: Crème Pâtissière and Fillings",
      duration: "22:10",
      description: "Perfect pastry cream, diplomat cream, and other essential fillings for French pastries.",
      videoUrl: "https://www.youtube.com/watch?v=LGwCSiE4GxM",
      isLocked: !completedLessons.includes(4)
    },
    {
      id: 6,
      title: "Module 6: Macarons",
      duration: "35:40",
      description: "The iconic French macaron - achieve perfect feet, smooth tops, and delicate texture.",
      videoUrl: "https://www.youtube.com/watch?v=uWSOJMcvDec",
      isLocked: !completedLessons.includes(5)
    },
    {
      id: 7,
      title: "Module 7: Mille-Feuille and Puff Pastry",
      duration: "38:25",
      description: "Classic puff pastry from scratch and assembling the elegant Napoleon dessert.",
      videoUrl: "https://www.youtube.com/watch?v=gplwEMXvZg8",
      isLocked: !completedLessons.includes(6)
    },
    {
      id: 8,
      title: "Module 8: Chocolate Work and Finishing",
      duration: "30:15",
      description: "Tempering chocolate, creating decorations, and professional finishing techniques.",
      videoUrl: "https://www.youtube.com/watch?v=0uxk_hyqPe4",
      isLocked: !completedLessons.includes(7)
    }
  ]
});

// Course 6: Quick Weeknight Dinners
const getQuickDinnersCourse = (completedLessons: number[]): Course => ({
  id: 6,
  title: "Quick Weeknight Dinners",
  instructor: "Chef Busy Mom Sarah",
  description: "Delicious, healthy meals in 30 minutes or less. Perfect for busy professionals and families who want great food without the fuss.",
  image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1081&q=80",
  duration: 120,
  totalLessons: 6,
  students: 0,
  rating: 0,
  price: 0,
  difficulty: "Beginner",
  category: "Quick & Easy",
  lessons: [
    {
      id: 1,
      title: "Module 1: Meal Prep and Kitchen Organization",
      duration: "12:15",
      description: "Set yourself up for success with smart meal planning, batch cooking, and an organized kitchen.",
      videoUrl: "https://www.youtube.com/watch?v=K4TOrB7at0Y",
      isLocked: false
    },
    {
      id: 2,
      title: "Module 2: 15-Minute Stir Fries",
      duration: "14:30",
      description: "Master the wok for quick, healthy stir fries with endless flavor combinations.",
      videoUrl: "https://www.youtube.com/watch?v=WujehK7kYLM",
      isLocked: !completedLessons.includes(1)
    },
    {
      id: 3,
      title: "Module 3: One-Pan Wonders",
      duration: "18:45",
      description: "Complete meals cooked in a single pan - less cleanup, maximum flavor.",
      videoUrl: "https://www.youtube.com/watch?v=oS8pvN5g3Pk",
      isLocked: !completedLessons.includes(2)
    },
    {
      id: 4,
      title: "Module 4: Quick Pasta Dinners",
      duration: "16:20",
      description: "Beyond jarred sauce - restaurant-quality pasta dishes ready in 20 minutes.",
      videoUrl: "https://www.youtube.com/watch?v=bJUiWdM__Qw",
      isLocked: !completedLessons.includes(3)
    },
    {
      id: 5,
      title: "Module 5: Healthy Sheet Pan Meals",
      duration: "20:10",
      description: "Hands-off cooking with perfectly roasted proteins and vegetables on one tray.",
      videoUrl: "https://www.youtube.com/watch?v=jl_U7jM-hVU",
      isLocked: !completedLessons.includes(4)
    },
    {
      id: 6,
      title: "Module 6: 30-Minute Family Favorites",
      duration: "22:40",
      description: "Kid-approved meals that adults love too - tacos, burgers, and comfort food classics.",
      videoUrl: "https://www.youtube.com/watch?v=I3kNYI1hhJ4",
      isLocked: !completedLessons.includes(5)
    }
  ]
});

// Main function to get course data by ID
export const getCourseData = (completedLessons: number[], courseId: number = 1): Course | null => {
  switch (courseId) {
    case 1:
      return getKnifeSkillsCourse(completedLessons);
    case 2:
      return getItalianPastaCourse(completedLessons);
    case 3:
      return getMolecularGastronomyCourse(completedLessons);
    case 4:
      return getPlantBasedCourse(completedLessons);
    case 5:
      return getFrenchPastryCourse(completedLessons);
    case 6:
      return getQuickDinnersCourse(completedLessons);
    default:
      return null;
  }
};

// Get all courses for listing
export const getAllCourses = (): Omit<Course, 'lessons'>[] => {
  return [
    {
      id: 1,
      title: "Knife Skills Mastery",
      instructor: "Chef Isabella Rodriguez",
      description: "Master essential knife techniques and kitchen safety fundamentals.",
      image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2128&q=80",
      duration: 180,
      totalLessons: 5,
      students: 0,
      rating: 0,
      price: 0,
      difficulty: "Beginner",
      category: "Fundamentals"
    },
    {
      id: 2,
      title: "Italian Pasta Making",
      instructor: "Nonna Maria Giuseppe",
      description: "Authentic Italian pasta from scratch with traditional Tuscan techniques.",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      duration: 240,
      totalLessons: 8,
      students: 0,
      rating: 0,
      price: 89,
      difficulty: "Intermediate",
      category: "International"
    },
    {
      id: 3,
      title: "Molecular Gastronomy Basics",
      instructor: "Dr. James Chen",
      description: "Transform ordinary ingredients into extraordinary culinary art using science.",
      image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      duration: 360,
      totalLessons: 6,
      students: 0,
      rating: 0,
      price: 199,
      difficulty: "Advanced",
      category: "Innovation"
    },
    {
      id: 4,
      title: "Plant-Based Protein Power",
      instructor: "Chef Green Thompson",
      description: "Create satisfying, nutritious meals without meat.",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      duration: 150,
      totalLessons: 5,
      students: 0,
      rating: 0,
      price: 0,
      difficulty: "Beginner",
      category: "Healthy"
    },
    {
      id: 5,
      title: "French Pastry Techniques",
      instructor: "Maître Patissier Laurent",
      description: "From pâte choux to laminated doughs, elevate your baking skills.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      duration: 480,
      totalLessons: 8,
      students: 0,
      rating: 0,
      price: 299,
      difficulty: "Advanced",
      category: "Baking"
    },
    {
      id: 6,
      title: "Quick Weeknight Dinners",
      instructor: "Chef Busy Mom Sarah",
      description: "Delicious, healthy meals in 30 minutes or less.",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1081&q=80",
      duration: 120,
      totalLessons: 6,
      students: 0,
      rating: 0,
      price: 0,
      difficulty: "Beginner",
      category: "Quick & Easy"
    }
  ];
};
