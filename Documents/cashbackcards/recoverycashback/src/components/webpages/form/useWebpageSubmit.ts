import { supabase } from "@/integrations/supabase/client";
import { FormData } from "./useWebpageForm";
import { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";

interface UseWebpageSubmitProps {
  webpage: Tables<"webpages"> | null;
  onSuccess: () => void;
}

export function useWebpageSubmit({ webpage, onSuccess }: UseWebpageSubmitProps) {
  const { toast } = useToast();

  const onSubmit = async (data: FormData) => {
    try {
      const values = {
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        slug_url: data.slug_url,
        document_text: data.document_text,
        is_published: data.is_published,
        published_at: data.is_published ? new Date().toISOString() : null,
      };

      if (webpage) {
        const { error } = await supabase
          .from("webpages")
          .update(values)
          .eq("id", webpage.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("webpages")
          .insert([values]);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Web page ${webpage ? "updated" : "created"} successfully.`,
      });
      onSuccess();
    } catch (error) {
      console.error("Error saving webpage:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Could not ${webpage ? "update" : "create"} web page. Please try again.`,
      });
    }
  };

  return { onSubmit };
}