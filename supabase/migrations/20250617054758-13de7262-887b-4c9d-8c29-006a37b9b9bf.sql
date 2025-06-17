
-- Add additional columns to the profiles table for profile customization
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS profile_image_url TEXT;

-- Create an index on username for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Enable RLS on profiles table if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create RLS policies for profiles table
CREATE POLICY "Users can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = id);
