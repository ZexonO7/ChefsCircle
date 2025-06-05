
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: Array<{
    type: 'paragraph' | 'heading' | 'subheading' | 'list' | 'quote';
    content?: string;
    items?: string[];
  }>;
  imageUrl: string;
  date: string;
  author: string;
  category: string;
  slug: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Mastering Knife Skills: The Foundation of Great Cooking',
    excerpt: 'Learn essential knife techniques that will transform your cooking efficiency and precision in the kitchen.',
    content: [
      {
        type: 'paragraph',
        content: 'Proper knife skills are the cornerstone of culinary excellence. Whether you\'re a home cook or aspiring chef, mastering these fundamental techniques will revolutionize your cooking experience.'
      },
      {
        type: 'heading',
        content: 'Essential Knife Grips'
      },
      {
        type: 'paragraph',
        content: 'The pinch grip is the most versatile and safe way to hold a chef\'s knife. Place your thumb and forefinger on opposite sides of the blade, just above the bolster.'
      },
      {
        type: 'heading',
        content: 'Basic Cutting Techniques'
      },
      {
        type: 'list',
        items: [
          'Rock chop: Keep the tip on the cutting board and rock the blade forward',
          'Straight chop: Lift the entire blade and cut straight down',
          'Draw cut: Pull the blade toward you while cutting for delicate items'
        ]
      },
      {
        type: 'quote',
        content: 'A sharp knife is safer than a dull one. Always keep your blades properly maintained and honed.'
      }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2128&q=80',
    date: 'Dec 15, 2024',
    author: 'Chef Isabella Rodriguez',
    category: 'Techniques',
    slug: 'mastering-knife-skills'
  },
  {
    id: '2',
    title: 'The Art of Flavor Pairing: Creating Harmonious Dishes',
    excerpt: 'Discover the science and creativity behind successful flavor combinations that elevate your cooking.',
    content: [
      {
        type: 'paragraph',
        content: 'Understanding flavor pairing is like learning a new language - one that speaks directly to our senses and emotions through food.'
      },
      {
        type: 'heading',
        content: 'Classic Flavor Profiles'
      },
      {
        type: 'list',
        items: [
          'Sweet and salty: chocolate and sea salt, watermelon and feta',
          'Acid and fat: lemon and olive oil, vinegar and butter',
          'Heat and cool: spicy peppers with cooling dairy'
        ]
      },
      {
        type: 'heading',
        content: 'Modern Pairing Techniques'
      },
      {
        type: 'paragraph',
        content: 'Contemporary chefs often use molecular analysis to discover unexpected but harmonious flavor combinations.'
      }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    date: 'Dec 10, 2024',
    author: 'Chef Marcus Chen',
    category: 'Culinary Science',
    slug: 'art-of-flavor-pairing'
  },
  {
    id: '3',
    title: 'Seasonal Cooking: Embracing Nature\'s Calendar',
    excerpt: 'Learn how to create menus that celebrate the natural rhythm of seasons and local ingredients.',
    content: [
      {
        type: 'paragraph',
        content: 'Seasonal cooking isn\'t just about using fresh ingredients - it\'s about connecting with the natural world and creating dishes that feel perfectly timed.'
      },
      {
        type: 'heading',
        content: 'Spring: Renewal and Fresh Starts'
      },
      {
        type: 'paragraph',
        content: 'Spring brings tender vegetables, fresh herbs, and the promise of warmer days. Focus on light preparations that highlight natural flavors.'
      },
      {
        type: 'list',
        items: [
          'Asparagus with lemon and herbs',
          'Pea shoots in delicate salads',
          'Early strawberries in simple desserts'
        ]
      }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    date: 'Dec 5, 2024',
    author: 'Chef Elena Dubois',
    category: 'Seasonal',
    slug: 'seasonal-cooking-guide'
  },
  {
    id: '4',
    title: 'From Farm to Table: Building Sustainable Kitchen Practices',
    excerpt: 'Explore how modern kitchens are embracing sustainability without compromising on flavor or creativity.',
    content: [
      {
        type: 'paragraph',
        content: 'The farm-to-table movement has evolved beyond a trend into a fundamental approach to conscious cooking that benefits both our plates and our planet.'
      },
      {
        type: 'heading',
        content: 'The Shift from Industrial to Local Sourcing'
      },
      {
        type: 'paragraph',
        content: 'Modern kitchens are building direct relationships with local farmers, reducing transportation costs and ensuring peak freshness. This shift has revolutionized how we think about ingredients and seasonality.'
      },
      {
        type: 'heading',
        content: 'Zero-Waste Kitchen Techniques'
      },
      {
        type: 'list',
        items: [
          'Root-to-stem cooking: utilizing entire vegetables including tops and peels',
          'Nose-to-tail preparation: using all parts of proteins to minimize waste',
          'Fermentation and preservation: extending ingredient lifecycles naturally',
          'Composting programs: turning kitchen scraps into garden nutrients'
        ]
      },
      {
        type: 'subheading',
        content: 'Reduced Food Costs'
      },
      {
        type: 'paragraph',
        content: 'By utilizing whole ingredients and reducing waste, restaurants can decrease food costs by 15-25% while creating more interesting and diverse menu offerings.'
      },
      {
        type: 'subheading',
        content: 'Enhanced Flavor Profiles'
      },
      {
        type: 'paragraph',
        content: 'Fresh, local ingredients at peak ripeness provide superior flavor and nutritional value compared to ingredients that have traveled long distances.'
      },
      {
        type: 'quote',
        content: 'Sustainability in the kitchen isn\'t just about environmental responsibility - it\'s about creating deeper connections with our food sources and discovering new levels of creativity within natural constraints.'
      },
      {
        type: 'heading',
        content: 'Key Benefits of Sustainable Practices'
      },
      {
        type: 'subheading',
        content: 'Environmental Impact'
      },
      {
        type: 'paragraph',
        content: 'Local sourcing significantly reduces carbon footprint while supporting regional agriculture and preserving culinary traditions.'
      },
      {
        type: 'subheading',
        content: 'Community Connection'
      },
      {
        type: 'paragraph',
        content: 'Building relationships with local producers creates a network of support that strengthens both the culinary community and local economy.'
      },
      {
        type: 'heading',
        content: 'Ready to Transform Your Kitchen Practices?'
      },
      {
        type: 'paragraph',
        content: 'Sustainable cooking practices are not just trends - they represent the future of responsible culinary arts. Start small with one local supplier or zero-waste technique, and gradually build a more sustainable kitchen operation.'
      }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1081&q=80',
    date: 'Dec 20, 2024',
    author: 'Chef David Thompson',
    category: 'Sustainability',
    slug: 'farm-to-table-sustainability'
  }
];
