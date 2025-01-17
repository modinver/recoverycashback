import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  benefit_type: z.enum(["benefit", "offer"]),
  description: z.string().min(1, "Description is required"),
});

type FormData = z.infer<typeof formSchema>;

interface CardBenefitsDialogProps {
  cardId: string;
  benefit?: Tables<"card_benefits">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CardBenefitsDialog({
  cardId,
  benefit,
  open,
  onOpenChange,
  onSuccess,
}: CardBenefitsDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      benefit_type: benefit?.benefit_type || "benefit",
      description: benefit?.description || "",
    },
  });

  // Reset form when dialog opens with new data
  React.useEffect(() => {
    if (open && benefit) {
      form.reset({
        benefit_type: benefit.benefit_type,
        description: benefit.description,
      });
    } else if (open) {
      form.reset({
        benefit_type: "benefit",
        description: "",
      });
    }
  }, [open, benefit, form]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      if (benefit) {
        const { error } = await supabase
          .from("card_benefits")
          .update({
            benefit_type: data.benefit_type,
            description: data.description,
            updated_at: new Date().toISOString(),
          })
          .eq("id", benefit.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Benefit updated successfully",
        });
      } else {
        const { error } = await supabase.from("card_benefits").insert({
          card_id: cardId,
          benefit_type: data.benefit_type,
          description: data.description,
        });

        if (error) throw error;
        toast({
          title: "Success",
          description: "Benefit created successfully",
        });
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving benefit:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save benefit. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {benefit ? "Edit Benefit" : "Add New Benefit"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="benefit_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select benefit type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="benefit">Benefit</SelectItem>
                      <SelectItem value="offer">Offer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter benefit description..."
                      {...field}
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}