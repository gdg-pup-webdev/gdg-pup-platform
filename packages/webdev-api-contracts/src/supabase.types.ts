export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      announcement: {
        Row: {
          banner_url: string | null
          content: string
          created_at: string
          creator_id: string
          id: string
          title: string
        }
        Insert: {
          banner_url?: string | null
          content: string
          created_at?: string
          creator_id: string
          id?: string
          title: string
        }
        Update: {
          banner_url?: string | null
          content?: string
          created_at?: string
          creator_id?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcement_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      badge: {
        Row: {
          created_at: string
          creator_id: string
          description: string
          icon_url: string | null
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          description: string
          icon_url?: string | null
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string
          icon_url?: string | null
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "badge_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      badge_user_junction: {
        Row: {
          badge_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "badge_user_junction_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badge"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "badge_user_junction_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      question: {
        Row: {
          answer: number
          category: string | null
          created_at: string
          creator_id: string
          explanation: string | null
          id: string
          option_a: string
          option_b: string
          option_c: string | null
          option_d: string | null
          question: string
          schedule: string
          value: number
        }
        Insert: {
          answer: number
          category?: string | null
          created_at?: string
          creator_id: string
          explanation?: string | null
          id?: string
          option_a: string
          option_b: string
          option_c?: string | null
          option_d?: string | null
          question: string
          schedule: string
          value: number
        }
        Update: {
          answer?: number
          category?: string | null
          created_at?: string
          creator_id?: string
          explanation?: string | null
          id?: string
          option_a?: string
          option_b?: string
          option_c?: string | null
          option_d?: string | null
          question?: string
          schedule?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "question_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      question_answer: {
        Row: {
          answer: number
          created_at: string
          id: string
          is_correct: boolean
          question_id: string
          user_id: string
        }
        Insert: {
          answer: number
          created_at?: string
          id?: string
          is_correct: boolean
          question_id: string
          user_id: string
        }
        Update: {
          answer?: number
          created_at?: string
          id?: string
          is_correct?: boolean
          question_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_answer_creator_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_answer_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "question"
            referencedColumns: ["id"]
          },
        ]
      }
      question_streak: {
        Row: {
          id: string
          streak: number
          user_id: string
        }
        Insert: {
          id?: string
          streak?: number
          user_id: string
        }
        Update: {
          id?: string
          streak?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_streak_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      study_jam: {
        Row: {
          created_at: string
          creator_id: string
          description: string
          id: string
          post_jam_activity_url: string | null
          post_jam_kit_url: string | null
          pre_jam_kit_url: string | null
          title: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          description: string
          id?: string
          post_jam_activity_url?: string | null
          post_jam_kit_url?: string | null
          pre_jam_kit_url?: string | null
          title: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string
          id?: string
          post_jam_activity_url?: string | null
          post_jam_kit_url?: string | null
          pre_jam_kit_url?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_jam_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      token: {
        Row: {
          claimed_at: string | null
          claimed_by_id: string | null
          code: string
          created_at: string
          creator_id: string
          id: string
          is_claimed: boolean
          is_voided: boolean
          template_id: string
        }
        Insert: {
          claimed_at?: string | null
          claimed_by_id?: string | null
          code: string
          created_at?: string
          creator_id: string
          id?: string
          is_claimed?: boolean
          is_voided?: boolean
          template_id: string
        }
        Update: {
          claimed_at?: string | null
          claimed_by_id?: string | null
          code?: string
          created_at?: string
          creator_id?: string
          id?: string
          is_claimed?: boolean
          is_voided?: boolean
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "token_claimed_by_id_fkey"
            columns: ["claimed_by_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "token_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "token_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "token_template"
            referencedColumns: ["id"]
          },
        ]
      }
      token_template: {
        Row: {
          created_at: string
          creator_id: string
          description: string
          id: string
          title: string
          value: number
        }
        Insert: {
          created_at?: string
          creator_id: string
          description: string
          id?: string
          title: string
          value: number
        }
        Update: {
          created_at?: string
          creator_id?: string
          description?: string
          id?: string
          title?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "token_template_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profile: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          email: string
          id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name: string
          email: string
          id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      user_role: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_role_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet: {
        Row: {
          balance: number
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_transaction: {
        Row: {
          amount: number
          created_at: string
          id: string
          source_id: string
          source_type: string
          wallet_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          source_id: string
          source_type: string
          wallet_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          source_id?: string
          source_type?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallet"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      role: "core_team" | "support_team" | "cadet"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      role: ["core_team", "support_team", "cadet"],
    },
  },
} as const
