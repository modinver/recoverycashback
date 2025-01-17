import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import MDEditor from '@uiw/react-md-editor';
import { ImageUpload } from "./ImageUpload";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "./form/useArticleForm";

interface ContentEditorProps {
  form: UseFormReturn<FormData>;
  onImageUpload: (url: string, type: "featured" | "content") => void;
}

export function ContentEditor({ form, onImageUpload }: ContentEditorProps) {
  return (
    <FormField
      control={form.control}
      name="document_text"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Content</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <div data-color-mode="light">
                <MDEditor
                  value={field.value}
                  onChange={(value) => field.onChange(value || "")}
                  height={400}
                  preview="edit"
                />
              </div>
              <div className="flex items-center gap-2">
                <ImageUpload
                  bucket="article-images"
                  onUploadComplete={(url) => onImageUpload(url, "content")}
                />
                <span className="text-sm text-gray-500">
                  Upload images to include in the content
                </span>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}