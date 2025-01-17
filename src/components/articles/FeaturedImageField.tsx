import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ImageUpload } from "./ImageUpload";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "./form/useArticleForm";

interface FeaturedImageFieldProps {
  form: UseFormReturn<FormData>;
  onImageUpload: (url: string, type: "featured" | "content") => void;
}

export function FeaturedImageField({ form, onImageUpload }: FeaturedImageFieldProps) {
  const handleRemoveFeaturedImage = () => {
    form.setValue("featured_image", null);
  };

  return (
    <FormField
      control={form.control}
      name="featured_image"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Featured Image</FormLabel>
          <FormControl>
            <div className="space-y-2">
              {field.value ? (
                <div className="relative inline-block">
                  <img
                    src={field.value}
                    alt="Featured"
                    className="max-w-xs rounded-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveFeaturedImage}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <ImageUpload
                  bucket="article-images"
                  onUploadComplete={(url) => onImageUpload(url, "featured")}
                />
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}