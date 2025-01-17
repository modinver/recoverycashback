import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "./form/useArticleForm";
import { TagList } from "./tags/TagList";

interface TagSelectorProps {
  form: UseFormReturn<FormData>;
  articleId?: string;
}

export function TagSelector({ form, articleId }: TagSelectorProps) {
  const [selectedTags, setSelectedTags] = useState<Tables<"tags">[]>([]);

  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (articleId) {
      const fetchArticleTags = async () => {
        const { data, error } = await supabase
          .from("article_tags")
          .select("tags(*)")
          .eq("article_id", articleId);

        if (!error && data) {
          const tagsList = data.map((item) => item.tags as Tables<"tags">);
          setSelectedTags(tagsList);
          form.setValue("tags", tagsList.map(tag => tag.id));
        }
      };

      fetchArticleTags();
    }
  }, [articleId, form]);

  const handleTagToggle = (tag: Tables<"tags">) => {
    let newTags: Tables<"tags">[];

    if (selectedTags.some(t => t.id === tag.id)) {
      newTags = selectedTags.filter(t => t.id !== tag.id);
    } else {
      newTags = [...selectedTags, tag];
    }

    setSelectedTags(newTags);
    form.setValue("tags", newTags.map(t => t.id));
  };

  return (
    <FormField
      control={form.control}
      name="tags"
      render={() => (
        <FormItem>
          <FormLabel>Tags</FormLabel>
          <FormControl>
            <TagList
              tags={tags}
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}