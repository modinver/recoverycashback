import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tables } from "@/integrations/supabase/types";
import { useEffect } from "react";

const formSchema = z.object({
  meta_title: z.string().min(1, "Title is required"),
  meta_description: z.string().min(1, "Description is required"),
  slug_url: z.string().min(1, "URL slug is required"),
  document_text: z.string().min(1, "Content is required"),
  is_published: z.boolean().default(false),
});

export type FormData = z.infer<typeof formSchema>;

export function useWebpageForm(webpage: Tables<"webpages"> | null) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      meta_title: "",
      meta_description: "",
      slug_url: "",
      document_text: "",
      is_published: false,
    },
  });

  useEffect(() => {
    if (webpage) {
      form.reset({
        meta_title: webpage.meta_title,
        meta_description: webpage.meta_description,
        slug_url: webpage.slug_url,
        document_text: webpage.document_text,
        is_published: webpage.is_published || false,
      });
    } else {
      form.reset({
        meta_title: "",
        meta_description: "",
        slug_url: "",
        document_text: "",
        is_published: false,
      });
    }
  }, [webpage, form]);

  return form;
}