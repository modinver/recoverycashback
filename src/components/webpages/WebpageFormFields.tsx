import { UseFormReturn } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MarkdownEditor } from "./form/MarkdownEditor";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Youtube, Instagram, MessageCircle, Share2 } from "lucide-react";
import { FormData } from "./form/useWebpageForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { ImageUploader } from "./form/ImageUploader";

interface WebpageFormFieldsProps {
  form: UseFormReturn<FormData>;
  onImageUpload: (file: File) => Promise<string>;
}

export function WebpageFormFields({ form, onImageUpload }: WebpageFormFieldsProps) {
  const { data: authors } = useQuery({
    queryKey: ["authors"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: tags } = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  return (
    <Form {...form}>
      <div className="max-h-[calc(100vh-8rem)] overflow-y-auto px-4">
        <div className="space-y-4 max-w-7xl mx-auto pb-4">
          {/* Content Section - Full Width */}
          <Card className="border-blue-100 shadow-sm">
            <CardHeader className="bg-blue-50/50 py-3">
              <CardTitle className="text-blue-800 text-lg">Content</CardTitle>
              <CardDescription>Write and edit your page content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-3">
              <FormField
                control={form.control}
                name="document_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Content</FormLabel>
                    <FormControl>
                      <MarkdownEditor
                        value={field.value}
                        onChange={(value) => field.onChange(value || '')}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Write your content using Markdown. Use the preview tab to see how it looks.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <Card className="border-blue-100 shadow-sm">
              <CardHeader className="bg-blue-50/50 py-3">
                <CardTitle className="text-blue-800 text-lg">Basic Information</CardTitle>
                <CardDescription>Essential details about the webpage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-3">
                <FormField
                  control={form.control}
                  name="meta_title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Page title" {...field} />
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
                      <FormLabel className="text-sm">URL Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="page-url-slug" {...field} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        The URL-friendly version of the title
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* SEO & Meta */}
            <Card className="border-green-100 shadow-sm">
              <CardHeader className="bg-green-50/50 py-3">
                <CardTitle className="text-green-800 text-lg">SEO & Meta</CardTitle>
                <CardDescription>Search engine optimization settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-3">
                <FormField
                  control={form.control}
                  name="meta_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Meta Description</FormLabel>
                      <FormControl>
                        <Input placeholder="SEO description" {...field} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        A brief description of the page for search engines
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="meta_keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Meta Keywords</FormLabel>
                      <FormControl>
                        <Input placeholder="Comma separated keywords" {...field} />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Keywords that help search engines understand your content
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Media & Social */}
            <Card className="border-purple-100 shadow-sm">
              <CardHeader className="bg-purple-50/50 py-3">
                <CardTitle className="text-purple-800 text-lg">Media & Social</CardTitle>
                <CardDescription>Upload or select the main image for this page</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <FormField
                  control={form.control}
                  name="featured_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUploader
                          value={field.value || ''}
                          onChange={field.onChange}
                          label="Featured Image"
                          description="This image will be displayed at the top of your page and in social media shares"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Alt Text Field */}
                {form.watch("featured_image") && (
                  <FormField
                    control={form.control}
                    name="meta_altimage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Image Alt Text</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Describe the image for SEO and accessibility" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          A text description of the image for accessibility and SEO
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="border-purple-100 shadow-sm">
              <CardHeader className="bg-purple-50/50 py-3">
                <CardTitle className="text-purple-800 text-lg">Social Media</CardTitle>
                <CardDescription>Connect your social media profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-3">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="youtube_link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Youtube className="h-4 w-4 text-red-600" />
                          YouTube
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="YouTube channel URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="instagram_link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Instagram className="h-4 w-4 text-pink-600" />
                          Instagram
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Instagram profile URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tiktok_link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Share2 className="h-4 w-4" />
                          TikTok
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="TikTok profile URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reddit_link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 text-orange-600" />
                          Reddit
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Reddit profile URL" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Publishing */}
            <Card className="border-amber-100 shadow-sm">
              <CardHeader className="bg-amber-50/50 py-3">
                <CardTitle className="text-amber-800 text-lg">Publishing</CardTitle>
                <CardDescription>Configure webpage properties</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Author Selection */}
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Author</FormLabel>
                        <Select
                          value={field.value?.toString() || ""}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select author" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {authors?.map((author) => (
                              <SelectItem key={author.id} value={author.id.toString()}>
                                {author.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* SEO Schema */}
                  <FormField
                    control={form.control}
                    name="shcema_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">SEO Schema</FormLabel>
                        <Select
                          value={field.value || ""}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select schema" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="article">Article</SelectItem>
                            <SelectItem value="webpage">Webpage</SelectItem>
                            <SelectItem value="product">Product</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Page Type Switch */}
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">Page Type</FormLabel>
                          <FormDescription className="text-xs">
                            SSG (static) / ISR (incremental)
                          </FormDescription>
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

                  {/* Document Type Switch */}
                  <FormField
                    control={form.control}
                    name="doc_type"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel className="text-sm">Document Type</FormLabel>
                          <FormDescription className="text-xs">
                            Page / Article
                          </FormDescription>
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
                </div>

                {/* Tags Selection */}
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Tags</FormLabel>
                      <Select
                        value={field.value?.toString() || ""}
                        onValueChange={(value) => {
                          const currentTags = field.value || [];
                          if (!currentTags.includes(value)) {
                            field.onChange([...currentTags, value]);
                          }
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tags" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tags?.map((tag) => (
                            <SelectItem key={tag.id} value={tag.id.toString()}>
                              {tag.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {field.value?.map((tagId) => {
                          const tag = tags?.find((t) => t.id.toString() === tagId.toString());
                          return tag ? (
                            <Badge
                              key={tag.id}
                              variant="secondary"
                              className="flex items-center gap-1"
                            >
                              {tag.name}
                              <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => {
                                  field.onChange(
                                    field.value?.filter((id) => id.toString() !== tag.id.toString())
                                  );
                                }}
                              />
                            </Badge>
                          ) : null;
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Published Switch */}
                <FormField
                  control={form.control}
                  name="is_published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm">Published</FormLabel>
                        <FormDescription className="text-xs">
                          Make this page visible to the public
                        </FormDescription>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Form>
  );
}