
import { supabase } from '@/integrations/supabase/client';

export const trackProfileCustomization = async (userId: string) => {
  try {
    const { error } = await supabase.rpc('track_profile_customization', {
      user_id_param: userId
    });
    
    if (error) {
      console.error('Error tracking profile customization:', error);
    }
  } catch (error) {
    console.error('Error in trackProfileCustomization:', error);
  }
};
