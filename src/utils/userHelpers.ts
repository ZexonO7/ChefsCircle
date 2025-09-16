// Explicit utility functions for user data handling - no implicit behavior

export interface UserResult {
  id: string;
  full_name: string | null;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  profile_image_url: string | null;
  bio: string | null;
  total_xp: number;
  level: number;
}

export interface UserProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  profile_image_url: string | null;
  bio: string | null;
  total_xp: number;
  level: number;
}

export interface UserAchievement {
  id: string;
  achievement_type: string;
  achievement_name: string;
  earned_at: string;
  xp_awarded: number;
}

export interface UserRecipe {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  difficulty: string | null;
  cook_time: number | null;
  image_url: string | null;
  status: string;
}

// Explicit name resolution - no fallback magic
export const getExplicitDisplayName = (user: UserResult | UserProfile): string => {
  if (user.full_name && user.full_name.trim()) {
    return user.full_name.trim();
  }
  
  if (user.username && user.username.trim()) {
    return user.username.trim();
  }
  
  if (user.email && user.email.trim()) {
    const emailPart = user.email.split('@')[0];
    if (emailPart && emailPart.trim()) {
      return emailPart.trim();
    }
  }
  
  return 'Unknown User';
};

// Explicit avatar URL resolution - no implicit fallbacks
export const getExplicitAvatarUrl = (user: UserResult | UserProfile): string => {
  if (user.avatar_url && user.avatar_url.trim()) {
    return user.avatar_url.trim();
  }
  
  if (user.profile_image_url && user.profile_image_url.trim()) {
    return user.profile_image_url.trim();
  }
  
  // Explicit default image path
  return "/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png";
};

// Explicit badge icon mapping - no string matching magic
export const getExplicitBadgeIcon = (achievementName: string): string => {
  const normalizedName = achievementName.toLowerCase().trim();
  
  const iconMap: Record<string, string> = {
    'welcome chef': 'ChefHat',
    'profile master': 'User',
    'recipe creator': 'ChefHat',
    'master chef': 'Star',
    'community leader': 'Users',
    'course attendee': 'BookOpen',
    'club member': 'Users',
    'curious chef': 'HelpCircle',
    'question master': 'Brain',
    'ai recipe master': 'Sparkles',
    'news reader': 'Newspaper'
  };
  
  // Check for exact matches first
  if (iconMap[normalizedName]) {
    return iconMap[normalizedName];
  }
  
  // Explicit keyword matching
  if (normalizedName.includes('chef')) return 'ChefHat';
  if (normalizedName.includes('course')) return 'BookOpen';
  if (normalizedName.includes('master')) return 'Star';
  if (normalizedName.includes('leader')) return 'Users';
  if (normalizedName.includes('member')) return 'Users';
  if (normalizedName.includes('question')) return 'HelpCircle';
  if (normalizedName.includes('ai')) return 'Sparkles';
  if (normalizedName.includes('news')) return 'Newspaper';
  
  // Explicit default
  return 'Award';
};

// Explicit validation functions
export const isValidUserId = (userId: string | undefined): boolean => {
  return typeof userId === 'string' && userId.trim().length > 0;
};

export const isValidSearchTerm = (searchTerm: string): boolean => {
  return typeof searchTerm === 'string' && searchTerm.trim().length >= 2;
};