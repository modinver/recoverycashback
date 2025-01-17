import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "@/components/articles/ImageUpload";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthorFormData {
  name: string;
  bio?: string;
  avatar_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  website_url?: string;
}

interface AuthorFormFieldsProps {
  form: UseFormReturn<AuthorFormData>;
}

export function AuthorFormFields({ form }: AuthorFormFieldsProps) {
  const handleImageUpload = (url: string) => {
    form.setValue("avatar_url", url);
  };

  const handleImageDelete = async () => {
    try {
      if (!form.getValues("avatar_url")) return;

      const filePath = form.getValues("avatar_url").split("/").pop();
      if (!filePath) return;

      const { error } = await supabase.storage
        .from("author-avatars")
        .remove([filePath]);

      if (error) throw error;

      form.setValue("avatar_url", "");
      toast.success("Image deleted successfully");
    } catch (error: any) {
      toast.error("Error deleting image");
    }
  };

  return (
    <div className="space-y-4">
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
      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bio</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="avatar_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Avatar</FormLabel>
            <div className="flex items-center gap-4">
              {field.value && (
                <div className="relative w-20 h-20">
                  <img
                    src={field.value}
                    alt="Author avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={handleImageDelete}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <ImageUpload
                bucket="author-avatars"
                onUploadComplete={handleImageUpload}
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="twitter_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Twitter URL</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="linkedin_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>LinkedIn URL</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="website_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website URL</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}