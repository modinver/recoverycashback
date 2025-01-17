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
import { Pencil, Trash2, Plus } from "lucide-react";
import { BankDialog } from "@/components/banks/BankDialog";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

export default function Banks() {
  const [selectedBank, setSelectedBank] = useState<Tables<"banks"> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: banks, refetch } = useQuery({
    queryKey: ["banks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("banks")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("banks").delete().eq("id", id);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete bank. Please try again.",
      });
      return;
    }
    
    toast({
      title: "Success",
      description: "Bank deleted successfully.",
    });
    refetch();
  };

  const handleEdit = (bank: Tables<"banks">) => {
    setSelectedBank(bank);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedBank(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Banks</h1>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Bank
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {banks?.map((bank) => (
            <TableRow key={bank.id}>
              <TableCell>{bank.name}</TableCell>
              <TableCell>
                {format(new Date(bank.created_at), "PPp")}
              </TableCell>
              <TableCell>
                {format(new Date(bank.updated_at), "PPp")}
              </TableCell>
              <TableCell className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(bank)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(bank.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <BankDialog
        bank={selectedBank}
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