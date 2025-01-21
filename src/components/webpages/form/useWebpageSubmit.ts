import { supabase } from "@/integrations/supabase/client";
import { FormData } from "./useWebpageForm";
import { Database } from "@/types/supabase";
import { useToast } from "@/components/ui/use-toast";

interface UseWebpageSubmitProps {
  webpage: Database["public"]["Tables"]["webpages"]["Row"] | null;
  onSuccess: () => void;
}

export function useWebpageSubmit({ webpage, onSuccess }: UseWebpageSubmitProps) {
  const { toast } = useToast();

  const onSubmit = async (data: FormData) => {
    try {
      const values = {
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        meta_keywords: data.meta_keywords || null,
        meta_altimage: data.meta_altimage || null,
        featured_image: data.featured_image || null,
        slug_url: data.slug_url,
        document_text: data.document_text,
        youtube_link: data.youtube_link || null,
        tiktok_link: data.tiktok_link || null,
        instagram_link: data.instagram_link || null,
        reddit_link: data.reddit_link || null,
        is_published: data.is_published,
        published_at: data.is_published ? new Date().toISOString() : null,
        author: data.author || null,
        shcema_type: data.shcema_type || null,
        type: data.type || false,
        doc_type: data.doc_type || false,
        updated_at: new Date().toISOString(),
      };

      console.log("Submitting values:", values);

      let webpageId: string;

      // Actualizar o crear la página web
      if (webpage) {
        const { error } = await supabase
          .from("webpages")
          .update(values)
          .eq("id", webpage.id);
        if (error) {
          console.error("Error updating webpage:", error);
          throw error;
        }
        webpageId = webpage.id;
      } else {
        const { data: newWebpage, error } = await supabase
          .from("webpages")
          .insert([values])
          .select()
          .single();
        console.log("New webpage data response:", newWebpage); // Log de la respuesta de la nueva página
        if (error) {
          console.error("Error inserting new webpage:", error);
          throw error;
        }
        if (!newWebpage) throw new Error("No webpage returned after insert");
        webpageId = newWebpage.id;
      }

      // Eliminar tags existentes
      await supabase
        .from("webpage_tags")
        .delete()
        .eq("webpage_id", webpageId);

      // Insertar nuevos tags si existen
      if (data.tags && data.tags.length > 0) {
        const tagInserts = data.tags.map(tagId => ({
          webpage_id: webpageId,
          tag_id: tagId
        }));

        console.log("Inserting tags:", tagInserts); // Log de los tags que se insertarán

        const { error: insertError } = await supabase
          .from("webpage_tags")
          .insert(tagInserts);
        
        console.log("Insert error details:", insertError); // Log de detalles del error de inserción
        if (insertError) {
          console.error("Error inserting tags:", insertError);
          throw new Error("Failed to update tags");
        }
      }

      toast({
        title: "Success",
        description: `Web page ${webpage ? "updated" : "created"} successfully.`,
      });
      onSuccess();
    } catch (error: any) {
      console.error("Error saving webpage:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || `Could not ${webpage ? "update" : "create"} web page. Please try again.`,
      });
    }
  };

  return { onSubmit };
}