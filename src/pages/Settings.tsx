import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { trackProfileCustomization } from '@/utils/profileHelpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Lock, Camera, Save } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
const Settings = () => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const [profile, setProfile] = useState({
    full_name: '',
    username: '',
    bio: '',
    profile_image_url: '',
    email: ''
  });
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);
  const fetchProfile = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      if (data) {
        setProfile({
          full_name: data.full_name || '',
          username: data.username || '',
          bio: data.bio || '',
          profile_image_url: data.profile_image_url || '',
          email: user.email || ''
        });
      } else {
        // Create profile if it doesn't exist
        const {
          error: insertError
        } = await supabase.from('profiles').insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || ''
        });
        if (insertError) {
          console.error('Error creating profile:', insertError);
        }
        setProfile({
          full_name: user.user_metadata?.full_name || '',
          username: '',
          bio: '',
          profile_image_url: '',
          email: user.email || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error loading profile",
        description: "There was an error loading your profile data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleProfileUpdate = async () => {
    if (!user) return;
    if (profile.username && profile.username.length < 3) {
      toast({
        title: "Invalid username",
        description: "Username must be at least 3 characters long.",
        variant: "destructive"
      });
      return;
    }
    setIsSaving(true);
    try {
      // Update auth metadata for full_name
      const {
        error: authError
      } = await supabase.auth.updateUser({
        data: {
          full_name: profile.full_name
        }
      });
      if (authError) throw authError;

      // Update profiles table
      const {
        error: profileError
      } = await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email,
        full_name: profile.full_name,
        username: profile.username || null,
        bio: profile.bio || null,
        profile_image_url: profile.profile_image_url || null,
        updated_at: new Date().toISOString()
      });
      if (profileError) throw profileError;

      // Track profile customization for gamification
      await trackProfileCustomization(user.id);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });
    } catch (error: any) {
      console.error('Profile update error:', error);
      let errorMessage = "There was an error updating your profile.";
      if (error.code === '23505' && error.message.includes('username')) {
        errorMessage = "This username is already taken. Please choose a different one.";
      }
      toast({
        title: "Error updating profile",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  const handlePasswordChange = async () => {
    if (!passwords.newPassword || !passwords.confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive"
      });
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive"
      });
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }
    setIsSaving(true);
    try {
      const {
        error
      } = await supabase.auth.updateUser({
        password: passwords.newPassword
      });
      if (error) throw error;
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully."
      });
      setPasswords({
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Password update error:', error);
      toast({
        title: "Error updating password",
        description: "There was an error updating your password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  const getInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2);
  };
  if (!user) {
    return <PageLayout>
        <div className="min-h-screen bg-chef-cream flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-chef-charcoal mb-4">Access Denied</h1>
            <p className="text-chef-charcoal/70">You need to be signed in to access settings.</p>
          </div>
        </div>
      </PageLayout>;
  }
  if (isLoading) {
    return <PageLayout>
        <div className="min-h-screen bg-chef-cream flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-chef-royal-blue mx-auto mb-4"></div>
            <p className="text-chef-charcoal">Loading settings...</p>
          </div>
        </div>
      </PageLayout>;
  }
  return <PageLayout>
      <div className="min-h-screen bg-chef-cream pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-chef-charcoal font-playfair">Account Settings</h1>
            <p className="text-chef-charcoal/70 mt-2">Manage your profile and account preferences</p>
          </div>

          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
            {/* Profile Picture Section */}
            <Card className="lg:col-span-1 bg-chef-cream border-chef-royal-blue/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-chef-charcoal">
                  <Camera className="w-5 h-5 text-chef-royal-blue" />
                  Profile Picture
                </CardTitle>
                <CardDescription className="text-chef-charcoal/60">
                  Your profile picture will be visible to other users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={profile.profile_image_url} alt={profile.full_name || profile.username || 'Profile'} />
                    <AvatarFallback className="bg-chef-royal-blue text-chef-warm-ivory text-lg">
                      {profile.full_name ? getInitials(profile.full_name) : profile.username ? profile.username.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div>
                  <Label htmlFor="profileImage" className="text-chef-charcoal font-medium">Profile Image URL</Label>
                  <Input id="profileImage" value={profile.profile_image_url} onChange={e => setProfile({
                  ...profile,
                  profile_image_url: e.target.value
                })} placeholder="https://example.com/image.jpg" className="mt-1 bg-chef-cream border-chef-royal-blue/30 text-chef-charcoal placeholder:text-chef-charcoal/50 focus:border-chef-royal-blue" />
                  <p className="text-xs text-chef-charcoal/50 mt-1">
                    Enter a URL to an image you'd like to use as your profile picture
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Profile Information */}
            <Card className="lg:col-span-2 bg-chef-cream border-chef-royal-blue/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-chef-charcoal">
                  <User className="w-5 h-5 text-chef-royal-blue" />
                  Profile Information
                </CardTitle>
                <CardDescription className="text-chef-charcoal/60">
                  Update your personal information and bio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="email" className="text-chef-charcoal font-medium">Email Address</Label>
                    <Input id="email" value={profile.email} disabled className="mt-1 bg-chef-charcoal/5 border-chef-royal-blue/20 text-chef-charcoal/60" />
                    <p className="text-xs text-chef-charcoal/50 mt-1">Email cannot be changed</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="username" className="text-chef-charcoal font-medium">Username</Label>
                    <Input id="username" value={profile.username} onChange={e => setProfile({
                    ...profile,
                    username: e.target.value
                  })} placeholder="Enter a unique username" className="mt-1 bg-chef-cream border-chef-royal-blue/30 text-chef-charcoal placeholder:text-chef-charcoal/50 focus:border-chef-royal-blue" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="fullName" className="text-chef-charcoal font-medium">Full Name</Label>
                  <Input id="fullName" value={profile.full_name} onChange={e => setProfile({
                  ...profile,
                  full_name: e.target.value
                })} placeholder="Enter your full name" className="mt-1 bg-chef-cream border-chef-royal-blue/30 text-chef-charcoal placeholder:text-chef-charcoal/50 focus:border-chef-royal-blue" />
                </div>
                
                <div>
                  <Label htmlFor="bio" className="text-chef-charcoal font-medium">Bio</Label>
                  <Textarea id="bio" value={profile.bio} onChange={e => setProfile({
                  ...profile,
                  bio: e.target.value
                })} placeholder="Tell others about yourself..." className="min-h-[100px] mt-1 bg-chef-cream border-chef-royal-blue/30 text-chef-charcoal placeholder:text-chef-charcoal/50 focus:border-chef-royal-blue" />
                  <p className="text-xs text-chef-charcoal/50 mt-1">
                    {profile.bio.length}/500 characters
                  </p>
                </div>
                
                <Button onClick={handleProfileUpdate} disabled={isSaving} className="w-full bg-chef-royal-green hover:bg-chef-green-light text-chef-warm-ivory">
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Profile Changes'}
                </Button>
              </CardContent>
            </Card>

            {/* Password Section */}
            <Card className="lg:col-span-3 bg-chef-cream border-chef-royal-blue/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-chef-charcoal">
                  <Lock className="w-5 h-5 text-chef-royal-blue" />
                  Change Password
                </CardTitle>
                <CardDescription className="text-chef-charcoal/60">
                  Update your account password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 max-w-2xl">
                  <div>
                    <Label htmlFor="newPassword" className="text-chef-charcoal font-medium">New Password</Label>
                    <Input id="newPassword" type="password" value={passwords.newPassword} onChange={e => setPasswords({
                    ...passwords,
                    newPassword: e.target.value
                  })} placeholder="Enter new password" className="mt-1 bg-chef-cream border-chef-royal-blue/30 text-chef-charcoal placeholder:text-chef-charcoal/50 focus:border-chef-royal-blue" />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirmPassword" className="text-chef-charcoal font-medium">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" value={passwords.confirmPassword} onChange={e => setPasswords({
                    ...passwords,
                    confirmPassword: e.target.value
                  })} placeholder="Confirm new password" className="mt-1 bg-chef-cream border-chef-royal-blue/30 text-chef-charcoal placeholder:text-chef-charcoal/50 focus:border-chef-royal-blue" />
                  </div>
                </div>
                
                <Button onClick={handlePasswordChange} disabled={isSaving} variant="outline" className="w-full max-w-xs border-chef-royal-blue text-chef-royal-blue hover:bg-chef-royal-blue hover:text-chef-warm-ivory text-[chef-royal-blue] text-slate-50 bg-chef-navy bg-[chef-royal-blue]">
                  <Lock className="w-4 h-4 mr-2" />
                  {isSaving ? 'Updating...' : 'Update Password'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>;
};
export default Settings;