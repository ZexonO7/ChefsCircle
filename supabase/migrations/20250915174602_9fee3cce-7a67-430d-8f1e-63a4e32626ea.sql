-- Update is_admin function to handle case-insensitive email comparison
CREATE OR REPLACE FUNCTION public.is_admin(user_id_param uuid DEFAULT auth.uid())
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_email TEXT;
BEGIN
  -- Get user email from auth.users (this requires service role access)
  SELECT email INTO user_email FROM auth.users WHERE id = user_id_param;
  
  -- Check if user is admin using case-insensitive comparison
  RETURN LOWER(user_email) = LOWER('advithya07@gmail.com');
END;
$function$;