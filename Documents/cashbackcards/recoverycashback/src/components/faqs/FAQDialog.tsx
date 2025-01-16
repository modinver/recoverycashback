import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
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
import MDEditor from "@uiw/react-md-editor";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";

const formSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

type FormData = z.infer<typeof formSchema>;

interface FAQDialogProps {
  faq: Tables<"faqs"> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function FAQDialog({ faq, open, onOpenChange, onSuccess }: FAQDialogProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
      answer: "",
    },
  });

  useEffect(() => {
    if (faq) {
      form.reset({
        question: faq.question,
        answer: faq.answer,
      });
    } else {
      form.reset({
        question: "",
        answer: "",
      });
    }
  }, [faq, form]);

  const onSubmit = async (data: FormData) => {
    try {
      if (faq) {
        const { error } = await supabase
          .from("faqs")
          .update({
            question: data.question,
            answer: data.answer,
          })
          .eq("id", faq.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("faqs").insert([{
          question: data.question,
          answer: data.answer,
        }]);
        if (error) throw error;
      }

      toast.success(`FAQ ${faq ? "updated" : "created"} successfully`);
      onSuccess();
    } catch (error) {
      console.error("Error saving FAQ:", error);
      toast.error(`Could not ${faq ? "update" : "create"} FAQ. Please try again.`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{faq ? "Edit FAQ" : "Create New FAQ"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer</FormLabel>
                  <Tabs defaultValue="edit" className="w-full">
                    <TabsList>
                      <TabsTrigger value="edit">Edit</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    <TabsContent value="edit">
                      <FormControl>
                        <MDEditor
                          value={field.value}
                          onChange={(value) => field.onChange(value || "")}
                          preview="edit"
                          height={300}
                        />
                      </FormControl>
                    </TabsContent>
                    <TabsContent value="preview" className="min-h-[300px] p-4 border rounded-md">
                      <ReactMarkdown>{field.value}</ReactMarkdown>
                    </TabsContent>
                  </Tabs>
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
                {faq ? "Update" : "Create"} FAQ
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}