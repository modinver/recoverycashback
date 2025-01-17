import { Tables } from "@/integrations/supabase/types";
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

interface WebpageDialogProps {
  webpage: Tables<"webpages"> | null;
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
  const form = useWebpageForm(webpage);
  const { onSubmit } = useWebpageSubmit({ webpage, onSuccess });

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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <WebpageFormFields form={form} />
            <WebpageFormActions 
              onCancel={() => onOpenChange(false)} 
              isEditing={!!webpage} 
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}