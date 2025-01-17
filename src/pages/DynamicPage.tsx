import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet";
import { format } from "date-fns";
import { User, Calendar, ArrowLeft, Twitter, Facebook, Linkedin, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import ReactMarkdown from 'react-markdown';
import { NavMenu } from "@/components/navigation/NavMenu";

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  console.log("DynamicPage - Current slug:", slug);

  // Query for article
  const { data: article, isLoading: isLoadingArticle, error: articleError } = useQuery({
    queryKey: ["article", slug],
    queryFn: async () => {
      console.log("Searching for article with slug:", slug);
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

      if (error) {
        console.log("Article search error:", error);
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      console.log("Found article:", data);
      return data;
    },
  });

  // Query for static page - run in parallel with article query
  const { data: page, isLoading: isLoadingPage, error: pageError } = useQuery({
    queryKey: ["static-page", slug],
    queryFn: async () => {
      console.log("Searching for static page with slug:", slug);
      try {
        const { data, error } = await supabase
          .from("webpages")
          .select(`
            *,
            created_at,
            updated_at,
            is_published,
            meta_title,
            meta_description,
            document_text,
            slug_url
          `)
          .eq("slug_url", slug)
          .eq("is_published", true)
          .single();

        if (error) {
          console.log("Page search error:", error);
          if (error.code === 'PGRST116') {
            console.log("No page found with slug:", slug);
            return null;
          }
          console.error("Unexpected error fetching page:", error);
          throw error;
        }

        if (!data) {
          console.log("No page data returned for slug:", slug);
          return null;
        }

        console.log("Found page data:", data);
        return data;
      } catch (error) {
        console.error("Error in page query:", error);
        throw error;
      }
    },
    retry: 1, // Solo intentar una vez más en caso de error
    staleTime: 1000 * 60 * 5, // Considerar los datos frescos por 5 minutos
  });

  // Log all states for debugging
  console.log("Component state:", {
    slug,
    isLoadingArticle,
    isLoadingPage,
    hasArticle: !!article,
    hasPage: !!page,
    articleError,
    pageError,
    pageData: page,
  });

  if (isLoadingArticle || isLoadingPage) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavMenu />
        <main className="flex-grow bg-background">
          <div className="animate-pulse max-w-4xl mx-auto px-4 py-12">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-8"></div>
          </div>
        </main>
      </div>
    );
  }

  if (articleError || pageError) {
    console.error("Errors:", { articleError, pageError });
    return (
      <div className="min-h-screen flex flex-col">
        <NavMenu />
        <main className="flex-grow bg-background">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">Error loading content</h1>
            <p className="text-muted-foreground mb-8">There was an error loading the content. Please try again later.</p>
            <Button asChild>
              <Link to="/" className="inline-flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (!article && !page) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavMenu />
        <main className="flex-grow bg-background">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">Page not found</h1>
            <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist or has been moved.</p>
            <Button asChild>
              <Link to="/" className="inline-flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  if (article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Helmet>
          <title>{article.meta_title}</title>
          <meta name="description" content={article.meta_description} />
          <meta property="og:title" content={article.meta_title} />
          <meta property="og:description" content={article.meta_description} />
          <link rel="canonical" href={`${window.location.origin}${slug ? `/${slug}` : ''}`} />
          {article.featured_image && (
            <meta property="og:image" content={article.featured_image} />
          )}
        </Helmet>

        <NavMenu />
        <main className="flex-grow bg-background">
          <article className="max-w-4xl mx-auto px-4 py-12 mt-8">
            <header className="mb-12">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 leading-tight">
                  {article.meta_title}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  {article.meta_description}
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-8">
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
                <div className="flex items-center gap-2 font-medium">
                  <User className="w-4 h-4" />
                  <span>{(article.author as any)?.name || "Anonymous"}</span>
                </div>
                {article.published_at && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={article.published_at} className="font-medium">
                      {format(new Date(article.published_at), "MMMM d, yyyy")}
                    </time>
                  </div>
                )}
              </div>

              {article.article_tags && article.article_tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-600 dark:text-gray-400">Tags:</span>
                    <div className="flex flex-wrap gap-2">
                      {article.article_tags.map((articleTag: any, index: number) => {
                        const tagColors = [
                          "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800",
                          "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800",
                          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800",
                          "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-pink-800",
                          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-800"
                        ];
                        const colorClass = tagColors[index % tagColors.length];
                        return (
                          <Badge
                            key={articleTag.tag.id}
                            className={`${colorClass} transition-colors duration-200 cursor-pointer px-3 py-1 rounded-full font-medium text-sm shadow-sm hover:shadow-md`}
                          >
                            {articleTag.tag.name}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {article.featured_image && (
                <div className="mt-8">
                  <img
                    src={article.featured_image}
                    alt={article.meta_title}
                    className="w-full h-[400px] object-cover rounded-2xl shadow-lg"
                  />
                </div>
              )}
            </header>

            <div className="prose dark:prose-invert max-w-none">
              <div className="article-content">
                <style>
                  {`
                    .article-content h1 {
                      font-size: 1.875rem;
                      font-weight: 700;
                      color: #1a1a1a;
                      margin-top: 2rem;
                      margin-bottom: 1rem;
                      line-height: 1.2;
                    }
                    .dark .article-content h1 {
                      color: #f3f4f6;
                    }
                    .article-content h2 {
                      font-size: 1.5rem;
                      font-weight: 600;
                      color: #1a1a1a;
                      margin-top: 1.5rem;
                      margin-bottom: 0.75rem;
                      line-height: 1.3;
                    }
                    .dark .article-content h2 {
                      color: #f3f4f6;
                    }
                    .article-content h3 {
                      font-size: 1.25rem;
                      font-weight: 600;
                      color: #1a1a1a;
                      margin-top: 1.25rem;
                      margin-bottom: 0.5rem;
                      line-height: 1.4;
                    }
                    .dark .article-content h3 {
                      color: #f3f4f6;
                    }
                    .article-content p {
                      font-size: 1.125rem;
                      line-height: 1.75;
                      color: #4b5563;
                      margin-bottom: 1.25rem;
                    }
                    .dark .article-content p {
                      color: #9ca3af;
                    }
                    .article-content a {
                      color: #2563eb;
                      text-decoration: none;
                      transition: color 0.2s;
                    }
                    .article-content a:hover {
                      color: #1d4ed8;
                      text-decoration: underline;
                    }
                    .dark .article-content a {
                      color: #60a5fa;
                    }
                    .dark .article-content a:hover {
                      color: #93c5fd;
                    }
                    .article-content ul, .article-content ol {
                      margin: 1.25rem 0;
                      padding-left: 1.5rem;
                    }
                    .article-content li {
                      font-size: 1.125rem;
                      line-height: 1.75;
                      color: #4b5563;
                      margin: 0.5rem 0;
                    }
                    .dark .article-content li {
                      color: #9ca3af;
                    }
                    .article-content blockquote {
                      border-left: 4px solid #e5e7eb;
                      padding-left: 1rem;
                      margin: 1.5rem 0;
                      font-style: italic;
                      color: #6b7280;
                    }
                    .dark .article-content blockquote {
                      border-left-color: #374151;
                      color: #9ca3af;
                    }
                    .article-content pre {
                      background-color: #f3f4f6;
                      padding: 1rem;
                      border-radius: 0.5rem;
                      overflow-x: auto;
                      margin: 1.5rem 0;
                    }
                    .dark .article-content pre {
                      background-color: #1f2937;
                    }
                    .article-content code {
                      font-family: ui-monospace, monospace;
                      font-size: 0.875rem;
                      color: #1a1a1a;
                    }
                    .dark .article-content code {
                      color: #f3f4f6;
                    }
                    .article-content img {
                      border-radius: 0.5rem;
                      margin: 1.5rem 0;
                      max-width: 100%;
                      height: auto;
                    }
                  `}
                </style>
                <ReactMarkdown className="article-content">
                  {article.document_text}
                </ReactMarkdown>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
              <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
                    Share this article
                  </span>
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  If you found this article helpful, share it with your network
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="ghost"
                    className="bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white hover:text-white transition-all duration-200 flex items-center gap-2 px-4 py-2 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    onClick={() => {
                      const url = window.location.href;
                      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(article.meta_title)}`, '_blank');
                    }}
                  >
                    <Twitter className="w-5 h-5" />
                    <span>Twitter</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="bg-[#1877F2] hover:bg-[#166fe5] text-white hover:text-white transition-all duration-200 flex items-center gap-2 px-4 py-2 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    onClick={() => {
                      const url = window.location.href;
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                    }}
                  >
                    <Facebook className="w-5 h-5" />
                    <span>Facebook</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="bg-[#0A66C2] hover:bg-[#095196] text-white hover:text-white transition-all duration-200 flex items-center gap-2 px-4 py-2 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    onClick={() => {
                      const url = window.location.href;
                      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
                    }}
                  >
                    <Linkedin className="w-5 h-5" />
                    <span>LinkedIn</span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white hover:text-white transition-all duration-200 flex items-center gap-2 px-4 py-2 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    onClick={() => {
                      const url = window.location.href;
                      navigator.clipboard.writeText(url);
                      toast({
                        title: "Link copied!",
                        description: "The article link has been copied to your clipboard.",
                        className: "bg-gradient-to-r from-purple-600 to-blue-600 text-white",
                      });
                    }}
                  >
                    <LinkIcon className="w-5 h-5" />
                    <span>Copy Link</span>
                  </Button>
                </div>
              </div>
            </div>
          </article>
        </main>
      </div>
    );
  }

  if (page) {
    return (
      <div className="min-h-screen flex flex-col">
        <Helmet>
          <title>{page.meta_title}</title>
          <meta name="description" content={page.meta_description} />
          <link rel="canonical" href={`${window.location.origin}${slug ? `/${slug}` : ''}`} />
        </Helmet>

        <NavMenu />
        <main className="flex-grow bg-background">
          <article className="max-w-4xl mx-auto px-4 py-12 mt-8">
            <header className="mb-12">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 leading-tight">
                  {page.meta_title}
                </h1>
                {page.meta_description && (
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    {page.meta_description}
                  </p>
                )}
              </div>
            </header>

            <div className="prose dark:prose-invert max-w-none">
              <div className="article-content">
                <style>
                  {`
                    .article-content h1 {
                      font-size: 1.875rem;
                      font-weight: 700;
                      color: #1a1a1a;
                      margin-top: 2rem;
                      margin-bottom: 1rem;
                      line-height: 1.2;
                    }
                    .dark .article-content h1 {
                      color: #f3f4f6;
                    }
                    .article-content h2 {
                      font-size: 1.5rem;
                      font-weight: 600;
                      color: #1a1a1a;
                      margin-top: 1.5rem;
                      margin-bottom: 0.75rem;
                      line-height: 1.3;
                    }
                    .dark .article-content h2 {
                      color: #f3f4f6;
                    }
                    .article-content h3 {
                      font-size: 1.25rem;
                      font-weight: 600;
                      color: #1a1a1a;
                      margin-top: 1.25rem;
                      margin-bottom: 0.5rem;
                      line-height: 1.4;
                    }
                    .dark .article-content h3 {
                      color: #f3f4f6;
                    }
                    .article-content p {
                      font-size: 1.125rem;
                      line-height: 1.75;
                      color: #4b5563;
                      margin-bottom: 1.25rem;
                    }
                    .dark .article-content p {
                      color: #9ca3af;
                    }
                    .article-content a {
                      color: #2563eb;
                      text-decoration: none;
                      transition: color 0.2s;
                    }
                    .article-content a:hover {
                      color: #1d4ed8;
                      text-decoration: underline;
                    }
                    .dark .article-content a {
                      color: #60a5fa;
                    }
                    .dark .article-content a:hover {
                      color: #93c5fd;
                    }
                    .article-content ul, .article-content ol {
                      margin: 1.25rem 0;
                      padding-left: 1.5rem;
                    }
                    .article-content li {
                      font-size: 1.125rem;
                      line-height: 1.75;
                      color: #4b5563;
                      margin: 0.5rem 0;
                    }
                    .dark .article-content li {
                      color: #9ca3af;
                    }
                    .article-content blockquote {
                      border-left: 4px solid #e5e7eb;
                      padding-left: 1rem;
                      margin: 1.5rem 0;
                      font-style: italic;
                      color: #6b7280;
                    }
                    .dark .article-content blockquote {
                      border-left-color: #374151;
                      color: #9ca3af;
                    }
                    .article-content pre {
                      background-color: #f3f4f6;
                      padding: 1rem;
                      border-radius: 0.5rem;
                      overflow-x: auto;
                      margin: 1.5rem 0;
                    }
                    .dark .article-content pre {
                      background-color: #1f2937;
                    }
                    .article-content code {
                      font-family: ui-monospace, monospace;
                      font-size: 0.875rem;
                      color: #1a1a1a;
                    }
                    .dark .article-content code {
                      color: #f3f4f6;
                    }
                    .article-content img {
                      border-radius: 0.5rem;
                      margin: 1.5rem 0;
                      max-width: 100%;
                      height: auto;
                    }
                  `}
                </style>
                <ReactMarkdown className="article-content">
                  {page.document_text}
                </ReactMarkdown>
              </div>
            </div>
          </article>
        </main>
      </div>
    );
  }

  return null;
}
