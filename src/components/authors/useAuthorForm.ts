import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AuthorFormData {
  name: string;
  bio?: string;
  avatar_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  website_url?: string;
}

export function useAuthorForm(author: any, onSuccess: () => void) {
  const [loading, setLoading] = useState(false);
  const form = useForm<AuthorFormData>({
    defaultValues: {
      name: "",
      bio: "",
      avatar_url: "",
      twitter_url: "",
      linkedin_url: "",
      website_url: "",
    },
  });

  useEffect(() => {
    if (author) {
      form.reset({
        name: author.name,
        bio: author.bio || "",
        avatar_url: author.avatar_url || "",
        twitter_url: author.twitter_url || "",
        linkedin_url: author.linkedin_url || "",
        website_url: author.website_url || "",
      });
    } else {
      form.reset({
        name: "",
        bio: "",
        avatar_url: "",
        twitter_url: "",
        linkedin_url: "",
        website_url: "",
      });
    }
  }, [author, form]);

  async function onSubmit(data: AuthorFormData) {
    try {
      setLoading(true);
      
      if (author?.id) {
        const { error } = await supabase
          .from("authors")
          .update(data)
          .eq("id", author.id);
        
        if (error) throw error;
        toast.success("Author updated successfully");
      } else {
        const { error } = await supabase
          .from("authors")
          .insert(data);
        
        if (error) throw error;
        toast.success("Author created successfully");
      }
      
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return {
    form,
    loading,
    onSubmit: form.handleSubmit(onSubmit),
  };
}