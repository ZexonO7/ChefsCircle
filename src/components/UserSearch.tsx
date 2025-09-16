import { useState, useEffect } from 'react';
import { Search, User, Award, Trophy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface UserResult {
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

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UserResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchTerm.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase.rpc('search_users', {
          search_term: searchTerm.trim(),
          limit_count: 10
        });

        if (error) throw error;
        setSearchResults(data || []);
      } catch (error) {
        console.error('Error searching users:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const getDisplayName = (user: UserResult) => {
    return user.full_name || user.username || user.email?.split('@')[0] || 'Unknown User';
  };

  const getAvatarUrl = (user: UserResult) => {
    return user.avatar_url || user.profile_image_url || "/lovable-uploads/526dc38a-25fa-40d4-b520-425b23ae0464.png";
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for chefs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {searchTerm.trim().length >= 2 && (
        <Card className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto z-50 shadow-lg">
          <CardContent className="p-2">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">
                Searching...
              </div>
            ) : searchResults.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No users found
              </div>
            ) : (
              <div className="space-y-2">
                {searchResults.map((user) => (
                  <Link
                    key={user.id}
                    to={`/profile/${user.id}`}
                    className="block"
                    onClick={() => setSearchTerm('')}
                  >
                    <div className={cn(
                      "flex items-center gap-3 p-3 rounded-lg transition-colors",
                      "hover:bg-muted cursor-pointer"
                    )}>
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={getAvatarUrl(user)} alt={getDisplayName(user)} />
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate">
                            {getDisplayName(user)}
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
                          {user.bio && (
                            <p className="text-xs text-muted-foreground truncate">
                              {user.bio}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserSearch;