import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FAQDialog } from "@/components/faqs/FAQDialog";
import { FAQTable } from "@/components/faqs/FAQTable";
import { DeleteFAQDialog } from "@/components/faqs/DeleteFAQDialog";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";

export default function FAQs() {
  const [selectedFAQ, setSelectedFAQ] = useState<Tables<"faqs"> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [faqToDelete, setFaqToDelete] = useState<string | null>(null);

  const { data: faqs, refetch } = useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .order("order_index");
      if (error) throw error;
      return data;
    },
  });

  const handlePublishToggle = async (id: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from("faqs")
        .update({ is_published: !currentState })
        .eq("id", id);
      
      if (error) throw error;
      
      toast.success("FAQ status updated successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to update FAQ status");
    }
  };

  const handleDelete = async () => {
    if (!faqToDelete) return;

    try {
      const { error } = await supabase
        .from("faqs")
        .delete()
        .eq("id", faqToDelete);

      if (error) throw error;

      toast.success("FAQ deleted successfully");
      refetch();
      setDeleteDialogOpen(false);
      setFaqToDelete(null);
    } catch (error) {
      toast.error("Failed to delete FAQ");
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    if (!faqs) return;
    
    const currentIndex = faqs.findIndex(faq => faq.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === faqs.length - 1)
    ) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const updatedFaqs = [...faqs];
    const temp = updatedFaqs[currentIndex];
    updatedFaqs[currentIndex] = updatedFaqs[newIndex];
    updatedFaqs[newIndex] = temp;

    try {
      const updates = updatedFaqs.map((faq, index) => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        order_index: index,
        is_published: faq.is_published
      }));

      const { error } = await supabase
        .from("faqs")
        .upsert(updates);

      if (error) throw error;

      toast.success("FAQ order updated successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to update FAQ order");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">FAQs</h1>
          <p className="text-muted-foreground">
            Manage frequently asked questions
          </p>
        </div>
        <Button onClick={() => {
          setSelectedFAQ(null);
          setIsDialogOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      <FAQTable
        faqs={faqs}
        onEdit={(faq) => {
          setSelectedFAQ(faq);
          setIsDialogOpen(true);
        }}
        onDelete={(id) => {
          setFaqToDelete(id);
          setDeleteDialogOpen(true);
        }}
        onPublishToggle={handlePublishToggle}
        onReorder={handleReorder}
      />

      <FAQDialog
        faq={selectedFAQ}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => {
          refetch();
          setIsDialogOpen(false);
        }}
      />

      <DeleteFAQDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </div>
  );
}