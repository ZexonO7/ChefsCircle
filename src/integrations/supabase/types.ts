export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_logs: {
        Row: {
          action: string
          admin_id: string
          created_at: string | null
          details: Json | null
          id: string
          target_id: string | null
          target_type: string
        }
        Insert: {
          action: string
          admin_id: string
          created_at?: string | null
          details?: Json | null
          id?: string
          target_id?: string | null
          target_type: string
        }
        Update: {
          action?: string
          admin_id?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          target_id?: string | null
          target_type?: string
        }
        Relationships: []
      }
      club_memberships: {
        Row: {
          club_name: string
          id: string
          joined_at: string | null
          user_id: string
        }
        Insert: {
          club_name: string
          id?: string
          joined_at?: string | null
          user_id: string
        }
        Update: {
          club_name?: string
          id?: string
          joined_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      email_verification_otps: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          otp_code: string
          used: boolean
        }
        Insert: {
          created_at?: string
          email: string
          expires_at: string
          id?: string
          otp_code: string
          used?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          otp_code?: string
          used?: boolean
        }
        Relationships: []
      }
      gamification_actions: {
        Row: {
          action_description: string | null
          action_type: string
          created_at: string | null
          id: string
          user_id: string
          xp_earned: number
        }
        Insert: {
          action_description?: string | null
          action_type: string
          created_at?: string | null
          id?: string
          user_id: string
          xp_earned: number
        }
        Update: {
          action_description?: string | null
          action_type?: string
          created_at?: string | null
          id?: string
          user_id?: string
          xp_earned?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      recipe_analytics: {
        Row: {
          created_at: string
          id: string
          like_count: number
          recipe_id: string
          recipe_type: string
          updated_at: string
          view_count: number
        }
        Insert: {
          created_at?: string
          id?: string
          like_count?: number
          recipe_id: string
          recipe_type: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          created_at?: string
          id?: string
          like_count?: number
          recipe_id?: string
          recipe_type?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_name: string
          achievement_type: string
          earned_at: string | null
          id: string
          user_id: string
          xp_awarded: number | null
        }
        Insert: {
          achievement_name: string
          achievement_type: string
          earned_at?: string | null
          id?: string
          user_id: string
          xp_awarded?: number | null
        }
        Update: {
          achievement_name?: string
          achievement_type?: string
          earned_at?: string | null
          id?: string
          user_id?: string
          xp_awarded?: number | null
        }
        Relationships: []
      }
      user_challenge_progress: {
        Row: {
          challenge_id: string
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          current_progress: number | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          current_progress?: number | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          current_progress?: number | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenge_progress_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "weekly_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_gamification: {
        Row: {
          created_at: string | null
          current_xp: number | null
          id: string
          level: number | null
          total_xp: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_xp?: number | null
          id?: string
          level?: number | null
          total_xp?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_xp?: number | null
          id?: string
          level?: number | null
          total_xp?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_recipes: {
        Row: {
          admin_notes: string | null
          category: string | null
          cook_time: number | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          id: string
          image_url: string | null
          ingredients: string[] | null
          instructions: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          category?: string | null
          cook_time?: number | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          instructions?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          category?: string | null
          cook_time?: number | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          instructions?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      website_analytics: {
        Row: {
          created_at: string | null
          date: string | null
          id: string
          metadata: Json | null
          metric_name: string
          metric_value: number
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          id?: string
          metadata?: Json | null
          metric_name: string
          metric_value: number
        }
        Update: {
          created_at?: string | null
          date?: string | null
          id?: string
          metadata?: Json | null
          metric_name?: string
          metric_value?: number
        }
        Relationships: []
      }
      weekly_challenges: {
        Row: {
          badge_reward: string | null
          challenge_type: string
          created_at: string | null
          description: string
          end_date: string
          id: string
          is_active: boolean | null
          start_date: string
          target_count: number
          title: string
          xp_reward: number
        }
        Insert: {
          badge_reward?: string | null
          challenge_type: string
          created_at?: string | null
          description: string
          end_date: string
          id?: string
          is_active?: boolean | null
          start_date: string
          target_count?: number
          title: string
          xp_reward?: number
        }
        Update: {
          badge_reward?: string | null
          challenge_type?: string
          created_at?: string | null
          description?: string
          end_date?: string
          id?: string
          is_active?: boolean | null
          start_date?: string
          target_count?: number
          title?: string
          xp_reward?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_xp: {
        Args: {
          user_id_param: string
          xp_amount: number
          action_type_param: string
          action_description_param?: string
        }
        Returns: undefined
      }
      calculate_level: {
        Args: { total_xp: number }
        Returns: number
      }
      cleanup_expired_otps: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_recipe_analytics: {
        Args: { p_recipe_id: string; p_recipe_type: string }
        Returns: {
          view_count: number
          like_count: number
        }[]
      }
      increment_recipe_views: {
        Args: { p_recipe_id: string; p_recipe_type: string }
        Returns: number
      }
      log_admin_action: {
        Args: {
          action_text: string
          target_type_text: string
          target_id_param?: string
          details_param?: Json
        }
        Returns: undefined
      }
      track_first_login: {
        Args: { user_id_param: string }
        Returns: undefined
      }
      track_profile_customization: {
        Args: { user_id_param: string }
        Returns: undefined
      }
      update_challenge_progress: {
        Args: { user_id_param: string; challenge_type_param: string }
        Returns: undefined
      }
      xp_for_next_level: {
        Args: { current_level: number }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
