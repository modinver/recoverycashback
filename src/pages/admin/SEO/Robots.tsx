import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, RotateCcw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRobotsContent, updateRobotsContent } from "@/api/seo/robots";

const defaultRobotsContent = `User-agent: *
Allow: /

# Block access to admin paths
User-agent: *
Disallow: /admin/
Disallow: /api/

# Allow search engines to crawl all other content
User-agent: *
Allow: /

# Sitemap location
Sitemap: https://yourdomain.com/sitemap.xml`;

export default function RobotsPage() {
  const [localContent, setLocalContent] = useState(defaultRobotsContent);
  const [isDirty, setIsDirty] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["robots-txt"],
    queryFn: getRobotsContent
  });

  useEffect(() => {
    if (data) {
      setLocalContent(data);
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: async (content: string) => {
      await updateRobotsContent(content);
      return content;
    },
    onSuccess: () => {
      toast.success("robots.txt updated successfully");
      setIsDirty(false);
      queryClient.invalidateQueries({ queryKey: ["robots-txt"] });
    },
    onError: (error) => {
      toast.error(`Error saving robots.txt: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  const handleContentChange = (content: string) => {
    setLocalContent(content);
    setIsDirty(true);
  };

  const handleSave = () => {
    updateMutation.mutate(localContent);
  };

  const handleReset = () => {
    setLocalContent(defaultRobotsContent);
    setIsDirty(true);
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        Error loading robots.txt: {error instanceof Error ? error.message : "Unknown error"}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Robots.txt Editor</CardTitle>
              <CardDescription>
                Edit your site's robots.txt file to control search engine crawling behavior
              </CardDescription>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>The robots.txt file tells search engines which pages they can and cannot crawl on your website.</p>
                  <p className="mt-2">Common directives:</p>
                  <ul className="list-disc pl-4 mt-1">
                    <li>User-agent: Specifies which robot the rules apply to</li>
                    <li>Allow: Permits crawling of specified pages</li>
                    <li>Disallow: Prevents crawling of specified pages</li>
                    <li>Sitemap: Points to your XML sitemap location</li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={localContent}
            onChange={(e) => handleContentChange(e.target.value)}
            className="min-h-[400px] font-mono"
            placeholder="Enter your robots.txt content here..."
            disabled={isLoading}
          />
          <div className="mt-4 flex items-center gap-2">
            <Button 
              onClick={handleSave}
              disabled={isLoading || !isDirty || updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    disabled={isLoading || updateMutation.isPending}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset to Default
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Reset to a default robots.txt configuration
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
