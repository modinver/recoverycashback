import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Tables } from "@/integrations/supabase/types";

const articleSchema = z.object({
  meta_title: z.string().min(1, "El título es requerido"),
  meta_description: z.string().min(1, "La descripción es requerida"),
  meta_keywords: z.string(),
  meta_altimage: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
  document_text: z.string().min(1, "El contenido es requerido"),
  slug_url: z.string().min(1, "El slug es requerido"),
  is_published: z.boolean(),
});

export type FormData = z.infer<typeof articleSchema>;

export function useArticleForm(article: Tables<"webpages"> | null) {
  const form = useForm<FormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      meta_altimage: "",
      document_text: "",
      slug_url: "",
      is_published: false,
    },
  });

  useEffect(() => {
    if (article) {
      form.reset({
        meta_title: article.meta_title,
        meta_description: article.meta_description,
        meta_keywords: article.meta_keywords || "",
        meta_altimage: article.meta_altimage || "",
        document_text: article.document_text,
        slug_url: article.slug_url,
        is_published: article.is_published,
      });
    } else {
      form.reset({
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        meta_altimage: "",
        document_text: "",
        slug_url: "",
        is_published: false,
      });
    }
  }, [article, form.reset]);

  return form;
}