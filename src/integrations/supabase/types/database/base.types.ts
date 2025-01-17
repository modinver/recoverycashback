export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      article_tags: {
        Row: {
          article_id: string
          tag_id: string
        }
        Insert: {
          article_id: string
          tag_id: string
        }
        Update: {
          article_id?: string
          tag_id?: string
        }
      }
      authors: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          id: string
          linkedin_url: string | null
          name: string
          twitter_url: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          linkedin_url?: string | null
          name: string
          twitter_url?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          linkedin_url?: string | null
          name?: string
          twitter_url?: string | null
          updated_at?: string
          website_url?: string | null
        }
      }
      banks: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
      }
      blog_articles: {
        Row: {
          author: string | null
          created_at: string
          document_text: string
          featured_image: string | null
          id: string
          is_published: boolean | null
          meta_description: string
          meta_title: string
          published_at: string | null
          schema_type: Database["public"]["Enums"]["article_schema_type"] | null
          slug_url: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          created_at?: string
          document_text: string
          featured_image?: string | null
          id?: string
          is_published?: boolean | null
          meta_description: string
          meta_title: string
          published_at?: string | null
          schema_type?: Database["public"]["Enums"]["article_schema_type"] | null
          slug_url: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          created_at?: string
          document_text?: string
          featured_image?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string
          meta_title?: string
          published_at?: string | null
          schema_type?: Database["public"]["Enums"]["article_schema_type"] | null
          slug_url?: string
          updated_at?: string
        }
      }
      card_benefits: {
        Row: {
          benefit_type: Database["public"]["Enums"]["benefit_type"]
          card_id: string | null
          created_at: string
          description: string
          id: string
          updated_at: string
        }
        Insert: {
          benefit_type: Database["public"]["Enums"]["benefit_type"]
          card_id?: string | null
          created_at?: string
          description: string
          id?: string
          updated_at?: string
        }
        Update: {
          benefit_type?: Database["public"]["Enums"]["benefit_type"]
          card_id?: string | null
          created_at?: string
          description?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "card_benefits_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "credit_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      card_requests: {
        Row: {
          card_id: string | null
          created_at: string
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["card_request_status"] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          card_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["card_request_status"] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          card_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["card_request_status"] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "card_requests_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "credit_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cashback_rates: {
        Row: {
          additional_info: string | null
          card_id: string | null
          cinema_rate: number | null
          created_at: string
          dining_rate: number | null
          education_rate: number | null
          fuel_rate: number | null
          government_rate: number | null
          id: string
          insurance_rate: number | null
          international_rate: number | null
          max_cashback: number | null
          min_spend: number | null
          online_rate: number | null
          other_rate: number | null
          real_estate_rate: number | null
          redemption_method: string | null
          rental_rate: number | null
          supermarket_rate: number | null
          telecom_rate: number | null
          travel_rate: number | null
          updated_at: string
          utility_rate: number | null
        }
        Insert: {
          additional_info?: string | null
          card_id?: string | null
          cinema_rate?: number | null
          created_at?: string
          dining_rate?: number | null
          education_rate?: number | null
          fuel_rate?: number | null
          government_rate?: number | null
          id?: string
          insurance_rate?: number | null
          international_rate?: number | null
          max_cashback?: number | null
          min_spend?: number | null
          online_rate?: number | null
          other_rate?: number | null
          real_estate_rate?: number | null
          redemption_method?: string | null
          rental_rate?: number | null
          supermarket_rate?: number | null
          telecom_rate?: number | null
          travel_rate?: number | null
          updated_at?: string
          utility_rate?: number | null
        }
        Update: {
          additional_info?: string | null
          card_id?: string | null
          cinema_rate?: number | null
          created_at?: string
          dining_rate?: number | null
          education_rate?: number | null
          fuel_rate?: number | null
          government_rate?: number | null
          id?: string
          insurance_rate?: number | null
          international_rate?: number | null
          max_cashback?: number | null
          min_spend?: number | null
          online_rate?: number | null
          other_rate?: number | null
          real_estate_rate?: number | null
          redemption_method?: string | null
          rental_rate?: number | null
          supermarket_rate?: number | null
          telecom_rate?: number | null
          travel_rate?: number | null
          updated_at?: string
          utility_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cashback_rates_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "credit_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_cards: {
        Row: {
          annual_fee: string | null
          bank_id: string | null
          card_name: string
          cash_advance_fee: string | null
          cash_apr: number | null
          created_at: string
          foreign_transaction_fee: string | null
          id: string
          image_url: string | null
          is_promotion: boolean | null
          joining_offer: string | null
          late_fee: number | null
          minimum_due: string | null
          minimum_salary: number | null
          monthly_retail_apr: number | null
          offers: string | null
          other_key_benefits: string | null
          overlimit_fee: string | null
          updated_at: string
          webpage_id: string | null
          cashback_card: boolean
        }
        Insert: {
          annual_fee?: string | null
          bank_id?: string | null
          card_name: string
          cash_advance_fee?: string | null
          cash_apr?: number | null
          created_at?: string
          foreign_transaction_fee?: string | null
          id?: string
          image_url?: string | null
          is_promotion?: boolean | null
          joining_offer?: string | null
          late_fee?: number | null
          minimum_due?: string | null
          minimum_salary?: number | null
          monthly_retail_apr?: number | null
          offers?: string | null
          other_key_benefits?: string | null
          overlimit_fee?: string | null
          updated_at?: string
          webpage_id?: string | null
          cashback_card: boolean
        }
        Update: {
          annual_fee?: string | null
          bank_id?: string | null
          card_name?: string
          cash_advance_fee?: string | null
          cash_apr?: number | null
          created_at?: string
          foreign_transaction_fee?: string | null
          id?: string
          image_url?: string | null
          is_promotion?: boolean | null
          joining_offer?: string | null
          late_fee?: number | null
          minimum_due?: string | null
          minimum_salary?: number | null
          monthly_retail_apr?: number | null
          offers?: string | null
          other_key_benefits?: string | null
          overlimit_fee?: string | null
          updated_at?: string
          webpage_id?: string | null
          cashback_card?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "credit_cards_bank_id_fkey"
            columns: ["bank_id"]
            isOneToOne: false
            referencedRelation: "banks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "credit_cards_webpage_id_fkey"
            columns: ["webpage_id"]
            isOneToOne: false
            referencedRelation: "webpages"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          role: Database["public"]["Enums"]["app_role"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          updated_at?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      webpages: {
        Row: {
          id: string
          meta_title: string
          meta_description: string
          document_text: string
          slug_url: string
          is_published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          meta_title: string
          meta_description: string
          document_text: string
          slug_url: string
          is_published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          meta_title?: string
          meta_description?: string
          document_text?: string
          slug_url?: string
          is_published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Enums: {
      app_role: "admin" | "user"
      article_schema_type: "article" | "blogPosting" | "newsArticle" | "review" | "howTo"
      benefit_type: "benefit" | "offer"
      card_request_status: "pending" | "approved" | "rejected"
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
