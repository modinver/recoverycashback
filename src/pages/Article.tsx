import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet";
import { format } from "date-fns";
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Tag, Share2, Twitter, Facebook, Linkedin, Link as LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Author {
  name: string;
  avatar_url?: string;
}

interface BlogArticle {
  meta_title: string;
  meta_description: string;
  featured_image?: string;
  published_at: string;
  updated_at: string;
  document_text: string;
  author: Author;
  tags: Array<{ id: string; name: string; }>;
}

const Article: React.FC = () => {
  const { slug } = useParams();

  const { data: article } = useQuery<BlogArticle>({
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
      
      // Transform the data to match our BlogArticle interface
      return {
        ...data,
        tags: data.article_tags?.map((at: any) => at.tag) || []
      } as BlogArticle;
    },
  });

  if (!article) {
    return <div>Loading...</div>;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.meta_title,
    "description": article.meta_description,
    "image": article.featured_image,
    "author": {
      "@type": "Person",
      "name": article.author.name || "Anonymous"
    },
    "publisher": {
      "@type": "Organization",
      "name": "RecoveryCashback.com",
      "logo": {
        "@type": "ImageObject",
        "url": "/logo.svg"
      }
    },
    "datePublished": article.published_at,
    "dateModified": article.updated_at
  };

  const shareUrl = window.location.href;
  const shareTitle = article.meta_title;

  const socialLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      color: 'hover:text-[#1DA1F2]'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'hover:text-[#4267B2]'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`,
      color: 'hover:text-[#0077b5]'
    },
    {
      name: 'Copy Link',
      icon: LinkIcon,
      onClick: () => {
        navigator.clipboard.writeText(shareUrl);
        // Aquí podrías añadir una notificación de "Link copiado"
      },
      color: 'hover:text-purple-600'
    }
  ];

  return (
    <>
      <Helmet>
        <title>{article.meta_title} | RecoveryCashback.com</title>
        <meta name="description" content={article.meta_description} />
        {article.featured_image && (
          <meta property="og:image" content={article.featured_image} />
        )}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <article className="max-w-4xl mx-auto px-4 py-12">
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant="link"
              asChild
              className="p-0 h-auto text-sm text-gray-600 dark:text-gray-400 hover:text-primary"
            >
              <Link to="/" className="inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Home</span>
              </Link>
            </Button>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {article.meta_title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{article.author.name || "Anonymous"}</span>
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

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              <div className="flex items-center gap-2 mr-2">
                <Tag className="w-4 h-4 text-purple-600" />
              </div>
              {article.tags.map((tag: any) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">Share:</span>
            </div>
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => (
                <Button
                  key={link.name}
                  variant="ghost"
                  size="icon"
                  className={`p-2 h-auto ${link.color} transition-colors`}
                  onClick={link.onClick}
                  asChild={!link.onClick}
                >
                  {link.onClick ? (
                    <div>
                      <link.icon className="w-5 h-5" />
                    </div>
                  ) : (
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      <link.icon className="w-5 h-5" />
                    </a>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {article.featured_image && (
            <img
              src={article.featured_image}
              alt={article.meta_title}
              className="w-full h-auto aspect-video object-cover rounded-xl shadow-lg mb-8"
            />
          )}
        </header>

        <div className="prose prose-lg prose-purple max-w-none mb-8">
          <ReactMarkdown>
            {article.document_text}
          </ReactMarkdown>
        </div>

        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Share2 className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">Share this article:</span>
              <div className="flex items-center gap-3">
                {socialLinks.map((link) => (
                  <Button
                    key={link.name}
                    variant="ghost"
                    size="icon"
                    className={`p-2 h-auto ${link.color} transition-colors`}
                    onClick={link.onClick}
                    asChild={!link.onClick}
                  >
                    {link.onClick ? (
                      <div>
                        <link.icon className="w-5 h-5" />
                      </div>
                    ) : (
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        <link.icon className="w-5 h-5" />
                      </a>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </article>
    </>
  );
};

export default Article;