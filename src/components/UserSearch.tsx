import React from 'react';
import { Search, User, Award, Trophy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useUserSearch } from '@/hooks/useUserSearch';
import { getExplicitDisplayName, getExplicitAvatarUrl } from '@/utils/userHelpers';

// Explicit user search component with no implicit dependencies
const UserSearch: React.FC = () => {
  const {
    searchTerm,
    searchResults,
    isLoading,
    error,
    updateSearchTerm,
    clearSearch,
    hasResults,
    shouldShowResults,
    isEmpty
  } = useUserSearch();

  // Explicit event handlers
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    updateSearchTerm(event.target.value);
  };
  const handleResultClick = (): void => {
    clearSearch();
  };
  return <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input type="text" placeholder="Search members..." value={searchTerm} onChange={handleInputChange} aria-label="Search for member profiles" className="pl-10 pr-4 bg-muted/40 border-border/50 hover:bg-muted/60 focus:bg-background transition-colors" />
      </div>

      {shouldShowResults && <Card className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto z-50 shadow-lg">
          <CardContent className="p-2">
            {isLoading && <div className="p-4 text-center text-muted-foreground">
                Searching...
              </div>}
            
            {error && <div className="p-4 text-center text-destructive">
                {error}
              </div>}
            
            {!isLoading && !error && isEmpty && <div className="p-4 text-center text-muted-foreground">
                No users found
              </div>}
            
            {!isLoading && !error && hasResults && <div className="space-y-2">
                {searchResults.map(user => {
            const displayName = getExplicitDisplayName(user);
            const avatarUrl = getExplicitAvatarUrl(user);
            return <Link key={user.id} to={`/profile/${user.id}`} className="block" onClick={handleResultClick} aria-label={`View ${displayName}'s profile`}>
                      <div className={cn("flex items-center gap-3 p-3 rounded-lg transition-colors", "hover:bg-muted cursor-pointer")}>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={avatarUrl} alt={`${displayName}'s avatar`} />
                          <AvatarFallback>
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm truncate">
                              {displayName}
                            </p>
                            <div className="flex items-center gap-1">
                              <Badge variant="secondary" className="text-xs">
                                <Trophy className="h-3 w-3 mr-1" />
                                Lv.{user.level}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Award className="h-3 w-3" />
                              {user.total_xp} XP
                            </div>
                            {user.bio && user.bio.trim() && <p className="text-xs text-muted-foreground truncate">
                                {user.bio.trim()}
                              </p>}
                          </div>
                        </div>
                      </div>
                    </Link>;
          })}
              </div>}
          </CardContent>
        </Card>}
    </div>;
};
export default UserSearch;