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
import { WebpageDialog } from "@/components/webpages/WebpageDialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function Webpages() {
  const [selectedWebpage, setSelectedWebpage] = useState<Tables<"webpages"> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: webpages, refetch } = useQuery({
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

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("webpages").delete().eq("id", id);
    
    if (error) {
      toast.error("Could not delete webpage. Please try again.");
      return;
    }
    
    toast.success("Webpage deleted successfully.");
    refetch();
  };

  const handleEdit = (webpage: Tables<"webpages">) => {
    setSelectedWebpage(webpage);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedWebpage(null);
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
              <TableCell>{webpage.meta_title}</TableCell>
              <TableCell>
                <Badge variant={webpage.is_published ? "default" : "secondary"}>
                  {webpage.is_published ? (
                    <Eye className="w-3 h-3 mr-1" />
                  ) : (
                    <EyeOff className="w-3 h-3 mr-1" />
                  )}
                  {webpage.is_published ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(webpage.created_at)}</TableCell>
              <TableCell>{formatDate(webpage.published_at)}</TableCell>
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

      <WebpageDialog
        webpage={selectedWebpage}
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