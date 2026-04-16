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
      analytics_nfc_card_scans: {
        Row: {
          date: string
          id: string
          nfcCardId: string | null
          scanContext: string | null
          scannerId: string | null
        }
        Insert: {
          date?: string
          id?: string
          nfcCardId?: string | null
          scanContext?: string | null
          scannerId?: string | null
        }
        Update: {
          date?: string
          id?: string
          nfcCardId?: string | null
          scanContext?: string | null
          scannerId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_nfc_card_scans_nfcCardId_fkey"
            columns: ["nfcCardId"]
            isOneToOne: false
            referencedRelation: "nfc_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_profile_views: {
        Row: {
          date: string
          id: string
          profileGdgId: string | null
          source: string | null
          user_agent: string | null
          viewerGdgId: string | null
        }
        Insert: {
          date?: string
          id?: string
          profileGdgId?: string | null
          source?: string | null
          user_agent?: string | null
          viewerGdgId?: string | null
        }
        Update: {
          date?: string
          id?: string
          profileGdgId?: string | null
          source?: string | null
          user_agent?: string | null
          viewerGdgId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_profile_views_profile_gdg_id_fkey"
            columns: ["profileGdgId"]
            isOneToOne: false
            referencedRelation: "gdg_members"
            referencedColumns: ["gdg_id"]
          },
          {
            foreignKeyName: "analytics_profile_views_viewerGdgId_fkey"
            columns: ["viewerGdgId"]
            isOneToOne: false
            referencedRelation: "gdg_members"
            referencedColumns: ["gdg_id"]
          },
        ]
      }
      article: {
        Row: {
          author_id: string | null
          content: string | null
          created_at: string
          description: string | null
          eventId: string | null
          id: string
          is_published: boolean
          published_at: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          eventId?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string | null
          created_at?: string
          description?: string | null
          eventId?: string | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
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
          rsvp: number | null
          short_description: string | null
          speakers: string[] | null
          start_date: string | null
          tags: string | null
          team_id: string | null
          thumbnail_url: string | null
          title: string
          type: string | null
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
          rsvp?: number | null
          short_description?: string | null
          speakers?: string[] | null
          start_date?: string | null
          tags?: string | null
          team_id?: string | null
          thumbnail_url?: string | null
          title: string
          type?: string | null
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
          rsvp?: number | null
          short_description?: string | null
          speakers?: string[] | null
          start_date?: string | null
          tags?: string | null
          team_id?: string | null
          thumbnail_url?: string | null
          title?: string
          type?: string | null
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
            foreignKeyName: "event_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team"
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
        ]
      }
      event_images: {
        Row: {
          created_at: string
          eventId: string | null
          id: string
          imageUrl: string | null
          position: number | null
          updatedAt: string | null
        }
        Insert: {
          created_at?: string
          eventId?: string | null
          id?: string
          imageUrl?: string | null
          position?: number | null
          updatedAt?: string | null
        }
        Update: {
          created_at?: string
          eventId?: string | null
          id?: string
          imageUrl?: string | null
          position?: number | null
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_images_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "event"
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
          is_deleted: boolean | null
          preview_url: string | null
          preview_url_128: string | null
          preview_url_256: string | null
          preview_url_512: string | null
          preview_url_64: string | null
          storage_ref: string | null
          storage_ref_128: string | null
          storage_ref_256: string | null
          storage_ref_512: string | null
          storage_ref_64: string | null
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
          is_deleted?: boolean | null
          preview_url?: string | null
          preview_url_128?: string | null
          preview_url_256?: string | null
          preview_url_512?: string | null
          preview_url_64?: string | null
          storage_ref?: string | null
          storage_ref_128?: string | null
          storage_ref_256?: string | null
          storage_ref_512?: string | null
          storage_ref_64?: string | null
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
          is_deleted?: boolean | null
          preview_url?: string | null
          preview_url_128?: string | null
          preview_url_256?: string | null
          preview_url_512?: string | null
          preview_url_64?: string | null
          storage_ref?: string | null
          storage_ref_128?: string | null
          storage_ref_256?: string | null
          storage_ref_512?: string | null
          storage_ref_64?: string | null
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
          is_onboarded: boolean | null
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
          section_order: string | null
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
          is_onboarded?: boolean | null
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
          section_order?: string | null
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
          is_onboarded?: boolean | null
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
          section_order?: string | null
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
      learning_resource: {
        Row: {
          created_at: string
          description: string | null
          event_id: string | null
          id: string
          tags: Json | null
          team_id: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_id?: string | null
          id?: string
          tags?: Json | null
          team_id?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_id?: string | null
          id?: string
          tags?: Json | null
          team_id?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_resource_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "event"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_resource_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "team"
            referencedColumns: ["id"]
          },
        ]
      }
      member_project_images: {
        Row: {
          created_at: string
          id: string
          imageUrl: string | null
          memberProjectId: string | null
          position: number | null
          updatedAt: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          imageUrl?: string | null
          memberProjectId?: string | null
          position?: number | null
          updatedAt?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          imageUrl?: string | null
          memberProjectId?: string | null
          position?: number | null
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_project_images_memberProjectId_fkey"
            columns: ["memberProjectId"]
            isOneToOne: false
            referencedRelation: "member_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      member_projects: {
        Row: {
          createdAt: string
          description: string | null
          endDate: string | null
          id: string
          mainImageUrl: string | null
          memberGdgId: string | null
          position: number | null
          secondaryImageUrl: string | null
          startDate: string | null
          tertiaryImageUrl: string | null
          title: string | null
          updatedAt: string | null
        }
        Insert: {
          createdAt?: string
          description?: string | null
          endDate?: string | null
          id?: string
          mainImageUrl?: string | null
          memberGdgId?: string | null
          position?: number | null
          secondaryImageUrl?: string | null
          startDate?: string | null
          tertiaryImageUrl?: string | null
          title?: string | null
          updatedAt?: string | null
        }
        Update: {
          createdAt?: string
          description?: string | null
          endDate?: string | null
          id?: string
          mainImageUrl?: string | null
          memberGdgId?: string | null
          position?: number | null
          secondaryImageUrl?: string | null
          startDate?: string | null
          tertiaryImageUrl?: string | null
          title?: string | null
          updatedAt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_projects_memberGdgId_fkey"
            columns: ["memberGdgId"]
            isOneToOne: false
            referencedRelation: "gdg_members"
            referencedColumns: ["gdg_id"]
          },
        ]
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
      products: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          image: string
          link: string | null
          name: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          image: string
          link?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          image?: string
          link?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
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
        Relationships: []
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
          image_square_url: string | null
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
          image_square_url?: string | null
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
          image_square_url?: string | null
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
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
          is_onboarded: boolean | null
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
          section_order: string | null
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
