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
      dp_download_analytics: {
        Row: {
          created_at: string
          downloaded_at: string
          event_slug: string
          frame_id: string
          id: number
          source_path: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          downloaded_at?: string
          event_slug: string
          frame_id: string
          id?: never
          source_path?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          downloaded_at?: string
          event_slug?: string
          frame_id?: string
          id?: never
          source_path?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      event: {
        Row: {
          attendance_points: number
          attendees_count: number
          bevy_preview_url: string | null
          category: string | null
          created_at: string
          creator_id: string | null
          description: string | null
          end_date: string | null
          gdg_event_id: number | null
          id: string
          max_capacity: string | null
          short_description: string | null
          start_date: string | null
          tags: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          venue: string | null
        }
        Insert: {
          attendance_points?: number
          attendees_count?: number
          bevy_preview_url?: string | null
          category?: string | null
          created_at?: string
          creator_id?: string | null
          description?: string | null
          end_date?: string | null
          gdg_event_id?: number | null
          id?: string
          max_capacity?: string | null
          short_description?: string | null
          start_date?: string | null
          tags?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          venue?: string | null
        }
        Update: {
          attendance_points?: number
          attendees_count?: number
          bevy_preview_url?: string | null
          category?: string | null
          created_at?: string
          creator_id?: string | null
          description?: string | null
          end_date?: string | null
          gdg_event_id?: number | null
          id?: string
          max_capacity?: string | null
          short_description?: string | null
          start_date?: string | null
          tags?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_gdg_event_id_fkey"
            columns: ["gdg_event_id"]
            isOneToOne: true
            referencedRelation: "scraped_gdg_events"
            referencedColumns: ["gdg_id"]
          },
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
      event_highlight: {
        Row: {
          author_id: string
          content: string
          created_at: string
          description: string
          event_id: string
          id: string
          image_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          description: string
          event_id: string
          id?: string
          image_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          description?: string
          event_id?: string
          id?: string
          image_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_highlight_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_highlight_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event"
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
      file_record: {
        Row: {
          created_at: string
          deleted_at: string | null
          file_description: string | null
          file_name: string | null
          file_path: string | null
          file_type: string
          folder_id: string | null
          id: string
          preview_url: string | null
          storage_ref: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          file_description?: string | null
          file_name?: string | null
          file_path?: string | null
          file_type?: string
          folder_id?: string | null
          id?: string
          preview_url?: string | null
          storage_ref?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          file_description?: string | null
          file_name?: string | null
          file_path?: string | null
          file_type?: string
          folder_id?: string | null
          id?: string
          preview_url?: string | null
          storage_ref?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "file_record_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "filesystem_folder"
            referencedColumns: ["id"]
          },
        ]
      }
      filesystem_folder: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          parent_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "filesystem_folder_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "filesystem_folder"
            referencedColumns: ["id"]
          },
        ]
      }
      gdg_members: {
        Row: {
          avatar_image_url: string | null
          bio: string | null
          created_at: string | null
          department: string | null
          display_name: string | null
          email: string
          first_name: string | null
          gdg_id: string
          github_url: string | null
          is_public: boolean | null
          last_name: string | null
          learning_interests: string | null
          linkedin_url: string | null
          membership_type: string | null
          middle_name: string | null
          nickname: string | null
          other_links: string | null
          portfolio_url: string | null
          program: string | null
          skills_summary: string | null
          suffix: string | null
          technical_skills: string | null
          tools_and_technologies: string | null
          updated_at: string | null
          year_level: number | null
        }
        Insert: {
          avatar_image_url?: string | null
          bio?: string | null
          created_at?: string | null
          department?: string | null
          display_name?: string | null
          email: string
          first_name?: string | null
          gdg_id: string
          github_url?: string | null
          is_public?: boolean | null
          last_name?: string | null
          learning_interests?: string | null
          linkedin_url?: string | null
          membership_type?: string | null
          middle_name?: string | null
          nickname?: string | null
          other_links?: string | null
          portfolio_url?: string | null
          program?: string | null
          skills_summary?: string | null
          suffix?: string | null
          technical_skills?: string | null
          tools_and_technologies?: string | null
          updated_at?: string | null
          year_level?: number | null
        }
        Update: {
          avatar_image_url?: string | null
          bio?: string | null
          created_at?: string | null
          department?: string | null
          display_name?: string | null
          email?: string
          first_name?: string | null
          gdg_id?: string
          github_url?: string | null
          is_public?: boolean | null
          last_name?: string | null
          learning_interests?: string | null
          linkedin_url?: string | null
          membership_type?: string | null
          middle_name?: string | null
          nickname?: string | null
          other_links?: string | null
          portfolio_url?: string | null
          program?: string | null
          skills_summary?: string | null
          suffix?: string | null
          technical_skills?: string | null
          tools_and_technologies?: string | null
          updated_at?: string | null
          year_level?: number | null
        }
        Relationships: []
      }
      gdg_merch: {
        Row: {
          created_at: string | null
          id: string
          image_url: string | null
          name: string | null
          points_cost: number | null
          stock: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          name?: string | null
          points_cost?: number | null
          stock?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string | null
          name?: string | null
          points_cost?: number | null
          stock?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      member_showcase: {
        Row: {
          article_url: string
          created_at: string
          date: string
          description: string
          id: string
          showcased_members: string[]
          thumbnail_url: string
          title: string
        }
        Insert: {
          article_url: string
          created_at?: string
          date: string
          description: string
          id: string
          showcased_members?: string[]
          thumbnail_url: string
          title: string
        }
        Update: {
          article_url?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          showcased_members?: string[]
          thumbnail_url?: string
          title?: string
        }
        Relationships: []
      }
      nfc_cards: {
        Row: {
          activated_at: string | null
          created_at: string
          destination_url: string | null
          gdg_id: string
          id: string
          notes: string | null
          revoked_at: string | null
          status: Database["public"]["Enums"]["nfc_card_status"]
          suspended_at: string | null
          updated_at: string
        }
        Insert: {
          activated_at?: string | null
          created_at?: string
          destination_url?: string | null
          gdg_id: string
          id?: string
          notes?: string | null
          revoked_at?: string | null
          status?: Database["public"]["Enums"]["nfc_card_status"]
          suspended_at?: string | null
          updated_at?: string
        }
        Update: {
          activated_at?: string | null
          created_at?: string
          destination_url?: string | null
          gdg_id?: string
          id?: string
          notes?: string | null
          revoked_at?: string | null
          status?: Database["public"]["Enums"]["nfc_card_status"]
          suspended_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nfc_cards_gdg_id_fkey"
            columns: ["gdg_id"]
            isOneToOne: true
            referencedRelation: "gdg_members"
            referencedColumns: ["gdg_id"]
          },
        ]
      }
      one_time_pins: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          is_used: boolean
          otp_code: string
          reference: string
        }
        Insert: {
          created_at?: string
          email: string
          expires_at: string
          id?: string
          is_used: boolean
          otp_code: string
          reference: string
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          is_used?: boolean
          otp_code?: string
          reference?: string
        }
        Relationships: []
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
      reward: {
        Row: {
          created_at: string
          description: string
          id: string
          is_claimed: boolean
          title: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          is_claimed?: boolean
          title: string
          user_id: string
          value: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_claimed?: boolean
          title?: string
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "reward_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      scraped_gdg_events: {
        Row: {
          attendee_virtual_venue_link: string | null
          cover_image_url: string | null
          created_at: string | null
          description: string | null
          description_short: string | null
          end_date: string
          event_type: string | null
          event_type_slug: string | null
          gdg_id: number
          is_virtual_event: boolean | null
          last_scraped_at: string | null
          location: string | null
          start_date: string
          status: string | null
          tags: string[] | null
          title: string
          total_attendees: number | null
          total_capacity: number | null
          updated_at: string | null
          url: string
          video_url: string | null
        }
        Insert: {
          attendee_virtual_venue_link?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          description_short?: string | null
          end_date: string
          event_type?: string | null
          event_type_slug?: string | null
          gdg_id: number
          is_virtual_event?: boolean | null
          last_scraped_at?: string | null
          location?: string | null
          start_date: string
          status?: string | null
          tags?: string[] | null
          title: string
          total_attendees?: number | null
          total_capacity?: number | null
          updated_at?: string | null
          url: string
          video_url?: string | null
        }
        Update: {
          attendee_virtual_venue_link?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          description?: string | null
          description_short?: string | null
          end_date?: string
          event_type?: string | null
          event_type_slug?: string | null
          gdg_id?: number
          is_virtual_event?: boolean | null
          last_scraped_at?: string | null
          location?: string | null
          start_date?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          total_attendees?: number | null
          total_capacity?: number | null
          updated_at?: string | null
          url?: string
          video_url?: string | null
        }
        Relationships: []
      }
      sparkmates_metric_events: {
        Row: {
          created_at: string
          gdg_id: string
          id: string
          source: Database["public"]["Enums"]["sparkmates_source"]
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          gdg_id: string
          id?: string
          source?: Database["public"]["Enums"]["sparkmates_source"]
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          gdg_id?: string
          id?: string
          source?: Database["public"]["Enums"]["sparkmates_source"]
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sparkmates_metric_events_gdg_id_fkey"
            columns: ["gdg_id"]
            isOneToOne: false
            referencedRelation: "gdg_members"
            referencedColumns: ["gdg_id"]
          },
        ]
      }
      study_jam: {
        Row: {
          created_at: string
          creator_id: string | null
          description: string
          id: string
          recording_url: string | null
          summary: string
          title: string
        }
        Insert: {
          created_at?: string
          creator_id?: string | null
          description: string
          id?: string
          recording_url?: string | null
          summary: string
          title: string
        }
        Update: {
          created_at?: string
          creator_id?: string | null
          description?: string
          id?: string
          recording_url?: string | null
          summary?: string
          title?: string
        }
        Relationships: []
      }
      survey: {
        Row: {
          attendance_code: string | null
          close_time: string | null
          created_at: string
          event_id: string
          id: string
          is_active: boolean
          questions_schema: Json | null
          slug: string
          updated_at: string
        }
        Insert: {
          attendance_code?: string | null
          close_time?: string | null
          created_at?: string
          event_id: string
          id?: string
          is_active?: boolean
          questions_schema?: Json | null
          slug: string
          updated_at?: string
        }
        Update: {
          attendance_code?: string | null
          close_time?: string | null
          created_at?: string
          event_id?: string
          id?: string
          is_active?: boolean
          questions_schema?: Json | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_response: {
        Row: {
          certificate_url: string | null
          created_at: string
          email: string
          event_id: string
          gdg_id: string | null
          id: string
          survey_data: Json
          survey_id: string
        }
        Insert: {
          certificate_url?: string | null
          created_at?: string
          email: string
          event_id: string
          gdg_id?: string | null
          id?: string
          survey_data: Json
          survey_id: string
        }
        Update: {
          certificate_url?: string | null
          created_at?: string
          email?: string
          event_id?: string
          gdg_id?: string | null
          id?: string
          survey_data?: Json
          survey_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_response_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "survey_response_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "survey"
            referencedColumns: ["id"]
          },
        ]
      }
      task: {
        Row: {
          completed_at: string | null
          created_at: string | null
          description: string | null
          id: string
          is_completed: boolean | null
          name: string | null
          points_on_completion: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_completed?: boolean | null
          name?: string | null
          points_on_completion?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_completed?: boolean | null
          name?: string | null
          points_on_completion?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      team: {
        Row: {
          description: string
          id: string
          name: string
          parent_team_id: string | null
          responsibilities: string | null
        }
        Insert: {
          description: string
          id?: string
          name: string
          parent_team_id?: string | null
          responsibilities?: string | null
        }
        Update: {
          description?: string
          id?: string
          name?: string
          parent_team_id?: string | null
          responsibilities?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_parent_team_id_fkey"
            columns: ["parent_team_id"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["id"]
          },
        ]
      }
      team_member: {
        Row: {
          id: string
          role: string
          team_id: string
          user_id: string
        }
        Insert: {
          id?: string
          role: string
          team_id: string
          user_id: string
        }
        Update: {
          id?: string
          role?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_member_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_member_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      team_resource: {
        Row: {
          created_at: string
          description: string | null
          id: string
          resource_link: string
          resource_type: string
          team_name: string
          thumbnail_public_url: string
          thumbnail_storage_reference: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          resource_link: string
          resource_type: string
          team_name: string
          thumbnail_public_url: string
          thumbnail_storage_reference: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          resource_link?: string
          resource_type?: string
          team_name?: string
          thumbnail_public_url?: string
          thumbnail_storage_reference?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      test: {
        Row: {
          description: string | null
          id: string
          title: string
        }
        Insert: {
          description?: string | null
          id?: string
          title: string
        }
        Update: {
          description?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      user: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          email: string
          first_name: string | null
          gdg_id: string | null
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
          gdg_id?: string | null
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
          gdg_id?: string | null
          id?: string
          last_name?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_gdg_id_fkey"
            columns: ["gdg_id"]
            isOneToOne: false
            referencedRelation: "gdg_members"
            referencedColumns: ["gdg_id"]
          },
        ]
      }
      user_achievement: {
        Row: {
          achieved_at: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          achieved_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          achieved_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievement_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      user_certificate: {
        Row: {
          description: string
          id: string
          image_url: string | null
          title: string
          user_id: string
        }
        Insert: {
          description: string
          id?: string
          image_url?: string | null
          title: string
          user_id: string
        }
        Update: {
          description?: string
          id?: string
          image_url?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_certificate_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      user_credential: {
        Row: {
          created_at: string
          email_address: string
          id: string
          password_hash: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          email_address: string
          id?: string
          password_hash: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          email_address?: string
          id?: string
          password_hash?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      user_credential_reference_code: {
        Row: {
          created_at: string | null
          email_address: string | null
          id: string
          otp_reference: string | null
          payload: Json | null
          reference_code: string
          type: string | null
        }
        Insert: {
          created_at?: string | null
          email_address?: string | null
          id?: string
          otp_reference?: string | null
          payload?: Json | null
          reference_code: string
          type?: string | null
        }
        Update: {
          created_at?: string | null
          email_address?: string | null
          id?: string
          otp_reference?: string | null
          payload?: Json | null
          reference_code?: string
          type?: string | null
        }
        Relationships: []
      }
      user_portfolio: {
        Row: {
          avatar_image_url: string | null
          bio: string | null
          created_at: string
          department: string | null
          first_name: string | null
          gdg_id: string | null
          github_url: string | null
          id: string
          is_public: boolean
          last_name: string | null
          learning_interests: string[] | null
          linkedin_url: string | null
          membership_type: string | null
          middle_name: string | null
          nickname: string | null
          other_links: string[] | null
          portfolio_url: string | null
          program: string | null
          skills_summary: string | null
          technical_skills: string[] | null
          tools_and_technologies: string[] | null
          updated_at: string
          user_id: string
          year_level: number | null
        }
        Insert: {
          avatar_image_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          first_name?: string | null
          gdg_id?: string | null
          github_url?: string | null
          id?: string
          is_public?: boolean
          last_name?: string | null
          learning_interests?: string[] | null
          linkedin_url?: string | null
          membership_type?: string | null
          middle_name?: string | null
          nickname?: string | null
          other_links?: string[] | null
          portfolio_url?: string | null
          program?: string | null
          skills_summary?: string | null
          technical_skills?: string[] | null
          tools_and_technologies?: string[] | null
          updated_at?: string
          user_id: string
          year_level?: number | null
        }
        Update: {
          avatar_image_url?: string | null
          bio?: string | null
          created_at?: string
          department?: string | null
          first_name?: string | null
          gdg_id?: string | null
          github_url?: string | null
          id?: string
          is_public?: boolean
          last_name?: string | null
          learning_interests?: string[] | null
          linkedin_url?: string | null
          membership_type?: string | null
          middle_name?: string | null
          nickname?: string | null
          other_links?: string[] | null
          portfolio_url?: string | null
          program?: string | null
          skills_summary?: string | null
          technical_skills?: string[] | null
          tools_and_technologies?: string[] | null
          updated_at?: string
          user_id?: string
          year_level?: number | null
        }
        Relationships: []
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
          name: string
        }
        Insert: {
          description: string
          id?: string
          name: string
        }
        Update: {
          description?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_role_junction: {
        Row: {
          gdg_id: string
          role_id: string
        }
        Insert: {
          gdg_id: string
          role_id: string
        }
        Update: {
          gdg_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_role_junction_gdg_id_fkey"
            columns: ["gdg_id"]
            isOneToOne: false
            referencedRelation: "gdg_members"
            referencedColumns: ["gdg_id"]
          },
          {
            foreignKeyName: "user_role_junction_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_role"
            referencedColumns: ["id"]
          },
        ]
      }
      user_role_permission: {
        Row: {
          action: string
          resource: string
          role_id: string
        }
        Insert: {
          action: string
          resource: string
          role_id: string
        }
        Update: {
          action?: string
          resource?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_role_permission_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_role"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          color_theme: boolean
          id: string
          user_id: string
        }
        Insert: {
          color_theme: boolean
          id?: string
          user_id: string
        }
        Update: {
          color_theme?: boolean
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet: {
        Row: {
          balance: number
          created_at: string
          id: string
          spark_points: number
          updated_at: string
          user_id: string
          webdev_points: number | null
        }
        Insert: {
          balance: number
          created_at?: string
          id?: string
          spark_points?: number
          updated_at?: string
          user_id: string
          webdev_points?: number | null
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          spark_points?: number
          updated_at?: string
          user_id?: string
          webdev_points?: number | null
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
          point_type: string | null
          source_id: string
          source_type: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          point_type?: string | null
          source_id: string
          source_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          point_type?: string | null
          source_id?: string
          source_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transaction_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      flat_survey_data: {
        Row: {
          college: string | null
          comments_for_speakers: string | null
          created_at: string | null
          id: string | null
          is_pupian: boolean | null
          missing_content: string | null
          name: string | null
          organization: string | null
          overall_satisfaction: number | null
          program: string | null
          questions_for_speakers: string | null
          rating_duration: number | null
          rating_program_flow: number | null
          rating_schedule: number | null
          rating_speakers: number | null
          rating_subject: number | null
          suggestions: string | null
          valuable_aspects: string | null
          year_level: string | null
        }
        Insert: {
          college?: never
          comments_for_speakers?: never
          created_at?: string | null
          id?: string | null
          is_pupian?: never
          missing_content?: never
          name?: never
          organization?: never
          overall_satisfaction?: never
          program?: never
          questions_for_speakers?: never
          rating_duration?: never
          rating_program_flow?: never
          rating_schedule?: never
          rating_speakers?: never
          rating_subject?: never
          suggestions?: never
          valuable_aspects?: never
          year_level?: never
        }
        Update: {
          college?: never
          comments_for_speakers?: never
          created_at?: string | null
          id?: string | null
          is_pupian?: never
          missing_content?: never
          name?: never
          organization?: never
          overall_satisfaction?: never
          program?: never
          questions_for_speakers?: never
          rating_duration?: never
          rating_program_flow?: never
          rating_schedule?: never
          rating_speakers?: never
          rating_subject?: never
          suggestions?: never
          valuable_aspects?: never
          year_level?: never
        }
        Relationships: []
      }
      sparkmates_scan_counts: {
        Row: {
          gdg_id: string | null
          scan_count: number | null
          source: Database["public"]["Enums"]["sparkmates_source"] | null
        }
        Relationships: [
          {
            foreignKeyName: "sparkmates_metric_events_gdg_id_fkey"
            columns: ["gdg_id"]
            isOneToOne: false
            referencedRelation: "gdg_members"
            referencedColumns: ["gdg_id"]
          },
        ]
      }
    }
    Functions: {
      get_sparkmates_analytics: {
        Args: { p_gdg_id: string }
        Returns: {
          scan_count: number
          source: Database["public"]["Enums"]["sparkmates_source"]
        }[]
      }
      verify_member: {
        Args: { search_term: string }
        Returns: {
          avatar_image_url: string | null
          bio: string | null
          created_at: string | null
          department: string | null
          display_name: string | null
          email: string
          first_name: string | null
          gdg_id: string
          github_url: string | null
          is_public: boolean | null
          last_name: string | null
          learning_interests: string | null
          linkedin_url: string | null
          membership_type: string | null
          middle_name: string | null
          nickname: string | null
          other_links: string | null
          portfolio_url: string | null
          program: string | null
          skills_summary: string | null
          suffix: string | null
          technical_skills: string | null
          tools_and_technologies: string | null
          updated_at: string | null
          year_level: number | null
        }[]
        SetofOptions: {
          from: "*"
          to: "gdg_members"
          isOneToOne: false
          isSetofReturn: true
        }
      }
    }
    Enums: {
      nfc_card_status: "issued" | "activated" | "suspended" | "revoked"
      sparkmates_source: "nfc_card" | "qr_code" | "direct_link"
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
      nfc_card_status: ["issued", "activated", "suspended", "revoked"],
      sparkmates_source: ["nfc_card", "qr_code", "direct_link"],
    },
  },
} as const
