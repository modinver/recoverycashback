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
import { PageDialog } from "@/components/pages/PageDialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function Pages() {
  const [selectedPage, setSelectedPage] = useState<Tables<"webpages"> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: pages, refetch, isLoading, error } = useQuery({
    queryKey: ["webpages"],
    queryFn: async () => {
      console.log("Fetching webpages...");
      const { data, error } = await supabase
        .from("webpages")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching webpages:", error);
        throw error;
      }
      
      console.log("Webpages fetched successfully:", data);
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("webpages").delete().eq("id", id);
      
      if (error) {
        console.error("Error deleting webpage:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not delete webpage. Please try again.",
        });
        return;
      }
      
      toast({
        title: "Success",
        description: "Webpage deleted successfully.",
      });
      refetch();
    } catch (error) {
      console.error("Error in handleDelete:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred while deleting the webpage.",
      });
    }
  };

  const handleEdit = (page: Tables<"webpages">) => {
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

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Error Loading Webpages</h2>
          <p>{(error as Error).message}</p>
          <p className="text-sm mt-2">Please make sure you are logged in as an admin user.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-52"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-96"></div>
              <div className="h-4 bg-gray-200 rounded w-80"></div>
              <div className="h-4 bg-gray-200 rounded w-88"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Web Pages</h1>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Web Page
        </Button>
      </div>

      {pages && pages.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No webpages found. Create your first webpage by clicking the "Add Web Page" button above.
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