import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "./form/useArticleForm";

interface AuthorSelectorProps {
  form: UseFormReturn<FormData>;
}

export function AuthorSelector({ form }: AuthorSelectorProps) {
  const { data: authors } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <FormField
      control={form.control}
      name="author"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Author</FormLabel>
          <Select onValueChange={field.onChange} value={field.value || ""}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select an author" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {authors?.map((author) => (
                <SelectItem key={author.id} value={author.id}>
                  {author.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}