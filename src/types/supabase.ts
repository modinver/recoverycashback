export type Database = {
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
        Relationships: [
          {
            foreignKeyName: "article_tags_article_id_fkey"
            columns: ["article_id"]
            referencedRelation: "blog_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "article_tags_tag_id_fkey"
            columns: ["tag_id"]
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      }
      authors: {
        Row: {
          id: string
          name: string
          avatar_url: string | null
          bio: string | null
          website_url: string | null
          twitter_url: string | null
          linkedin_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          avatar_url?: string | null
          bio?: string | null
          website_url?: string | null
          twitter_url?: string | null
          linkedin_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          avatar_url?: string | null
          bio?: string | null
          website_url?: string | null
          twitter_url?: string | null
          linkedin_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      blog_articles: {
        Row: {
          id: string
          title: string
          slug_url: string
          document_text: string
          meta_title: string
          meta_description: string
          meta_keywords: string | null
          meta_image: string | null
          featured_image: string | null
          published_at: string
          updated_at: string
          schema_type: string
          author_id: string
        }
        Insert: {
          id?: string
          title: string
          slug_url: string
          document_text?: string
          meta_title?: string
          meta_description?: string
          meta_keywords?: string | null
          meta_image?: string | null
          featured_image?: string | null
          published_at?: string
          updated_at?: string
          schema_type?: string
          author_id: string
        }
        Update: {
          id?: string
          title?: string
          slug_url?: string
          document_text?: string
          meta_title?: string
          meta_description?: string
          meta_keywords?: string | null
          meta_image?: string | null
          featured_image?: string | null
          published_at?: string
          updated_at?: string
          schema_type?: string
          author_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_articles_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "authors"
            referencedColumns: ["id"]
          }
        ]
      }
      seo_config: {
        Row: {
          id: number
          robots_txt: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          robots_txt?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          robots_txt?: string | null
          updated_at?: string | null
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
