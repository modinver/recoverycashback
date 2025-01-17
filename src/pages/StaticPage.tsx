import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet";
import ReactMarkdown from 'react-markdown';

export default function StaticPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: page, isLoading } = useQuery({
    queryKey: ["static-page", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("webpages")
        .select("*")
        .eq("slug_url", slug)
        .eq("is_published", true)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="animate-pulse max-w-4xl mx-auto px-4 py-12">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-8"></div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-4">Page not found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{page.meta_title}</title>
        <meta name="description" content={page.meta_description} />
      </Helmet>

      <article className="prose dark:prose-invert max-w-4xl mx-auto px-4 py-12">
        <ReactMarkdown>{page.document_text}</ReactMarkdown>
      </article>
    </>
  );
}
