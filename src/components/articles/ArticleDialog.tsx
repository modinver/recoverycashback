import { Tables } from "@/integrations/supabase/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ArticleFormFields } from "./ArticleFormFields";
import { FeaturedImageField } from "./FeaturedImageField";
import { ContentEditor } from "./ContentEditor";
import { TagSelector } from "./TagSelector";
import { ArticleFormActions } from "./form/ArticleFormActions";
import { useArticleForm } from "./form/useArticleForm";
import { useArticleSubmit } from "./form/useArticleSubmit";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const articleSchema = z.object({
  meta_title: z.string().min(1, "El título es requerido"),
  meta_description: z.string().min(1, "La descripción es requerida"),
  meta_keywords: z.string(),
  meta_altimage: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
  document_text: z.string().min(1, "El contenido es requerido"),
  slug_url: z.string().min(1, "El slug es requerido"),
  is_published: z.boolean(),
});

type ArticleFormData = z.infer<typeof articleSchema>;

interface ArticleDialogProps {
  article: Tables<"webpages"> | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ArticleDialog({
  article,
  open,
  onClose,
  onSuccess,
}: ArticleDialogProps) {
  const form = useArticleForm(article);
  const { onSubmit } = useArticleSubmit({ article, onSuccess });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      is_published: false,
    },
  });

  useEffect(() => {
    if (article) {
      reset({
        meta_title: article.meta_title,
        meta_description: article.meta_description,
        meta_keywords: article.meta_keywords || "",
        meta_altimage: article.meta_altimage || "",
        document_text: article.document_text,
        slug_url: article.slug_url,
        is_published: article.is_published,
      });
    } else {
      reset({
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        meta_altimage: "",
        document_text: "",
        slug_url: "",
        is_published: false,
      });
    }
  }, [article, reset]);

  const handleImageUpload = (url: string, type: "featured" | "content") => {
    if (type === "featured") {
      setValue("meta_altimage", url);
    } else {
      const currentContent = register("document_text").value;
      const imageMarkdown = `\n![Article Image](${url})`;
      setValue("document_text", currentContent + imageMarkdown);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {article ? "Editar Artículo" : "Crear Artículo"}
          </DialogTitle>
          <DialogDescription>
            Fill in the article details and manage its tags.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="meta_title">Título</label>
              <input
                id="meta_title"
                {...register("meta_title")}
                placeholder="Título del artículo"
              />
              {errors.meta_title && (
                <p className="text-sm text-red-500">{errors.meta_title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="meta_description">Descripción</label>
              <textarea
                id="meta_description"
                {...register("meta_description")}
                placeholder="Descripción del artículo"
              />
              {errors.meta_description && (
                <p className="text-sm text-red-500">
                  {errors.meta_description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="meta_keywords">Keywords</label>
              <input
                id="meta_keywords"
                {...register("meta_keywords")}
                placeholder="Keywords separadas por comas"
              />
              {errors.meta_keywords && (
                <p className="text-sm text-red-500">{errors.meta_keywords.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="meta_altimage">Imagen</label>
              <input
                id="meta_altimage"
                {...register("meta_altimage")}
                placeholder="URL de la imagen"
              />
              {errors.meta_altimage && (
                <p className="text-sm text-red-500">{errors.meta_altimage.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="slug_url">Slug URL</label>
              <input
                id="slug_url"
                {...register("slug_url")}
                placeholder="slug-del-articulo"
              />
              {errors.slug_url && (
                <p className="text-sm text-red-500">{errors.slug_url.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="document_text">Contenido</label>
              <textarea
                id="document_text"
                {...register("document_text")}
                placeholder="Contenido del artículo en formato Markdown"
                className="min-h-[200px]"
              />
              {errors.document_text && (
                <p className="text-sm text-red-500">{errors.document_text.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="is_published"
                type="checkbox"
                checked={Boolean(register("is_published").value)}
                onChange={(e) => setValue("is_published", e.target.checked)}
              />
              <label htmlFor="is_published">Publicar</label>
            </div>

            <FeaturedImageField form={form} onImageUpload={handleImageUpload} />
            <ContentEditor form={form} onImageUpload={handleImageUpload} />
            <TagSelector form={form} articleId={article?.id} />
            <ArticleFormActions 
              onCancel={() => onClose()} 
              isEditing={!!article} 
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}