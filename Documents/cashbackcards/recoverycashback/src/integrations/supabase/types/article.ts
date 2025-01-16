import { Database } from "./database";

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Article = PublicSchema["Tables"]["blog_articles"]["Row"];
export type ArticleInsert = PublicSchema["Tables"]["blog_articles"]["Insert"];
export type ArticleUpdate = PublicSchema["Tables"]["blog_articles"]["Update"];