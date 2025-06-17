
import { supabase } from '@/integrations/supabase/client';

export const createNotification = async (
  userId: string,
  type: string,
  content: string
) => {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type,
        content,
        seen: false
      });

    if (error) {
      console.error('Error creating notification:', error);
    } else {
      // Trigger notification update event
      window.dispatchEvent(new CustomEvent('notificationUpdate'));
    }
  } catch (error) {
    console.error('Error in createNotification:', error);
  }
};

export const createAchievementNotification = async (
  userId: string,
  achievementName: string,
  xpAwarded: number
) => {
  const content = `🏆 Achievement Unlocked: ${achievementName}! You earned ${xpAwarded} XP for this accomplishment.`;
  await createNotification(userId, 'achievement', content);
};

export const createLevelUpNotification = async (
  userId: string,
  newLevel: number,
  xpAwarded: number
) => {
  const content = `🌟 Level Up! You've reached Level ${newLevel}! Bonus: +${xpAwarded} XP`;
  await createNotification(userId, 'level_up', content);
};

export const createRecipeApprovedNotification = async (
  userId: string,
  recipeTitle: string
) => {
  const content = `✅ Your recipe "${recipeTitle}" has been approved and is now live on the platform!`;
  await createNotification(userId, 'recipe_approved', content);
};
