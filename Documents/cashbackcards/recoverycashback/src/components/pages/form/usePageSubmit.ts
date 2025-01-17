import { supabase } from "@/integrations/supabase/client";
import { FormData } from "./usePageForm";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";

interface UsePageSubmitProps {
  page: Tables<"webpages"> | null;
  onSuccess: () => void;
}

export function usePageSubmit({ page, onSuccess }: UsePageSubmitProps) {
  const { toast } = useToast();

  const onSubmit = async (data: FormData) => {
    try {
      console.log("Submitting webpage form:", data);
      
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
        console.log("Updating existing webpage:", page.id);
        const { error } = await supabase
          .from("webpages")
          .update(values)
          .eq("id", page.id);
        if (error) throw error;
      } else {
        console.log("Creating new webpage");
        const { error } = await supabase
          .from("webpages")
          .insert([values]);
        if (error) throw error;
      }

      console.log("Webpage saved successfully");
      toast({
        title: "Success",
        description: `Webpage ${page ? "updated" : "created"} successfully.`,
      });
      onSuccess();
    } catch (error) {
      console.error("Error saving webpage:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Could not ${page ? "update" : "create"} webpage. Please try again.`,
      });
    }
  };

  return { onSubmit };
}