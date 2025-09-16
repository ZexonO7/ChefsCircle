import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Award, Trophy, ChefHat, BookOpen, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import RecipeCard from '@/components/recipes/RecipeCard';
import LoadingScreen from '@/components/LoadingScreen';
import NotFound from './NotFound';

interface UserProfile {
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

interface UserAchievement {
  id: string;
  achievement_type: string;
  achievement_name: string;
  earned_at: string;
  xp_awarded: number;
}

interface UserRecipe {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  difficulty: string | null;
  cook_time: number | null;
  image_url: string | null;
  status: string;
}

const UserProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [recipes, setRecipes] = useState<UserRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        setIsLoading(true);

        // Fetch user profile with gamification data
        const { data: profileData, error: profileError } = await supabase.rpc('search_users', {
          search_term: '',
          limit_count: 1000
        });

        if (profileError) throw profileError;

        const userProfile = profileData?.find(user => user.id === userId);
        if (!userProfile) {
          setError('User not found');
          return;
        }

        setProfile(userProfile);

        // Fetch achievements
        const { data: achievementsData, error: achievementsError } = await supabase
          .from('user_achievements')
          .select('*')
          .eq('user_id', userId)
          .order('earned_at', { ascending: false });

        if (achievementsError) throw achievementsError;
        setAchievements(achievementsData || []);

        // Fetch approved recipes
        const { data: recipesData, error: recipesError } = await supabase
          .from('user_recipes')
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        if (recipesError) throw recipesError;
        setRecipes(recipesData || []);

      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const getDisplayName = (profile: UserProfile) => {
    return profile.full_name || profile.username || profile.email?.split('@')[0] || 'Unknown User';
  };

  const getAvatarUrl = (profile: UserProfile) => {
    return profile.avatar_url || profile.profile_image_url || "/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png";
  };

  const getBadgeIcon = (achievementName: string) => {
    if (achievementName.toLowerCase().includes('chef')) return <ChefHat className="h-4 w-4" />;
    if (achievementName.toLowerCase().includes('course')) return <BookOpen className="h-4 w-4" />;
    if (achievementName.toLowerCase().includes('master')) return <Star className="h-4 w-4" />;
    return <Award className="h-4 w-4" />;
  };

  if (isLoading) return <LoadingScreen />;
  if (error || !profile) return <NotFound />;

  const displayName = getDisplayName(profile);

  return (
    <PageLayout>
      <SEO 
        title={`${displayName} - Chef Profile | ChefsCircle`}
        description={`View ${displayName}'s culinary profile, achievements, and recipes on ChefsCircle.`}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-8">
        <div className="chef-container space-y-8">
          
          {/* Profile Header */}
          <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-chef-royal-green to-chef-green-light"></div>
            <CardContent className="relative -mt-16 pb-6">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                  <AvatarImage src={getAvatarUrl(profile)} alt={displayName} />
                  <AvatarFallback className="text-2xl">
                    <User className="h-16 w-16" />
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">{displayName}</h1>
                    {profile.bio && (
                      <p className="text-muted-foreground mt-2">{profile.bio}</p>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-4">
                    <Badge variant="secondary" className="text-base px-4 py-2">
                      <Trophy className="h-4 w-4 mr-2" />
                      Level {profile.level}
                    </Badge>
                    <Badge variant="outline" className="text-base px-4 py-2">
                      <Award className="h-4 w-4 mr-2" />
                      {profile.total_xp} XP
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <ChefHat className="h-5 w-5" />
                  Recipes
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-chef-royal-green">{recipes.length}</p>
                <p className="text-muted-foreground">Approved Recipes</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-chef-royal-blue">{achievements.length}</p>
                <p className="text-muted-foreground">Badges Earned</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Level
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-3xl font-bold text-chef-gold">{profile.level}</p>
                <p className="text-muted-foreground">{profile.total_xp} Total XP</p>
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          {achievements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-chef-royal-green/10">
                        {getBadgeIcon(achievement.achievement_name)}
                      </div>
                      <div>
                        <p className="font-medium">{achievement.achievement_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {achievement.xp_awarded} XP
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recipes */}
          {recipes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5" />
                  Recipes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={{
                        id: recipe.id,
                        title: recipe.title,
                        author: displayName,
                        description: recipe.description || '',
                        category: recipe.category || 'Other',
                        difficulty: recipe.difficulty || 'Medium',
                        cook_time: recipe.cook_time || 30,
                        image_url: recipe.image_url,
                        rating: 0,
                        likes: 0
                      }}
                      index={0}
                      onViewRecipe={() => {}}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {recipes.length === 0 && achievements.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground">
                  This chef hasn't shared any recipes or earned achievements yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default UserProfile;