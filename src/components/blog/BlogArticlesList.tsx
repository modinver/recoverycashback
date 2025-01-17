import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { BookOpen, User, Tag, Calendar } from "lucide-react";
import { format } from "date-fns";

export function BlogArticlesList() {
  const { data: articles, isLoading } = useQuery({
    queryKey: ["blog-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_articles")
        .select(`
          *,
          author:authors(name, avatar_url),
          article_tags(
            tag:tags(*)
          )
        `)
        .eq("is_published", true)
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

  return (
    <div className="space-y-6">
      {articles?.map((article) => (
        <article
          key={article.id}
          className="bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <BookOpen className="w-8 h-8 text-violet-300" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {(article.author as any)?.name || "Anonymous"}
                  </span>
                </div>
                {article.published_at && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <time 
                      dateTime={article.published_at}
                      className="text-sm text-gray-600 dark:text-gray-400"
                    >
                      {format(new Date(article.published_at), "MMMM d, yyyy")}
                    </time>
                  </div>
                )}
              </div>
              <Link
                to={`/${article.slug_url}`}
                className="block group"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3">
                  {article.meta_title}
                </h2>
              </Link>
              <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                {article.meta_description}
              </p>
              <div className="flex flex-wrap gap-2">
                {(article.article_tags as any)?.map(({ tag }: any) => (
                  <div
                    key={tag.id}
                    className="inline-flex items-center space-x-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full"
                  >
                    <Tag className="w-3 h-3" />
                    <span>{tag.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}