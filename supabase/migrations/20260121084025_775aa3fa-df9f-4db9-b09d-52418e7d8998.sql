
-- Grant admin access to Advithya07@gmail.com
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE email ILIKE 'Advithya07@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;
