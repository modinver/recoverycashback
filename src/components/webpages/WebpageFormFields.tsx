import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "./form/useWebpageForm";
import { ContentEditor } from "../articles/ContentEditor";

interface WebpageFormFieldsProps {
  form: UseFormReturn<FormData>;
}

export function WebpageFormFields({ form }: WebpageFormFieldsProps) {
  const handleImageUpload = (url: string) => {
    const currentContent = form.getValues("document_text");
    const imageMarkdown = `\n![Page Image](${url})`;
    form.setValue("document_text", currentContent + imageMarkdown);
  };

  return (
    <>
      <FormField
        control={form.control}
        name="meta_title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="meta_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Meta Description</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="slug_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL Slug</FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g., about-us" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <ContentEditor form={form} onImageUpload={handleImageUpload} />
      <FormField
        control={form.control}
        name="is_published"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Published</FormLabel>
              <FormMessage />
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
}