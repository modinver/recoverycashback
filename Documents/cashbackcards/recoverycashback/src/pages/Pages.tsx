import { useState, useEffect } from "react";
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
import { PageDialog } from "@/components/pages/PageDialog";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function Pages() {
  const [selectedPage, setSelectedPage] = useState<Tables<"pages"> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: pages, refetch, error: queryError, isLoading } = useQuery({
    queryKey: ["pages"],
    queryFn: async () => {
      console.log("Fetching pages...");
      const { data, error } = await supabase
        .from("pages")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching pages:", error);
        throw error;
      }
      
      console.log("Pages fetched successfully:", data);
      return data;
    },
  });

  useEffect(() => {
    console.log("Current pages state:", { pages, isLoading, error: queryError });
  }, [pages, isLoading, queryError]);

  if (queryError) {
    console.error("Query error:", queryError);
    return (
      <div className="container mx-auto py-10">
        <div className="text-red-500">Error loading pages: {queryError.message}</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div>Loading pages...</div>
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("pages").delete().eq("id", id);
      
      if (error) {
        console.error("Error deleting page:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not delete page. Please try again.",
        });
        return;
      }
      
      toast({
        title: "Success",
        description: "Page deleted successfully.",
      });
      refetch();
    } catch (error) {
      console.error("Error in handleDelete:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while deleting the page.",
      });
    }
  };

  const handleEdit = (page: Tables<"pages">) => {
    setSelectedPage(page);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedPage(null);
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
        <h1 className="text-3xl font-bold">Pages</h1>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Page
        </Button>
      </div>

      {pages && pages.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No pages found. Create your first page by clicking the "Add Page" button above.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Published At</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages?.map((page) => (
              <TableRow key={page.id}>
                <TableCell>{page.meta_title}</TableCell>
                <TableCell>
                  <Badge variant={page.is_published ? "default" : "secondary"}>
                    {page.is_published ? (
                      <Eye className="w-3 h-3 mr-1" />
                    ) : (
                      <EyeOff className="w-3 h-3 mr-1" />
                    )}
                    {page.is_published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(page.created_at)}</TableCell>
                <TableCell>{formatDate(page.published_at)}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(page)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(page.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <PageDialog
        page={selectedPage}
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