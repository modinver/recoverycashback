import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import { format } from "date-fns";
import { User, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import ReactMarkdown from 'react-markdown';
import { NavMenu } from "@/components/navigation/NavMenu";
import { useWebpageQuery } from "@/hooks/useWebpageQuery";
import { useEffect } from "react";
import { Webpage } from "@/integrations/supabase/types/database/card.types";

// Extender el tipo Webpage con los campos adicionales
type ExtendedWebpage = Webpage & {
  meta_keywords?: string | null;
  meta_altimage?: string | null;
  featured_image?: string | null;
};

export default function DynamicPage() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const location = useLocation();

  const { 
    data: webpage, 
    isLoading: isLoadingPage, 
    error: pageError,
    prefetchWebpage 
  } = useWebpageQuery(slug);

  useEffect(() => {
    if (webpage) {
      prefetchWebpage(slug);
    }
  }, [webpage, prefetchWebpage, slug]);

  if (isLoadingPage) {
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

  if (!webpage) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavMenu />
        <main className="flex-grow bg-background">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">Page not found</h1>
            <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist or has been moved.</p>
          </div>
        </main>
      </div>
    );
  }

  const extendedWebpage = webpage as ExtendedWebpage;

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{webpage.meta_title}</title>
        <meta name="description" content={webpage.meta_description} />
        <meta name="keywords" content={extendedWebpage.meta_keywords} />
        <meta name="author" content="Recovery Cashback" />
        <link rel="canonical" href={`https://recoverycashback.com/${slug}/`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://recoverycashback.com/${slug}/`} />
        <meta property="og:title" content={webpage.meta_title} />
        <meta property="og:description" content={webpage.meta_description} />
        <meta property="og:image" content={extendedWebpage.meta_altimage} />
        <meta property="og:site_name" content="Recovery Cashback" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={`https://recoverycashback.com/${slug}/`} />
        <meta name="twitter:title" content={webpage.meta_title} />
        <meta name="twitter:description" content={webpage.meta_description} />
        <meta name="twitter:image" content={extendedWebpage.meta_altimage} />
      </Helmet>

      <NavMenu />
      <main className="flex-grow bg-background">
        <article className="max-w-4xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-6">{webpage.meta_title}</h1>
          
          {extendedWebpage.meta_altimage && (
            <img
              src={extendedWebpage.meta_altimage}
              alt={webpage.meta_title}
              className="w-full h-auto rounded-lg mb-8"
            />
          )}

          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>
              {webpage.document_text}
            </ReactMarkdown>
          </div>
        </article>
      </main>
    </div>
  );
}
