import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { AuthorFormFields } from "./AuthorFormFields";
import { useAuthorForm } from "./useAuthorForm";

interface AuthorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  author?: any;
  onSuccess: () => void;
}

export function AuthorDialog({ open, onOpenChange, author, onSuccess }: AuthorDialogProps) {
  const { form, loading, onSubmit } = useAuthorForm(author, onSuccess);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{author ? "Edit Author" : "Add Author"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <AuthorFormFields form={form} />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {author ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}