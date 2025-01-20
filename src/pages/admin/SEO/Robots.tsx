import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function RobotsPage() {
  const [robotsContent, setRobotsContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRobotsContent();
  }, []);

  const fetchRobotsContent = async () => {
    setError(null);
    try {
      const response = await fetch("/api/admin/seo/robots");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch robots.txt");
      }
      const data = await response.json();
      setRobotsContent(data.content || "");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error loading robots.txt:", error);
      setError(errorMessage);
      toast.error(`Error loading robots.txt: ${errorMessage}`);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/seo/robots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: robotsContent }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save robots.txt");
      }
      
      toast.success("robots.txt updated successfully");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error saving robots.txt:", error);
      setError(errorMessage);
      toast.error(`Error saving robots.txt: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Robots.txt Editor</CardTitle>
          <CardDescription>
            Edit your site's robots.txt file to control search engine crawling behavior
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
              Error: {error}
            </div>
          )}
          <Textarea
            value={robotsContent}
            onChange={(e) => setRobotsContent(e.target.value)}
            className="min-h-[400px] font-mono"
            placeholder="Enter your robots.txt content here..."
          />
          <div className="mt-4">
            <Button 
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
