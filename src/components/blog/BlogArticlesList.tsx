import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { BookOpen, User, Tag, Calendar } from "lucide-react";

export function BlogArticlesList() {
  const { data: articles, isLoading } = useQuery({
    queryKey: ["blog-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("webpages")
        .select(`
          *,
          author:authors(name, avatar_url),
          article_tags(
            tag:tags(*)
          )
        `)
        .eq("is_published", true)
        .eq("schema_type", "article")
        .order("published_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!articles?.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {articles.map((article) => (
        <Link
          key={article.id}
          to={`/${article.slug_url}`}
          className="group relative bg-card hover:bg-accent rounded-lg overflow-hidden transition-colors"
        >
          {article.meta_altimage && (
            <img
              src={article.meta_altimage}
              alt={article.meta_title}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
              {article.meta_title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {article.meta_description}
            </p>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <time dateTime={article.published_at}>
                {format(new Date(article.published_at), "MMMM d, yyyy")}
              </time>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}