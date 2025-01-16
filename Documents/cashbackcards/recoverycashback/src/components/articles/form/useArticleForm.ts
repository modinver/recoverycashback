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
  featured_image: z.string().nullable(),
  tags: z.array(z.string()).default([]),
  author: z.string().min(1, "Author is required"),
  schema_type: z.enum(['article', 'blogPosting', 'newsArticle', 'review', 'howTo']).default('article'),
});

export type FormData = z.infer<typeof formSchema>;

export function useArticleForm(article: Tables<"blog_articles"> | null) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      meta_title: "",
      meta_description: "",
      slug_url: "",
      document_text: "",
      is_published: false,
      featured_image: null,
      tags: [],
      author: "",
      schema_type: "article",
    },
  });

  useEffect(() => {
    if (article) {
      form.reset({
        meta_title: article.meta_title,
        meta_description: article.meta_description,
        slug_url: article.slug_url,
        document_text: article.document_text,
        is_published: article.is_published || false,
        featured_image: article.featured_image,
        tags: [],
        author: article.author || "",
        schema_type: article.schema_type || "article",
      });
    } else {
      form.reset({
        meta_title: "",
        meta_description: "",
        slug_url: "",
        document_text: "",
        is_published: false,
        featured_image: null,
        tags: [],
        author: "",
        schema_type: "article",
      });
    }
  }, [article, form]);

  return form;
}