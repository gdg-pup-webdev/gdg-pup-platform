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
      article: {
        Row: {
          author_id: string | null
          body: string | null
          created_at: string
          id: string
          is_published: boolean
          published_at: string | null
          related_event_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          body?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          published_at?: string | null
          related_event_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          body?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          published_at?: string | null
          related_event_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_related_event_id_fkey"
            columns: ["related_event_id"]
            isOneToOne: false
            referencedRelation: "event"
            referencedColumns: ["id"]
          },
        ]
      }
      article_comment: {
        Row: {
          article_id: string | null
          body: string
          created_at: string
          id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          article_id?: string | null
          body: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          article_id?: string | null
          body?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "article_comment_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "article"
            referencedColumns: ["id"]
          },
        ]
      }
      event: {
        Row: {
          attendance_points: number
          attendees_count: number
          category: string | null
          created_at: string
          creator_id: string | null
          description: string | null
          end_date: string | null
          id: string
          start_date: string | null
          title: string
          updated_at: string
          venue: string | null
        }
        Insert: {
          attendance_points?: number
          attendees_count?: number
          category?: string | null
          created_at?: string
          creator_id?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          title: string
          updated_at?: string
          venue?: string | null
        }
        Update: {
          attendance_points?: number
          attendees_count?: number
          category?: string | null
          created_at?: string
          creator_id?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          start_date?: string | null
          title?: string
          updated_at?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      event_attendance: {
        Row: {
          checkin_method: string
          created_at: string
          event_id: string
          id: string
          is_present: boolean
          user_id: string
        }
        Insert: {
          checkin_method: string
          created_at?: string
          event_id: string
          id?: string
          is_present?: boolean
          user_id: string
        }
        Update: {
          checkin_method?: string
          created_at?: string
          event_id?: string
          id?: string
          is_present?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attendance_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendance_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      external_resource: {
        Row: {
          created_at: string
          description: string | null
          id: string
          resource_url: string
          title: string
          updated_at: string
          uploader_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          resource_url: string
          title: string
          updated_at?: string
          uploader_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          resource_url?: string
          title?: string
          updated_at?: string
          uploader_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_uploader_id_fkey"
            columns: ["uploader_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_tag: {
        Row: {
          id: string
          tag_name: string
        }
        Insert: {
          id?: string
          tag_name: string
        }
        Update: {
          id?: string
          tag_name?: string
        }
        Relationships: []
      }
      resource_tag_junction: {
        Row: {
          id: string
          resource_id: string
          resource_tag_id: string
        }
        Insert: {
          id?: string
          resource_id: string
          resource_tag_id: string
        }
        Update: {
          id?: string
          resource_id?: string
          resource_tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_tag_junction_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "external_resource"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_tag_junction_resource_tag_id_fkey"
            columns: ["resource_tag_id"]
            isOneToOne: false
            referencedRelation: "resource_tag"
            referencedColumns: ["id"]
          },
        ]
      }
      user: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          email: string
          first_name: string | null
          gdg_id: string
          id: string
          last_name: string | null
          status: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name: string
          email: string
          first_name?: string | null
          gdg_id?: string
          id?: string
          last_name?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          email?: string
          first_name?: string | null
          gdg_id?: string
          id?: string
          last_name?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_profile: {
        Row: {
          bio: string | null
          created_at: string
          github_url: string | null
          id: string
          is_public: boolean
          linkedin_url: string | null
          portfolio_url: string | null
          program: string | null
          skills_summary: string | null
          updated_at: string
          user_id: string
          year_level: number | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          github_url?: string | null
          id?: string
          is_public?: boolean
          linkedin_url?: string | null
          portfolio_url?: string | null
          program?: string | null
          skills_summary?: string | null
          updated_at?: string
          user_id: string
          year_level?: number | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          github_url?: string | null
          id?: string
          is_public?: boolean
          linkedin_url?: string | null
          portfolio_url?: string | null
          program?: string | null
          skills_summary?: string | null
          updated_at?: string
          user_id?: string
          year_level?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profile_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      user_project: {
        Row: {
          created_at: string
          demo_url: string | null
          description: string | null
          id: string
          repo_url: string | null
          tech_stack: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          demo_url?: string | null
          description?: string | null
          id?: string
          repo_url?: string | null
          tech_stack?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          demo_url?: string | null
          description?: string | null
          id?: string
          repo_url?: string | null
          tech_stack?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_project_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      user_role: {
        Row: {
          description: string
          id: string
          role_name: string
        }
        Insert: {
          description: string
          id?: string
          role_name: string
        }
        Update: {
          description?: string
          id?: string
          role_name?: string
        }
        Relationships: []
      }
      user_role_junction: {
        Row: {
          created_at: string
          id: string
          role_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_role_junction_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_role"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_role_junction_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      user_role_permission: {
        Row: {
          can_delete: boolean
          can_read: boolean
          can_update: boolean
          can_write: boolean
          id: string
          resource_name: string
          user_role_id: string
        }
        Insert: {
          can_delete: boolean
          can_read: boolean
          can_update: boolean
          can_write: boolean
          id?: string
          resource_name: string
          user_role_id: string
        }
        Update: {
          can_delete?: boolean
          can_read?: boolean
          can_update?: boolean
          can_write?: boolean
          id?: string
          resource_name?: string
          user_role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_role_permission_user_role_id_fkey"
            columns: ["user_role_id"]
            isOneToOne: false
            referencedRelation: "user_role"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet: {
        Row: {
          balance: number
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
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
          amount?: number
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
            foreignKeyName: "wallet_transaction_wallet_id_fkey"
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
