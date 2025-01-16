import { supabase } from "@/integrations/supabase/client";
import { FormData } from "./usePageForm";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";

interface UsePageSubmitProps {
  page: Tables<"pages"> | null;
  onSuccess: () => void;
}

export function usePageSubmit({ page, onSuccess }: UsePageSubmitProps) {
  const { toast } = useToast();

  const onSubmit = async (data: FormData) => {
    try {
      console.log("Submitting page form:", data);
      
      const values = {
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        slug_url: data.slug_url,
        document_text: data.document_text,
        is_published: data.is_published,
        published_at: data.is_published ? new Date().toISOString() : null,
      };

      console.log("Prepared values:", values);

      if (page) {
        console.log("Updating existing page:", page.id);
        const { error } = await supabase
          .from("pages")
          .update(values)
          .eq("id", page.id);
        if (error) throw error;
      } else {
        console.log("Creating new page");
        const { error } = await supabase
          .from("pages")
          .insert([values]);
        if (error) throw error;
      }

      console.log("Page saved successfully");
      toast({
        title: "Success",
        description: `Page ${page ? "updated" : "created"} successfully.`,
      });
      onSuccess();
    } catch (error) {
      console.error("Error saving page:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Could not ${page ? "update" : "create"} page. Please try again.`,
      });
    }
  };

  return { onSubmit };
}