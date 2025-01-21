import { Database } from "@/types/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { WebpageFormFields } from "./WebpageFormFields";
import { WebpageFormActions } from "./form/WebpageFormActions";
import { useWebpageForm } from "./form/useWebpageForm";
import { useWebpageSubmit } from "./form/useWebpageSubmit";
import { useEffect } from "react";

type Webpage = Database['public']['Tables']['webpages']['Row'];

interface WebpageDialogProps {
  webpage: Webpage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function WebpageDialog({
  webpage,
  open,
  onOpenChange,
  onSuccess,
}: WebpageDialogProps) {
  const { form, handleImageUpload } = useWebpageForm({
    id: webpage?.id,
    defaultValues: webpage ? {
      title: webpage.title,
      content: webpage.content,
      published: webpage.published,
      image_url: webpage.image_url,
      tags: []
    } : undefined
  });
  const { onSubmit } = useWebpageSubmit({ webpage, onSuccess });

  // Reiniciar el formulario cuando se cierra el diálogo
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {webpage ? "Edit Web Page" : "Create New Web Page"}
          </DialogTitle>
          <DialogDescription>
            Fill in the webpage details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-4"
          >
            <div className="space-y-4">
              <WebpageFormFields 
                form={form} 
                onImageUpload={handleImageUpload}
              />
              <WebpageFormActions 
                onCancel={() => onOpenChange(false)} 
                isEditing={!!webpage}
                isSubmitting={form.formState.isSubmitting} 
              />
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}