import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { useQueryClient } from "@tanstack/react-query";
import { FormData } from "./useArticleForm";
import { useToast } from "@/components/ui/use-toast";

interface UseArticleSubmitProps {
  article: Tables<"webpages"> | null;
  onSuccess: () => void;
}

export function useArticleSubmit({ article, onSuccess }: UseArticleSubmitProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      const values = {
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        slug_url: data.slug_url,
        document_text: data.document_text,
        is_published: data.is_published,
        featured_image: data.featured_image,
        author: data.author,
        schema_type: data.schema_type,
        published_at: data.is_published ? new Date().toISOString() : null,
      };

      let articleId: string;

      if (article) {
        const { error } = await supabase
          .from("webpages")
          .update(values)
          .eq("id", article.id);
        if (error) throw error;
        articleId = article.id;
      } else {
        const { data: newArticle, error } = await supabase
          .from("webpages")
          .insert([values])
          .select()
          .single();
        if (error) throw error;
        articleId = newArticle.id;
      }

      // Handle tags
      if (article) {
        await supabase
          .from("article_tags")
          .delete()
          .eq("article_id", article.id);
      }

      if (data.tags.length > 0) {
        const tagRelations = data.tags.map((tagId) => ({
          article_id: articleId,
          tag_id: tagId,
        }));

        const { error: tagError } = await supabase
          .from("article_tags")
          .insert(tagRelations);

        if (tagError) throw tagError;
      }

      toast({
        title: "Success",
        description: `Article ${article ? "updated" : "created"} successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      onSuccess();
    } catch (error) {
      console.error("Error saving article:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Could not ${article ? "update" : "create"} article. Please try again.`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit,
  };
}