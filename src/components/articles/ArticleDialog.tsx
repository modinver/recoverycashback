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

interface ArticleDialogProps {
  article: Tables<"blog_articles"> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ArticleDialog({
  article,
  open,
  onOpenChange,
  onSuccess,
}: ArticleDialogProps) {
  const form = useArticleForm(article);
  const { onSubmit } = useArticleSubmit({ article, onSuccess });

  const handleImageUpload = (url: string, type: "featured" | "content") => {
    if (type === "featured") {
      form.setValue("featured_image", url);
    } else {
      const currentContent = form.getValues("document_text");
      const imageMarkdown = `\n![Article Image](${url})`;
      form.setValue("document_text", currentContent + imageMarkdown);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {article ? "Edit Article" : "Create New Article"}
          </DialogTitle>
          <DialogDescription>
            Fill in the article details and manage its tags.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ArticleFormFields form={form} />
            <FeaturedImageField form={form} onImageUpload={handleImageUpload} />
            <ContentEditor form={form} onImageUpload={handleImageUpload} />
            <TagSelector form={form} articleId={article?.id} />
            <ArticleFormActions 
              onCancel={() => onOpenChange(false)} 
              isEditing={!!article} 
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}