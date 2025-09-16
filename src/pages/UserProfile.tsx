import React from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Award, Trophy, ChefHat, BookOpen, Star } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import RecipeCard from '@/components/recipes/RecipeCard';
import LoadingScreen from '@/components/LoadingScreen';
import NotFound from './NotFound';
import { useUserProfile } from '@/hooks/useUserProfile';
import { getExplicitDisplayName, getExplicitAvatarUrl, getExplicitBadgeIcon } from '@/utils/userHelpers';

// Explicit icon component mapping - no string magic
const getIconComponent = (iconName: string): React.ReactElement => {
  switch (iconName) {
    case 'ChefHat': return <ChefHat className="h-4 w-4" />;
    case 'BookOpen': return <BookOpen className="h-4 w-4" />;
    case 'Star': return <Star className="h-4 w-4" />;
    case 'User': return <User className="h-4 w-4" />;
    default: return <Award className="h-4 w-4" />;
  }
};

// Explicit user profile component with no implicit dependencies
const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  
  const {
    profile,
    achievements,
    recipes,
    isLoading,
    error,
    hasData,
    isEmpty
  } = useUserProfile(userId);

  // Explicit loading state
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Explicit error states
  if (error || !hasData || !profile) {
    return <NotFound />;
  }

  // Explicit name resolution
  const displayName = getExplicitDisplayName(profile);
  const avatarUrl = getExplicitAvatarUrl(profile);

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
            <div className="h-32 bg-gradient-to-r from-chef-royal-green to-chef-green-light" />
            <CardContent className="relative -mt-16 pb-6">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                  <AvatarImage src={avatarUrl} alt={`${displayName}'s profile picture`} />
                  <AvatarFallback className="text-2xl">
                    <User className="h-16 w-16" />
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">{displayName}</h1>
                    {profile.bio && profile.bio.trim() && (
                      <p className="text-muted-foreground mt-2">{profile.bio.trim()}</p>
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
                  {achievements.map((achievement) => {
                    const iconName = getExplicitBadgeIcon(achievement.achievement_name);
                    const iconComponent = getIconComponent(iconName);
                    
                    return (
                      <div
                        key={achievement.id}
                        className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-chef-royal-green/10">
                          {iconComponent}
                        </div>
                        <div>
                          <p className="font-medium">{achievement.achievement_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {achievement.xp_awarded} XP
                          </p>
                        </div>
                      </div>
                    );
                  })}
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
                  {recipes.map((recipe, index) => (
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
                      index={index}
                      onViewRecipe={() => {
                        // Explicit no-op - recipe viewing handled by RecipeCard internally
                      }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Explicit empty state */}
          {isEmpty && (
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