import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import { WebpageDialog } from "@/components/webpages/WebpageDialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import { WebpageFormFields } from "@/components/webpages/WebpageFormFields";
import { useWebpageForm } from "@/components/webpages/form/useWebpageForm";
import { useWebpageSubmit } from "@/components/webpages/form/useWebpageSubmit";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { Database } from "@/types/supabase";

type Webpage = Database["public"]["Tables"]["webpages"]["Row"];

export default function Webpages() {
  const [selectedWebpage, setSelectedWebpage] = useState<Webpage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: webpages, refetch, isLoading } = useQuery({
    queryKey: ["webpages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("webpages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { form } = useWebpageForm({ 
    webpage: selectedWebpage 
  });

  const { onSubmit } = useWebpageSubmit({
    webpage: selectedWebpage,
    onSuccess: () => {
      setIsDialogOpen(false);
      refetch();
    },
  });

  const handleEdit = (webpage: Webpage) => {
    setSelectedWebpage(webpage);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedWebpage(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedWebpage(null);
  };

  const handleDelete = async (webpageId: string) => {
    try {
      // Primero, eliminar los tags asociados
      const { error: deleteTagsError } = await supabase
        .from("webpage_tags")
        .delete()
        .eq("webpage_id", webpageId);

      if (deleteTagsError) {
        console.error("Error deleting webpage tags:", deleteTagsError);
        toast.error("Failed to delete webpage tags");
        return;
      }

      // Luego, eliminar la página web
      const { error: deleteWebpageError } = await supabase
        .from("webpages")
        .delete()
        .eq("id", webpageId);

      if (deleteWebpageError) {
        console.error("Error deleting webpage:", deleteWebpageError);
        toast.error("Failed to delete webpage");
        return;
      }

      toast.success("Webpage deleted successfully");
      refetch(); // Refresca la lista de webpages después de eliminar
    } catch (error) {
      console.error("Error in delete operation:", error);
      toast.error("An error occurred while deleting the webpage");
    }
  };

  const getStatusBadge = (status: boolean) => {
    return status ? 
      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Published</span> :
      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Draft</span>;
  };

  const getFormattedDate = (date: string) => {
    try {
      return formatDate(date);
    } catch (e) { return "-"; }
  };

  if (isLoading) {
    return <div>Loading...</div>;
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
          {webpages?.map((webpage) => (
            <TableRow key={webpage.id}>
              <TableCell>
                <Link 
                  to={`/${webpage.slug_url}`}
                  target="_blank"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                >
                  {webpage.meta_title}
                </Link>
              </TableCell>
              <TableCell>
                {getStatusBadge(webpage.is_published)}
              </TableCell>
              <TableCell>{getFormattedDate(webpage.created_at)}</TableCell>
              <TableCell>{getFormattedDate(webpage.published_at)}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(webpage)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(webpage.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-4xl" aria-labelledby="dialog-title">
          <h2 id="dialog-title" className="sr-only">{selectedWebpage ? "Edit Web Page" : "Create Web Page"}</h2>
          <div className="py-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <WebpageFormFields 
                form={form} 
                onImageUpload={async (file: File) => {
                  // Implementar la lógica de carga de imágenes aquí
                  return "";
                }} 
              />
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedWebpage ? 'Update' : 'Create'} Webpage
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}