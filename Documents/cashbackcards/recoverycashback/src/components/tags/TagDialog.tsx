import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z.string().min(1, "Tag name is required"),
});

type FormData = z.infer<typeof formSchema>;

interface TagDialogProps {
  tag: Tables<"tags"> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function TagDialog({ tag, open, onOpenChange, onSuccess }: TagDialogProps) {
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (tag) {
      form.reset({
        name: tag.name,
      });
    } else {
      form.reset({
        name: "",
      });
    }
  }, [tag, form]);

  const onSubmit = async (data: FormData) => {
    try {
      if (tag) {
        const { error } = await supabase
          .from("tags")
          .update({ name: data.name })
          .eq("id", tag.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("tags").insert([{ name: data.name }]);
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Tag ${tag ? "updated" : "created"} successfully.`,
      });
      onSuccess();
    } catch (error) {
      console.error("Error saving tag:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Could not ${tag ? "update" : "create"} tag. Please try again.`,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{tag ? "Edit Tag" : "Create New Tag"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {tag ? "Update" : "Create"} Tag
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}