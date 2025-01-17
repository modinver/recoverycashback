import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import { ArticleDialog } from "@/components/articles/ArticleDialog";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function Articles() {
  const [selectedArticle, setSelectedArticle] = useState<Tables<"blog_articles"> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: articles, refetch } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_articles")
        .select("*, authors(name)")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("blog_articles").delete().eq("id", id);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete article. Please try again.",
      });
      return;
    }
    
    toast({
      title: "Success",
      description: "Article deleted successfully.",
    });
    refetch();
  };

  const handleEdit = (article: Tables<"blog_articles">) => {
    setSelectedArticle(article);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedArticle(null);
    setIsDialogOpen(true);
  };

  const formatDate = (date: string | null | undefined) => {
    if (!date) return "-";
    try {
      return format(new Date(date), "PPp");
    } catch {
      return "-";
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Articles</h1>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Article
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Published At</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles?.map((article) => (
            <TableRow key={article.id}>
              <TableCell>{article.meta_title}</TableCell>
              <TableCell>
                <Badge variant={article.is_published ? "default" : "secondary"}>
                  {article.is_published ? (
                    <Eye className="w-3 h-3 mr-1" />
                  ) : (
                    <EyeOff className="w-3 h-3 mr-1" />
                  )}
                  {article.is_published ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell>{(article.authors as any)?.name}</TableCell>
              <TableCell>{formatDate(article.created_at)}</TableCell>
              <TableCell>{formatDate(article.published_at)}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(article)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(article.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ArticleDialog
        article={selectedArticle}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => {
          refetch();
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
}