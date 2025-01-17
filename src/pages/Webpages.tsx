import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import { WebpageDialog } from "@/components/webpages/WebpageDialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import ReactMarkdown from 'react-markdown';

export default function Webpages() {
  const [selectedWebpage, setSelectedWebpage] = useState<Tables<"webpages"> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: webpages, refetch } = useQuery({
    queryKey: ["webpages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("webpages")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("webpages").delete().eq("id", id);
    
    if (error) {
      toast.error("Could not delete webpage. Please try again.");
      return;
    }
    
    toast.success("Webpage deleted successfully.");
    refetch();
  };

  const handleEdit = (webpage: Tables<"webpages">) => {
    setSelectedWebpage(webpage);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedWebpage(null);
    setIsDialogOpen(true);
  };

  const formatDate = (date: string | null | undefined) => {
    if (!date) return "-";
    try {
      return format(new Date(date), "PPp");
    } catch {
      return "-";
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Web Pages</h1>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Web Page
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Published At</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {webpages?.map((webpage) => (
            <TableRow key={webpage.id}>
              <TableCell>
                <Link 
                  to={`/${webpage.slug_url}`}
                  target="_blank"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                >
                  {webpage.meta_title}
                </Link>
              </TableCell>
              <TableCell>
                <Badge variant={webpage.is_published ? "default" : "secondary"}>
                  {webpage.is_published ? (
                    <Eye className="w-3 h-3 mr-1" />
                  ) : (
                    <EyeOff className="w-3 h-3 mr-1" />
                  )}
                  {webpage.is_published ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(webpage.created_at)}</TableCell>
              <TableCell>{formatDate(webpage.published_at)}</TableCell>
              <TableCell className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(webpage)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(webpage.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <WebpageDialog
        webpage={selectedWebpage}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={() => {
          refetch();
          setIsDialogOpen(false);
        }}
      />
      {selectedWebpage && (
        <div className="prose dark:prose-invert prose-slate prose-lg max-w-none mb-8">
          <ReactMarkdown
            components={{
              h2: ({node, ...props}) => (
                <h2 
                  className="text-3xl font-extralight text-purple-600 dark:text-purple-400 mt-12 mb-6 tracking-wider leading-relaxed border-b border-purple-100 dark:border-purple-900 pb-2"
                  {...props}
                />
              ),
              h3: ({node, ...props}) => (
                <h3 
                  className="text-2xl font-light text-gray-800 dark:text-gray-200 mt-8 mb-4 tracking-wide"
                  {...props}
                />
              ),
              p: ({node, ...props}) => (
                <p 
                  className="text-gray-700 dark:text-gray-300 leading-loose mb-6 text-lg font-light tracking-wide"
                  style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                  {...props}
                />
              ),
              a: ({node, ...props}) => (
                <a 
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-300 border-b border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600"
                  {...props}
                />
              ),
              ul: ({node, ...props}) => (
                <ul 
                  className="space-y-3 my-8 list-none pl-6"
                  {...props}
                />
              ),
              li: ({node, ...props}) => (
                <li 
                  className="flex items-start space-x-3 text-gray-700 dark:text-gray-300 leading-relaxed font-light before:content-['•'] before:text-purple-500 dark:before:text-purple-400 before:inline-block before:w-4 before:flex-shrink-0 before:font-normal"
                  {...props}
                />
              ),
              blockquote: ({node, ...props}) => (
                <blockquote 
                  className="pl-6 border-l-4 border-purple-200 dark:border-purple-800 italic my-8 text-gray-600 dark:text-gray-400 bg-purple-50 dark:bg-purple-900/10 py-4 pr-4 rounded-r-lg"
                  {...props}
                />
              ),
              img: ({node, ...props}) => (
                <img 
                  className="rounded-xl shadow-lg my-10 w-full hover:shadow-xl transition-shadow duration-300"
                  {...props}
                />
              ),
              code: ({node, className, children, ...props}) => {
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !match;
                return isInline ? (
                  <code 
                    className="bg-purple-50 dark:bg-purple-900/20 px-2 py-0.5 rounded-md text-sm text-purple-700 dark:text-purple-300 font-normal"
                    {...props}
                  >
                    {children}
                  </code>
                ) : (
                  <code 
                    className="block bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg overflow-x-auto my-6 shadow-sm"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
            }}
          >
            {selectedWebpage.document_text}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}