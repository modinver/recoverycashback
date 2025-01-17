import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet";
import { format } from "date-fns";
import { User, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from 'react-markdown';
import { NavMenu } from "@/components/navigation/NavMenu";

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
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
      const { data, error } = await supabase
        .from("webpages")
        .select("*")
        .eq("slug_url", slug)
        .eq("is_published", true)
        .single();

      if (error) {
        console.log("Page search error:", error);
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }
      console.log("Found page:", data);
      return data;
    },
  });

  // Log all states for debugging
  console.log("Component state:", {
    slug,
    isLoadingArticle,
    isLoadingPage,
    hasArticle: !!article,
    hasPage: !!page,
    articleError,
    pageError
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
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {article.meta_title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
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

            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{article.document_text}</ReactMarkdown>
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
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">
              {page.meta_title}
            </h1>
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{page.document_text}</ReactMarkdown>
            </div>
          </article>
        </main>
      </div>
    );
  }

  return null;
}
