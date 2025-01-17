import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet";
import { format } from "date-fns";
import { User, Calendar, Tag, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from 'react-markdown';

export default function Article() {
  const { slug } = useParams<{ slug: string }>();

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", slug],
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
        .eq("slug_url", slug)
        .eq("is_published", true)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleShare = async (platform: 'twitter' | 'facebook' | 'linkedin') => {
    const url = window.location.href;
    const title = article?.meta_title || '';
    
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  if (isLoading) {
    return (
      <div className="animate-pulse max-w-4xl mx-auto px-4 py-12">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Article not found
        </h1>
        <Button asChild>
          <Link to="/" className="inline-flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </Button>
      </div>
    );
  }

  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": article.schema_type || "Article",
    "headline": article.meta_title,
    "description": article.meta_description,
    "image": article.featured_image,
    "author": {
      "@type": "Person",
      "name": (article.author as any)?.name || "Anonymous"
    },
    "datePublished": article.published_at,
    "dateModified": article.updated_at
  };

  return (
    <>
      <Helmet>
        <title>{article.meta_title}</title>
        <meta name="description" content={article.meta_description} />
        <meta property="og:title" content={article.meta_title} />
        <meta property="og:description" content={article.meta_description} />
        {article.featured_image && (
          <meta property="og:image" content={article.featured_image} />
        )}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <article className="max-w-4xl mx-auto px-4 py-12">
        <Button
          variant="ghost"
          asChild
          className="mb-8"
        >
          <Link to="/" className="inline-flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </Button>

        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {article.meta_title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{(article.author as any)?.name || "Anonymous"}</span>
            </div>
            {article.published_at && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={article.published_at}>
                  {format(new Date(article.published_at), "MMMM d, yyyy")}
                </time>
              </div>
            )}
          </div>
          {article.featured_image && (
            <img
              src={article.featured_image}
              alt={article.meta_title}
              className="w-full h-64 object-cover rounded-lg"
            />
          )}
        </header>

        <div className="prose dark:prose-invert prose-slate max-w-none mb-8">
          <ReactMarkdown>{article.document_text}</ReactMarkdown>
        </div>

        <footer className="border-t border-gray-200 dark:border-gray-800 pt-8">
          <div className="flex flex-wrap gap-2 mb-8">
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

          <div className="flex flex-col items-center justify-center space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Share this article
            </h3>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="ghost"
                size="lg"
                className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
                onClick={() => handleShare('twitter')}
              >
                <Share2 className="w-5 h-5" />
                <span className="ml-2">Twitter</span>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="bg-[#4267B2] hover:bg-[#365899] text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
                onClick={() => handleShare('facebook')}
              >
                <Share2 className="w-5 h-5" />
                <span className="ml-2">Facebook</span>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="bg-[#0077B5] hover:bg-[#006399] text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
                onClick={() => handleShare('linkedin')}
              >
                <Share2 className="w-5 h-5" />
                <span className="ml-2">LinkedIn</span>
              </Button>
            </div>
          </div>
        </footer>
      </article>
    </>
  );
}