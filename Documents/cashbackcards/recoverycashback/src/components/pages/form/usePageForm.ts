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

export function usePageForm(page: Tables<"webpages"> | null) {
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
    if (page) {
      form.reset({
        meta_title: page.meta_title,
        meta_description: page.meta_description,
        slug_url: page.slug_url,
        document_text: page.document_text,
        is_published: page.is_published || false,
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
  }, [page, form]);

  return form;
}