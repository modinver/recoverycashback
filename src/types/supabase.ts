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
          robots_txt: string
          updated_at: string
        }
        Insert: {
          id?: number
          robots_txt: string
          updated_at?: string
        }
        Update: {
          id?: number
          robots_txt?: string
          updated_at?: string
        }
        Relationships: []
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
      webpages: {
        Row: {
          id: string
          meta_title: string
          slug_url: string
          document_text: string
          meta_description: string
          meta_keywords: string | null
          meta_altimage: string | null
          featured_image: string | null
          youtube_link: string | null
          tiktok_link: string | null
          instagram_link: string | null
          reddit_link: string | null
          is_published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
          author: string | null
          shcema_type: 'article' | 'blogPosting' | 'newsArticle' | 'review' | 'howTo' | null
          type: boolean | null
          doc_type: boolean | null
        }
        Insert: {
          id?: string
          meta_title: string
          slug_url: string
          document_text: string
          meta_description: string
          meta_keywords?: string | null
          meta_altimage?: string | null
          featured_image?: string | null
          youtube_link?: string | null
          tiktok_link?: string | null
          instagram_link?: string | null
          reddit_link?: string | null
          is_published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
          author?: string | null
          shcema_type?: 'article' | 'blogPosting' | 'newsArticle' | 'review' | 'howTo' | null
          type?: boolean | null
          doc_type?: boolean | null
        }
        Update: {
          id?: string
          meta_title?: string
          slug_url?: string
          document_text?: string
          meta_description?: string
          meta_keywords?: string | null
          meta_altimage?: string | null
          featured_image?: string | null
          youtube_link?: string | null
          tiktok_link?: string | null
          instagram_link?: string | null
          reddit_link?: string | null
          is_published?: boolean
          published_at?: string | null
          created_at?: string
          updated_at?: string
          author?: string | null
          shcema_type?: 'article' | 'blogPosting' | 'newsArticle' | 'review' | 'howTo' | null
          type?: boolean | null
          doc_type?: boolean | null
        }
        Relationships: []
      }
      webpages_tags: {
        Row: {
          webpage_id: string
          tag_id: string
        }
        Insert: {
          webpage_id: string
          tag_id: string
        }
        Update: {
          webpage_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webpages_tags_webpage_id_fkey"
            columns: ["webpage_id"]
            referencedRelation: "webpages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webpages_tags_tag_id_fkey"
            columns: ["tag_id"]
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      }
    }
  }
}
