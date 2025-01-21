import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/types/supabase";

// Extender el tipo de webpages con todos los campos adicionales
type ExtendedWebpage = Database["public"]["Tables"]["webpages"]["Row"] & {
  tags?: string[];
};

const formSchema = z.object({
  meta_title: z.string().min(1, "Title is required"),
  meta_description: z.string().min(1, "Description is required"),
  meta_keywords: z.string().nullable(),
  meta_altimage: z.string().nullable(),
  featured_image: z.string().nullable(),
  slug_url: z.string().min(1, "URL is required"),
  document_text: z.string().min(1, "Content is required"),
  youtube_link: z.string().nullable(),
  tiktok_link: z.string().nullable(),
  instagram_link: z.string().nullable(),
  reddit_link: z.string().nullable(),
  is_published: z.boolean().default(false),
  author: z.string().nullable(),
  shcema_type: z.string().nullable(),
  type: z.boolean().default(false),
  doc_type: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

export type FormData = z.infer<typeof formSchema>;

interface UseWebpageFormProps {
  webpage?: Database["public"]["Tables"]["webpages"]["Row"] | null;
}

export function useWebpageForm({ webpage }: UseWebpageFormProps = {}) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      meta_title: "",
      meta_description: "",
      meta_keywords: "",
      meta_altimage: "",
      featured_image: "",
      slug_url: "",
      document_text: "",
      youtube_link: "",
      tiktok_link: "",
      instagram_link: "",
      reddit_link: "",
      is_published: false,
      author: "",
      shcema_type: "",
      type: false,
      doc_type: false,
      tags: [],
    },
  });

  // Cargar los datos cuando el webpage cambie
  useEffect(() => {
    async function loadData() {
      if (webpage) {
        try {
          console.log("Loading webpage data:", webpage);
          console.log("Webpage ID:", webpage.id); // Log del ID del webpage
          
          // Obtener los tags de la base de datos
          const { data: tagData, error } = await supabase
            .from("webpage_tags")
            .select("tag_id")
            .eq("webpage_id", webpage.id);

          console.log("Tag data response:", tagData); // Log de la respuesta de tags
          console.error("Error loading tags:", error);

          if (error) {
            console.error("Error loading tags:", error);
            return;
          }

          const tags = tagData?.map((t) => t.tag_id) || [];
          console.log("Loaded tags:", tags);
          console.log("Tags length:", tags.length); // Log de la longitud de los tags
          console.log("Tags content:", tags.join(", ")); // Log del contenido de los tags

          // Reset form with webpage data
          form.reset({
            meta_title: webpage.meta_title || "",
            meta_description: webpage.meta_description || "",
            meta_keywords: webpage.meta_keywords || "",
            meta_altimage: webpage.meta_altimage || "",
            featured_image: webpage.featured_image || "",
            slug_url: webpage.slug_url || "",
            document_text: webpage.document_text || "",
            youtube_link: webpage.youtube_link || "",
            tiktok_link: webpage.tiktok_link || "",
            instagram_link: webpage.instagram_link || "",
            reddit_link: webpage.reddit_link || "",
            is_published: webpage.is_published || false,
            author: webpage.author || "",
            shcema_type: webpage.shcema_type || "",
            type: webpage.type || false,
            doc_type: webpage.doc_type || false,
            tags: tags,
          });
          
          console.log("Form reset with data");
          console.log("Form values after reset:", form.getValues()); // Log de los valores del formulario después del reset
        } catch (error) {
          console.error("Error loading webpage data:", error);
        }
      } else {
        // Si no hay webpage, resetear el formulario a valores por defecto
        console.log("Resetting form to default values");
        form.reset({
          meta_title: "",
          meta_description: "",
          meta_keywords: "",
          meta_altimage: "",
          featured_image: "",
          slug_url: "",
          document_text: "",
          youtube_link: "",
          tiktok_link: "",
          instagram_link: "",
          reddit_link: "",
          is_published: false,
          author: "",
          shcema_type: "",
          type: false,
          doc_type: false,
          tags: [],
        });
        console.log("Form values after reset to default:", form.getValues()); // Log de los valores del formulario después del reset a valores por defecto
      }
    }
    loadData();
  }, [webpage, form]);

  return { form };
}