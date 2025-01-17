import { Database } from "./base.types";

export type ArticleTag = Database["public"]["Tables"]["article_tags"]["Row"];
export type Author = Database["public"]["Tables"]["authors"]["Row"];
export type BlogArticle = Database["public"]["Tables"]["blog_articles"]["Row"];
export type Tag = Database["public"]["Tables"]["tags"]["Row"];

// Insert Types
export type ArticleTagInsert = Database["public"]["Tables"]["article_tags"]["Insert"];
export type AuthorInsert = Database["public"]["Tables"]["authors"]["Insert"];
export type BlogArticleInsert = Database["public"]["Tables"]["blog_articles"]["Insert"];
export type TagInsert = Database["public"]["Tables"]["tags"]["Insert"];

// Update Types
export type ArticleTagUpdate = Database["public"]["Tables"]["article_tags"]["Update"];
export type AuthorUpdate = Database["public"]["Tables"]["authors"]["Update"];
export type BlogArticleUpdate = Database["public"]["Tables"]["blog_articles"]["Update"];
export type TagUpdate = Database["public"]["Tables"]["tags"]["Update"];