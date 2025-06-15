import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import RecipeSubmissionForm from '@/components/RecipeSubmissionForm';
import RecipeModal from '@/components/RecipeModal';
import { Plus, Search, Clock, Users, Star, ChefHat, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Recipes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [userRecipes, setUserRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [recipeViews, setRecipeViews] = useState<{[key: string]: number}>({});
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const categories = ['All', 'Appetizers', 'Main Course', 'Desserts', 'Beverages', 'Breakfast', 'Vegetarian', 'Quick & Easy'];

  const staticRecipes = [
    {
      id: 1,
      title: "Classic Beef Bourguignon",
      author: "ChefCircle",
      description: "A rich and flavorful French stew with tender beef braised in red wine, vegetables, and herbs.",
      image: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&h=400&fit=crop",
      cookTime: 180,
      difficulty: "Advanced",
      rating: 4.9,
      category: "Main Course",
      status: "approved",
      likes: 456,
      isPremium: false,
      servings: 6,
      view_count: recipeViews['1'] || 128,
      ingredients: [
        "3 lbs beef chuck, cut into 2-inch pieces",
        "6 strips bacon, chopped",
        "1 large onion, diced",
        "2 carrots, sliced",
        "3 cloves garlic, minced",
        "3 cups red wine",
        "2 cups beef broth",
        "2 tbsp tomato paste",
        "1 bouquet garni",
        "8 oz mushrooms, halved",
        "Salt and pepper to taste"
      ],
      instructions: [
        "Preheat oven to 325°F. Season beef with salt and pepper.",
        "Cook bacon in Dutch oven until crispy. Remove and set aside.",
        "Brown beef in bacon fat in batches. Remove and set aside.",
        "Sauté onions and carrots until softened. Add garlic and cook 1 minute.",
        "Add tomato paste and cook 2 minutes. Add wine and scrape up browned bits.",
        "Return beef and bacon to pot. Add broth and bouquet garni.",
        "Cover and braise in oven for 2 hours until tender.",
        "Add mushrooms in last 30 minutes of cooking.",
        "Adjust seasoning and serve with crusty bread."
      ]
    },
    {
      id: 2,
      title: "Homemade Margherita Pizza",
      author: "ChefCircle",
      description: "Authentic Italian pizza with fresh mozzarella, basil, and San Marzano tomatoes on homemade dough.",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop",
      cookTime: 120,
      difficulty: "Intermediate",
      rating: 4.8,
      category: "Main Course",
      status: "approved",
      likes: 789,
      isPremium: false,
      servings: 4,
      view_count: recipeViews['2'] || 245,
      ingredients: [
        "3 cups bread flour",
        "1 tsp active dry yeast",
        "1 tsp salt",
        "1 tbsp olive oil",
        "1 cup warm water",
        "1 can San Marzano tomatoes, crushed",
        "8 oz fresh mozzarella, sliced",
        "Fresh basil leaves",
        "Extra virgin olive oil for drizzling"
      ],
      instructions: [
        "Dissolve yeast in warm water and let stand 5 minutes until foamy.",
        "Mix flour and salt in large bowl. Add yeast mixture and olive oil.",
        "Knead dough 8-10 minutes until smooth. Place in oiled bowl, cover, rise 1 hour.",
        "Preheat oven to 500°F with pizza stone if available.",
        "Punch down dough and roll into 12-inch circle.",
        "Spread crushed tomatoes evenly, leaving 1-inch border.",
        "Add mozzarella slices and drizzle with olive oil.",
        "Bake 10-12 minutes until crust is golden and cheese bubbles.",
        "Top with fresh basil and serve immediately."
      ]
    },
    {
      id: 3,
      title: "Chocolate Lava Cake",
      author: "ChefCircle",
      description: "Decadent individual chocolate cakes with molten centers, perfect for special occasions.",
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=400&fit=crop",
      cookTime: 25,
      difficulty: "Intermediate",
      rating: 4.9,
      category: "Desserts",
      status: "approved",
      likes: 623,
      isPremium: false,
      servings: 4,
      view_count: recipeViews['3'] || 189,
      ingredients: [
        "4 oz dark chocolate, chopped",
        "4 tbsp unsalted butter",
        "2 large eggs",
        "2 large egg yolks",
        "1/4 cup granulated sugar",
        "2 tbsp all-purpose flour",
        "Butter and cocoa powder for ramekins",
        "Vanilla ice cream for serving"
      ],
      instructions: [
        "Preheat oven to 425°F. Butter four 6-oz ramekins and dust with cocoa powder.",
        "Melt chocolate and butter in double boiler until smooth.",
        "Whisk whole eggs, egg yolks, and sugar until thick and pale.",
        "Fold chocolate mixture into egg mixture.",
        "Gently fold in flour until just combined.",
        "Divide batter among prepared ramekins.",
        "Bake 12-14 minutes until edges are firm but centers jiggle slightly.",
        "Let rest 1 minute, then run knife around edges and invert onto plates.",
        "Serve immediately with vanilla ice cream."
      ]
    },
    {
      id: 4,
      title: "Caesar Salad with Homemade Dressing",
      author: "ChefCircle",
      description: "Classic Caesar salad with crisp romaine, parmesan, croutons, and authentic Caesar dressing.",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
      cookTime: 20,
      difficulty: "Easy",
      rating: 4.7,
      category: "Appetizers",
      status: "approved",
      likes: 345,
      isPremium: false,
      servings: 4,
      view_count: recipeViews['4'] || 167,
      ingredients: [
        "2 heads romaine lettuce, chopped",
        "1/2 cup grated Parmesan cheese",
        "1 cup homemade croutons",
        "2 anchovy fillets",
        "2 cloves garlic, minced",
        "1 egg yolk",
        "2 tbsp lemon juice",
        "1 tsp Dijon mustard",
        "1/3 cup olive oil",
        "Salt and pepper to taste"
      ],
      instructions: [
        "Wash and dry romaine lettuce thoroughly. Chop into bite-sized pieces.",
        "For dressing, mash anchovies and garlic into paste.",
        "Whisk in egg yolk, lemon juice, and Dijon mustard.",
        "Slowly drizzle in olive oil while whisking to emulsify.",
        "Season with salt and pepper to taste.",
        "Toss romaine with dressing until well coated.",
        "Top with Parmesan cheese and croutons.",
        "Serve immediately while lettuce is crisp."
      ]
    },
    {
      id: 5,
      title: "Pan-Seared Salmon with Lemon Butter",
      author: "ChefCircle",
      description: "Perfectly cooked salmon with crispy skin and a rich lemon butter sauce.",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop",
      cookTime: 15,
      difficulty: "Easy",
      rating: 4.8,
      category: "Main Course",
      status: "approved",
      likes: 567,
      isPremium: false,
      servings: 4,
      view_count: recipeViews['5'] || 298,
      ingredients: [
        "4 salmon fillets (6 oz each)",
        "2 tbsp olive oil",
        "4 tbsp butter",
        "2 cloves garlic, minced",
        "Juice of 1 lemon",
        "2 tbsp fresh parsley, chopped",
        "Salt and pepper to taste",
        "Lemon wedges for serving"
      ],
      instructions: [
        "Pat salmon fillets dry and season with salt and pepper.",
        "Heat olive oil in large skillet over medium-high heat.",
        "Place salmon skin-side up and cook 4-5 minutes without moving.",
        "Flip and cook 3-4 minutes more until internal temp reaches 145°F.",
        "Remove salmon and keep warm.",
        "Add butter and garlic to same pan, cook 30 seconds.",
        "Add lemon juice and parsley, swirl to combine.",
        "Pour sauce over salmon and serve with lemon wedges."
      ]
    },
    {
      id: 6,
      title: "French Onion Soup",
      author: "ChefCircle",
      description: "Classic French soup with caramelized onions, rich beef broth, and melted Gruyère cheese.",
      image: "https://images.unsplash.com/photo-1547584370-832c11da9297?w=600&h=400&fit=crop",
      cookTime: 90,
      difficulty: "Intermediate",
      rating: 4.6,
      category: "Appetizers",
      status: "approved",
      likes: 423,
      isPremium: false,
      servings: 6,
      view_count: recipeViews['6'] || 156,
      ingredients: [
        "6 large yellow onions, thinly sliced",
        "4 tbsp butter",
        "1 tsp sugar",
        "1/2 cup dry white wine",
        "6 cups beef broth",
        "2 bay leaves",
        "1 tsp fresh thyme",
        "6 slices French bread",
        "2 cups Gruyère cheese, grated",
        "Salt and pepper to taste"
      ],
      instructions: [
        "Melt butter in large pot over medium heat.",
        "Add onions and sugar, cook 45 minutes, stirring occasionally until caramelized.",
        "Add wine and scrape up browned bits.",
        "Add broth, bay leaves, and thyme. Simmer 20 minutes.",
        "Season with salt and pepper. Remove bay leaves.",
        "Preheat broiler. Toast bread slices.",
        "Ladle soup into oven-safe bowls.",
        "Top each with toast and generous amount of cheese.",
        "Broil until cheese is bubbly and golden."
      ]
    },
    {
      id: 7,
      title: "Chicken Tikka Masala",
      author: "ChefCircle",
      description: "Tender chicken in a creamy, spiced tomato sauce - a beloved Indian-inspired dish.",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop",
      cookTime: 60,
      difficulty: "Intermediate",
      rating: 4.8,
      category: "Main Course",
      status: "approved",
      likes: 689,
      isPremium: false,
      servings: 4,
      view_count: recipeViews['7'] || 234,
      ingredients: [
        "2 lbs boneless chicken, cubed",
        "1 cup plain yogurt",
        "2 tbsp lemon juice",
        "2 tsp garam masala",
        "1 tsp cumin",
        "1 tsp paprika",
        "1 onion, diced",
        "4 cloves garlic, minced",
        "1 tbsp ginger, minced",
        "1 can crushed tomatoes",
        "1 cup heavy cream",
        "Fresh cilantro for garnish"
      ],
      instructions: [
        "Marinate chicken in yogurt, lemon juice, and half the spices for 30 minutes.",
        "Thread chicken onto skewers and grill until cooked through.",
        "Sauté onion until softened. Add garlic, ginger, remaining spices.",
        "Add crushed tomatoes and simmer 15 minutes.",
        "Stir in cream and grilled chicken.",
        "Simmer 10 minutes until sauce thickens.",
        "Adjust seasoning and garnish with cilantro.",
        "Serve over basmati rice with naan bread."
      ]
    },
    {
      id: 8,
      title: "Classic Tiramisu",
      author: "ChefCircle",
      description: "Traditional Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.",
      image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=400&fit=crop",
      cookTime: 30,
      difficulty: "Intermediate",
      rating: 4.9,
      category: "Desserts",
      status: "approved",
      likes: 734,
      isPremium: false,
      servings: 8,
      view_count: recipeViews['8'] || 289,
      ingredients: [
        "6 egg yolks",
        "3/4 cup sugar",
        "1 1/3 cups mascarpone cheese",
        "1 3/4 cups heavy cream",
        "2 packages ladyfinger cookies",
        "1 cup strong espresso, cooled",
        "3 tbsp coffee liqueur",
        "Unsweetened cocoa powder",
        "Dark chocolate shavings"
      ],
      instructions: [
        "Whisk egg yolks and sugar until thick and pale.",
        "Add mascarpone and beat until smooth.",
        "Whip cream to soft peaks and fold into mascarpone mixture.",
        "Combine espresso and coffee liqueur in shallow dish.",
        "Quickly dip each ladyfinger in coffee mixture.",
        "Arrange half the ladyfingers in 9x13 dish.",
        "Spread half the mascarpone mixture over ladyfingers.",
        "Repeat layers. Refrigerate at least 4 hours.",
        "Dust with cocoa powder and chocolate shavings before serving."
      ]
    },
    {
      id: 9,
      title: "Thai Green Curry",
      author: "ChefCircle",
      description: "Fragrant and spicy Thai curry with coconut milk, vegetables, and aromatic herbs.",
      image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=600&h=400&fit=crop",
      cookTime: 30,
      difficulty: "Intermediate",
      rating: 4.7,
      category: "Main Course",
      status: "approved",
      likes: 456,
      isPremium: false,
      servings: 4,
      view_count: recipeViews['9'] || 178,
      ingredients: [
        "2 tbsp green curry paste",
        "1 can coconut milk",
        "1 lb chicken breast, sliced",
        "1 eggplant, cubed",
        "1 red bell pepper, sliced",
        "1/4 cup Thai basil leaves",
        "2 tbsp fish sauce",
        "1 tbsp brown sugar",
        "2 kaffir lime leaves",
        "1 Thai chili, sliced",
        "Jasmine rice for serving"
      ],
      instructions: [
        "Heat thick coconut milk in wok over medium heat.",
        "Add curry paste and fry until fragrant, about 2 minutes.",
        "Add chicken and cook until no longer pink.",
        "Add remaining coconut milk, eggplant, and bell pepper.",
        "Simmer 15 minutes until vegetables are tender.",
        "Stir in fish sauce, brown sugar, and lime leaves.",
        "Add Thai basil and chili just before serving.",
        "Serve over jasmine rice."
      ]
    },
    {
      id: 10,
      title: "New York Cheesecake",
      author: "ChefCircle",
      description: "Rich and creamy classic New York-style cheesecake with graham cracker crust.",
      image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&h=400&fit=crop",
      cookTime: 90,
      difficulty: "Advanced",
      rating: 4.9,
      category: "Desserts",
      status: "approved",
      likes: 892,
      isPremium: false,
      servings: 12,
      view_count: recipeViews['10'] || 356,
      ingredients: [
        "2 cups graham cracker crumbs",
        "1/2 cup butter, melted",
        "2 lbs cream cheese, softened",
        "1 cup sugar",
        "4 large eggs",
        "1 cup sour cream",
        "1 tsp vanilla extract",
        "1/4 cup all-purpose flour",
        "Fresh berries for topping"
      ],
      instructions: [
        "Preheat oven to 325°F. Mix graham cracker crumbs and butter.",
        "Press mixture into bottom of 9-inch springform pan.",
        "Beat cream cheese until smooth. Gradually add sugar.",
        "Beat in eggs one at a time, then sour cream and vanilla.",
        "Mix in flour until just combined.",
        "Pour over crust and smooth top.",
        "Bake 55-60 minutes until center is almost set.",
        "Cool completely, then refrigerate 4 hours.",
        "Top with fresh berries before serving."
      ]
    },
    {
      id: 11,
      title: "Coq au Vin",
      author: "ChefCircle",
      description: "Classic French braised chicken dish with wine, mushrooms, and pearl onions.",
      image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&h=400&fit=crop",
      cookTime: 120,
      difficulty: "Advanced",
      rating: 4.8,
      category: "Main Course",
      status: "approved",
      likes: 567,
      isPremium: false,
      servings: 6,
      view_count: recipeViews['11'] || 142,
      ingredients: [
        "1 whole chicken, cut into pieces",
        "6 strips bacon, chopped",
        "12 pearl onions, peeled",
        "8 oz mushrooms, quartered",
        "3 cloves garlic, minced",
        "2 cups red wine",
        "1 cup chicken broth",
        "2 tbsp tomato paste",
        "2 bay leaves",
        "Fresh thyme sprigs",
        "Salt and pepper to taste"
      ],
      instructions: [
        "Season chicken pieces with salt and pepper.",
        "Cook bacon in Dutch oven until crispy. Remove and set aside.",
        "Brown chicken in bacon fat. Remove and set aside.",
        "Sauté onions and mushrooms until golden. Add garlic.",
        "Add tomato paste and cook 1 minute.",
        "Add wine, scraping up browned bits.",
        "Return chicken and bacon to pot with broth and herbs.",
        "Cover and simmer 45 minutes until chicken is tender.",
        "Adjust seasoning and serve with crusty bread."
      ]
    },
    {
      id: 12,
      title: "Shrimp Scampi",
      author: "ChefCircle",
      description: "Succulent shrimp in garlic, white wine, and butter sauce over pasta.",
      image: "https://images.unsplash.com/photo-1563379091339-03246962d51d?w=600&h=400&fit=crop",
      cookTime: 20,
      difficulty: "Easy",
      rating: 4.7,
      category: "Main Course",
      status: "approved",
      likes: 456,
      isPremium: false,
      servings: 4,
      view_count: recipeViews['12'] || 201,
      ingredients: [
        "1 lb large shrimp, peeled",
        "1 lb linguine pasta",
        "6 cloves garlic, minced",
        "1/2 cup white wine",
        "6 tbsp butter",
        "3 tbsp olive oil",
        "Juice of 1 lemon",
        "1/4 cup parsley, chopped",
        "Red pepper flakes",
        "Salt and pepper to taste"
      ],
      instructions: [
        "Cook linguine according to package directions.",
        "Season shrimp with salt and pepper.",
        "Heat olive oil in large skillet over medium-high heat.",
        "Cook shrimp 2 minutes per side until pink. Remove.",
        "Add garlic to same pan, cook 30 seconds.",
        "Add wine and simmer 2 minutes.",
        "Stir in butter, lemon juice, and red pepper flakes.",
        "Return shrimp to pan with parsley.",
        "Toss with hot pasta and serve immediately."
      ]
    },
    {
      id: 13,
      title: "Banana Bread",
      author: "ChefCircle",
      description: "Moist and flavorful banana bread perfect for breakfast or afternoon snack.",
      image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600&h=400&fit=crop",
      cookTime: 75,
      difficulty: "Easy",
      rating: 4.6,
      category: "Breakfast",
      status: "approved",
      likes: 345,
      isPremium: false,
      servings: 10,
      view_count: recipeViews['13'] || 167,
      ingredients: [
        "3 ripe bananas, mashed",
        "1/3 cup melted butter",
        "3/4 cup sugar",
        "1 egg, beaten",
        "1 tsp vanilla extract",
        "1 tsp baking soda",
        "Pinch of salt",
        "1 1/2 cups all-purpose flour",
        "Optional: 1/2 cup chopped walnuts"
      ],
      instructions: [
        "Preheat oven to 350°F. Grease 9x5 loaf pan.",
        "Mix melted butter with mashed bananas.",
        "Stir in sugar, egg, and vanilla.",
        "Sprinkle baking soda and salt over mixture and stir.",
        "Add flour and mix until just combined.",
        "Fold in walnuts if using.",
        "Pour into prepared loaf pan.",
        "Bake 60-65 minutes until toothpick comes out clean.",
        "Cool in pan 10 minutes before removing."
      ]
    },
    {
      id: 14,
      title: "Mushroom Risotto",
      author: "ChefCircle",
      description: "Creamy Italian rice dish with wild mushrooms and Parmesan cheese.",
      image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&h=400&fit=crop",
      cookTime: 45,
      difficulty: "Intermediate",
      rating: 4.8,
      category: "Vegetarian",
      status: "approved",
      likes: 567,
      isPremium: false,
      servings: 4,
      view_count: recipeViews['14'] || 198,
      ingredients: [
        "1 1/2 cups Arborio rice",
        "6 cups warm vegetable broth",
        "1 lb mixed mushrooms, sliced",
        "1 onion, finely diced",
        "3 cloves garlic, minced",
        "1/2 cup white wine",
        "4 tbsp butter",
        "2 tbsp olive oil",
        "1/2 cup Parmesan cheese",
        "2 tbsp fresh parsley"
      ],
      instructions: [
        "Sauté mushrooms in olive oil until golden. Set aside.",
        "In same pan, cook onion until softened. Add garlic.",
        "Add rice and stir 2 minutes until lightly toasted.",
        "Add wine and stir until absorbed.",
        "Add warm broth one ladle at a time, stirring constantly.",
        "Continue until rice is creamy and tender, about 20 minutes.",
        "Stir in mushrooms, butter, and Parmesan.",
        "Garnish with parsley and serve immediately."
      ]
    },
    {
      id: 15,
      title: "Fish Tacos with Mango Salsa",
      author: "ChefCircle",
      description: "Fresh and vibrant fish tacos topped with tropical mango salsa and cilantro lime crema.",
      image: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=600&h=400&fit=crop",
      cookTime: 30,
      difficulty: "Easy",
      rating: 4.7,
      category: "Main Course",
      status: "approved",
      likes: 423,
      isPremium: false,
      servings: 4,
      view_count: recipeViews['15'] || 167,
      ingredients: [
        "1 lb white fish fillets",
        "8 corn tortillas",
        "1 mango, diced",
        "1/2 red onion, diced",
        "1 jalapeño, minced",
        "Juice of 2 limes",
        "1/4 cup cilantro, chopped",
        "1/2 cup sour cream",
        "2 tbsp olive oil",
        "1 tsp cumin",
        "Cabbage slaw for topping"
      ],
      instructions: [
        "Season fish with cumin, salt, and pepper.",
        "Heat olive oil in skillet and cook fish 4 minutes per side.",
        "For salsa, combine mango, onion, jalapeño, half the lime juice, and cilantro.",
        "Mix sour cream with remaining lime juice for crema.",
        "Warm tortillas in dry skillet.",
        "Flake fish and place in tortillas.",
        "Top with mango salsa, cabbage slaw, and lime crema.",
        "Serve with lime wedges."
      ]
    },
    {
      id: 16,
      title: "Beef Stroganoff",
      author: "ChefCircle",
      description: "Classic Russian dish with tender beef in a rich sour cream sauce over egg noodles.",
      image: "https://images.unsplash.com/photo-1572441713132-51c75654db73?w=600&h=400&fit=crop",
      cookTime: 40,
      difficulty: "Intermediate",
      rating: 4.6,
      category: "Main Course",
      status: "approved",
      likes: 389,
      isPremium: false,
      servings: 6,
      view_count: recipeViews['16'] || 134,
      ingredients: [
        "2 lbs beef sirloin, sliced thin",
        "12 oz egg noodles",
        "8 oz mushrooms, sliced",
        "1 onion, sliced",
        "3 cloves garlic, minced",
        "2 tbsp flour",
        "2 cups beef broth",
        "1 cup sour cream",
        "2 tbsp Dijon mustard",
        "3 tbsp butter",
        "Fresh parsley for garnish"
      ],
      instructions: [
        "Cook egg noodles according to package directions.",
        "Season beef with salt and pepper.",
        "Sear beef in hot skillet until browned. Remove.",
        "Sauté mushrooms and onion until softened. Add garlic.",
        "Sprinkle flour over vegetables and cook 1 minute.",
        "Gradually add broth, whisking to prevent lumps.",
        "Return beef to pan and simmer 15 minutes.",
        "Stir in sour cream and mustard off heat.",
        "Serve over noodles, garnished with parsley."
      ]
    },
    {
      id: 17,
      title: "Caprese Salad",
      author: "ChefCircle",
      description: "Simple Italian salad showcasing fresh mozzarella, tomatoes, and basil with balsamic glaze.",
      image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=600&h=400&fit=crop",
      cookTime: 10,
      difficulty: "Easy",
      rating: 4.5,
      category: "Appetizers",
      status: "approved",
      likes: 234,
      isPremium: false,
      servings: 4,
      view_count: recipeViews['17'] || 89,
      ingredients: [
        "4 large ripe tomatoes, sliced",
        "1 lb fresh mozzarella, sliced",
        "1/4 cup fresh basil leaves",
        "3 tbsp extra virgin olive oil",
        "2 tbsp balsamic vinegar",
        "1 tbsp honey",
        "Sea salt and black pepper",
        "Baguette slices for serving"
      ],
      instructions: [
        "Arrange tomato and mozzarella slices alternately on platter.",
        "Tuck basil leaves between slices.",
        "Drizzle with olive oil and season with salt and pepper.",
        "For balsamic glaze, simmer vinegar and honey until thickened.",
        "Drizzle balsamic glaze over salad just before serving.",
        "Serve with crusty baguette slices.",
        "Best enjoyed at room temperature."
      ]
    },
    {
      id: 18,
      title: "Chocolate Chip Cookies",
      author: "ChefCircle",
      description: "Classic homemade chocolate chip cookies that are crispy on the edges and chewy in the center.",
      image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&h=400&fit=crop",
      cookTime: 25,
      difficulty: "Easy",
      rating: 4.8,
      category: "Desserts",
      status: "approved",
      likes: 756,
      isPremium: false,
      servings: 24,
      view_count: recipeViews['18'] || 445,
      ingredients: [
        "2 1/4 cups all-purpose flour",
        "1 tsp baking soda",
        "1 tsp salt",
        "1 cup butter, softened",
        "3/4 cup granulated sugar",
        "3/4 cup brown sugar",
        "2 large eggs",
        "2 tsp vanilla extract",
        "2 cups chocolate chips"
      ],
      instructions: [
        "Preheat oven to 375°F.",
        "Mix flour, baking soda, and salt in bowl.",
        "Cream butter and both sugars until fluffy.",
        "Beat in eggs and vanilla.",
        "Gradually mix in flour mixture.",
        "Stir in chocolate chips.",
        "Drop rounded tablespoons onto ungreased cookie sheets.",
        "Bake 9-11 minutes until golden brown.",
        "Cool on baking sheet 2 minutes before removing."
      ]
    },
    {
      id: 19,
      title: "Vegetable Stir Fry",
      author: "ChefCircle",
      description: "Colorful and healthy stir fry with mixed vegetables in a savory garlic ginger sauce.",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=400&fit=crop",
      cookTime: 15,
      difficulty: "Easy",
      rating: 4.5,
      category: "Vegetarian",
      status: "approved",
      likes: 312,
      isPremium: false,
      servings: 4,
      view_count: recipeViews['19'] || 123,
      ingredients: [
        "2 cups broccoli florets",
        "1 bell pepper, sliced",
        "1 carrot, julienned",
        "1 zucchini, sliced",
        "8 oz snap peas",
        "3 cloves garlic, minced",
        "1 tbsp fresh ginger, minced",
        "3 tbsp soy sauce",
        "1 tbsp sesame oil",
        "2 tbsp vegetable oil",
        "1 tsp cornstarch",
        "Green onions for garnish"
      ],
      instructions: [
        "Mix soy sauce, sesame oil, and cornstarch for sauce.",
        "Heat vegetable oil in large wok or skillet.",
        "Add garlic and ginger, stir fry 30 seconds.",
        "Add harder vegetables first (broccoli, carrots).",
        "Stir fry 3-4 minutes, then add remaining vegetables.",
        "Continue stir frying until vegetables are crisp-tender.",
        "Add sauce and toss to coat.",
        "Garnish with green onions and serve over rice."
      ]
    },
    {
      id: 20,
      title: "Eggs Benedict",
      author: "ChefCircle",
      description: "Classic brunch dish with poached eggs, Canadian bacon, and hollandaise sauce on English muffins.",
      image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=600&h=400&fit=crop",
      cookTime: 30,
      difficulty: "Advanced",
      rating: 4.9,
      category: "Breakfast",
      status: "approved",
      likes: 678,
      isPremium: false,
      servings: 4,
      view_count: recipeViews['20'] || 267,
      ingredients: [
        "4 English muffin halves",
        "8 slices Canadian bacon",
        "8 large eggs",
        "3 egg yolks for hollandaise",
        "1/2 cup butter, melted",
        "2 tbsp lemon juice",
        "1/4 tsp cayenne pepper",
        "Salt and white pepper",
        "2 tbsp white vinegar",
        "Fresh chives for garnish"
      ],
      instructions: [
        "For hollandaise, whisk egg yolks and lemon juice in double boiler.",
        "Slowly drizzle in melted butter while whisking constantly.",
        "Season with salt, pepper, and cayenne. Keep warm.",
        "Bring pot of water with vinegar to gentle simmer.",
        "Crack eggs into small bowls, slide into water one at a time.",
        "Poach 3-4 minutes until whites are set.",
        "Toast English muffins and warm Canadian bacon.",
        "Assemble: muffin, bacon, poached egg, hollandaise.",
        "Garnish with chives and serve immediately."
      ]
    }
  ];

  useEffect(() => {
    fetchUserRecipes();
  }, []);

  const fetchUserRecipes = async () => {
    try {
      const { data, error } = await supabase
        .from('user_recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserRecipes(data || []);
    } catch (error: any) {
      console.error('Error fetching recipes:', error);
      toast({
        title: "Error loading recipes",
        description: error.message || "Failed to load user recipes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Combine static and user recipes
  const allRecipes = [
    ...staticRecipes,
    ...userRecipes.map(recipe => ({
      ...recipe,
      author: 'Community Chef',
      rating: 4.5,
      likes: Math.floor(Math.random() * 200) + 50,
      isPremium: false,
      status: 'approved',
      view_count: recipeViews[recipe.id] || Math.floor(Math.random() * 100) + 25
    }))
  ];

  const filteredRecipes = allRecipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         recipe.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatCookTime = (minutes: number) => {
    if (minutes >= 1440) return `${Math.floor(minutes / 1440)}d`;
    if (minutes >= 60) return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  const handleShareRecipe = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to share a recipe.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    setShowSubmissionForm(true);
  };

  const handleRecipeSubmitted = () => {
    fetchUserRecipes();
  };

  const handleViewRecipe = (recipe: any) => {
    setSelectedRecipe(recipe);
  };

  const closeRecipeModal = () => {
    setSelectedRecipe(null);
  };

  const handleViewIncrement = (recipeId: string | number) => {
    setRecipeViews(prev => ({
      ...prev,
      [recipeId]: (prev[recipeId] || 0) + 1
    }));
  };

  return (
    <PageLayout>
      <SEO 
        title="Recipe Sharing - ChefCircle Community" 
        description="Discover and share amazing recipes with the ChefCircle community. From quick meals to gourmet dishes, find your next culinary inspiration."
        keywords={['recipe sharing', 'cooking recipes', 'culinary community', 'chef recipes', 'food sharing']}
      />
      
      <div className="min-h-screen bg-chef-warm-ivory pt-20">
        {/* Hero Section */}
        <section className="chef-section bg-gradient-to-br from-chef-royal-green to-chef-forest">
          <div className="chef-container">
            <motion.div 
              className="text-center max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="chef-heading-xl text-chef-warm-ivory mb-6">
                Share Your <span className="text-chef-gold">Recipes</span>
              </h1>
              <p className="chef-body-lg text-chef-warm-ivory/90 mb-8">
                Discover amazing recipes from our community and share your own culinary creations
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleShareRecipe}
                  className="chef-button bg-chef-gold text-chef-charcoal hover:bg-chef-bronze"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Share Recipe
                </button>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-chef-charcoal/60 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search recipes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 rounded-xl border border-chef-royal-green/20 focus:outline-none focus:ring-2 focus:ring-chef-gold"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filter Categories */}
        <section className="py-8 bg-chef-warm-ivory border-b border-chef-royal-green/10">
          <div className="chef-container">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-chef-royal-green text-chef-warm-ivory'
                      : 'bg-chef-royal-green/10 text-chef-royal-green hover:bg-chef-royal-green/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Recipes Grid */}
        <section className="chef-section">
          <div className="chef-container">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chef-royal-green mx-auto mb-4"></div>
                <p className="text-chef-charcoal">Loading recipes...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRecipes.map((recipe, index) => (
                  <motion.div
                    key={`${recipe.id}-${recipe.title}`}
                    className="chef-card-luxury group cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    onClick={() => handleViewRecipe(recipe)}
                  >
                    <div className="relative overflow-hidden rounded-t-xl">
                      <img 
                        src={recipe.image_url || recipe.image || 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=400&fit=crop'} 
                        alt={recipe.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        {recipe.isPremium && (
                          <span className="chef-badge bg-chef-gold/20 text-chef-gold border-chef-gold/30">
                            Premium
                          </span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                          recipe.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {recipe.difficulty}
                        </span>
                      </div>
                      <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {formatCookTime(recipe.cook_time || recipe.cookTime || 30)}
                      </div>
                      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{recipe.view_count || 1}</span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="chef-heading-sm text-chef-charcoal group-hover:text-chef-royal-green transition-colors">
                          {recipe.title}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-chef-gold">
                          <Star className="w-4 h-4 fill-current" />
                          <span>{recipe.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-chef-royal-green font-medium mb-2">by {recipe.author}</p>
                      
                      <p className="chef-body-sm text-chef-charcoal/80 mb-4 line-clamp-2">
                        {recipe.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-chef-charcoal/60">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{recipe.likes}</span>
                          </div>
                          <span className="chef-badge-blue">{recipe.category}</span>
                        </div>
                        
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewRecipe(recipe);
                          }}
                          className="text-chef-royal-green hover:text-chef-royal-green/80 font-medium text-sm"
                        >
                          View Recipe →
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            {!loading && filteredRecipes.length === 0 && (
              <div className="text-center py-12">
                <p className="chef-body text-chef-charcoal/60">No recipes found matching your criteria.</p>
              </div>
            )}
          </div>
        </section>

        {/* Approval Notice */}
        <section className="chef-section bg-chef-royal-blue/5">
          <div className="chef-container">
            <motion.div 
              className="text-center max-w-3xl mx-auto chef-card p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <ChefHat className="w-12 h-12 text-chef-royal-green mx-auto mb-4" />
              <h2 className="chef-heading-md text-chef-charcoal mb-4">
                Recipe Submission Guidelines
              </h2>
              <p className="chef-body text-chef-charcoal/80 mb-6">
                All recipes go through our community approval process to ensure quality and authenticity. 
                Our expert chefs review each submission to maintain the high standards ChefCircle is known for.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-chef-royal-green/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-chef-royal-green font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-chef-charcoal mb-1">Submit Recipe</h4>
                    <p className="text-sm text-chef-charcoal/70">Share your recipe with detailed instructions and photos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-chef-royal-green/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-chef-royal-green font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-chef-charcoal mb-1">Community Review</h4>
                    <p className="text-sm text-chef-charcoal/70">Our chefs review for quality and authenticity</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-chef-royal-green/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-chef-royal-green font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-chef-charcoal mb-1">Get Published</h4>
                    <p className="text-sm text-chef-charcoal/70">Approved recipes join our community library</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      <RecipeSubmissionForm
        isOpen={showSubmissionForm}
        onClose={() => setShowSubmissionForm(false)}
        onSubmit={handleRecipeSubmitted}
      />

      <RecipeModal
        recipe={selectedRecipe}
        isOpen={!!selectedRecipe}
        onClose={closeRecipeModal}
        onViewIncrement={handleViewIncrement}
      />
    </PageLayout>
  );
};

export default Recipes;
