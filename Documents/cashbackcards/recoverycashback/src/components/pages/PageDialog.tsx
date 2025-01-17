import { Tables } from "@/integrations/supabase/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { usePageForm } from "./form/usePageForm";
import { usePageSubmit } from "./form/usePageSubmit";
import { PageFormFields } from "./PageFormFields";
import { PageFormActions } from "./form/PageFormActions";

interface PageDialogProps {
  page: Tables<"webpages"> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function PageDialog({
  page,
  open,
  onOpenChange,
  onSuccess,
}: PageDialogProps) {
  const form = usePageForm(page);
  const { onSubmit } = usePageSubmit({ page, onSuccess });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-3xl max-h-[90vh] overflow-y-auto"
        aria-labelledby="page-dialog-title"
        aria-describedby="page-dialog-description"
      >
        <DialogHeader>
          <DialogTitle id="page-dialog-title">
            {page ? "Edit Page" : "Create New Page"}
          </DialogTitle>
          <DialogDescription id="page-dialog-description">
            Fill in the page details below. All fields are required.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <PageFormFields form={form} />
            <PageFormActions 
              onCancel={() => onOpenChange(false)} 
              isEditing={!!page} 
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}