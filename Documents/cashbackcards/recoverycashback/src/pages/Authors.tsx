import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthorDialog } from "@/components/authors/AuthorDialog";
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react";
import { toast } from "sonner";

export default function Authors() {
  const [selectedAuthor, setSelectedAuthor] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: authors } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleEdit = (author: any) => {
    setSelectedAuthor(author);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("authors")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Author deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["authors"] });
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["authors"] });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Authors</h1>
        <Button onClick={() => {
          setSelectedAuthor(null);
          setDialogOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Author
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Bio</TableHead>
            <TableHead>Twitter</TableHead>
            <TableHead>LinkedIn</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {authors?.map((author) => (
            <TableRow key={author.id}>
              <TableCell>{author.name}</TableCell>
              <TableCell>{author.bio}</TableCell>
              <TableCell>{author.twitter_url}</TableCell>
              <TableCell>{author.linkedin_url}</TableCell>
              <TableCell>{new Date(author.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(author)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(author.id)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AuthorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        author={selectedAuthor}
        onSuccess={handleSuccess}
      />
    </div>
  );
}