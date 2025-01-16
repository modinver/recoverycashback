import { Tables } from "@/integrations/supabase/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

interface FAQTableProps {
  faqs: Tables<"faqs">[] | null;
  onEdit: (faq: Tables<"faqs">) => void;
  onDelete: (id: string) => void;
  onPublishToggle: (id: string, currentState: boolean) => void;
  onReorder: (id: string, direction: 'up' | 'down') => void;
}

export function FAQTable({ 
  faqs, 
  onEdit, 
  onDelete, 
  onPublishToggle,
  onReorder 
}: FAQTableProps) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Question</TableHead>
            <TableHead>Published</TableHead>
            <TableHead className="w-[150px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {faqs?.map((faq) => (
            <TableRow key={faq.id}>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onReorder(faq.id, 'up')}
                  >
                    <ArrowUpCircle className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onReorder(faq.id, 'down')}
                  >
                    <ArrowDownCircle className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell>{faq.question}</TableCell>
              <TableCell>
                <Switch
                  checked={faq.is_published}
                  onCheckedChange={() => onPublishToggle(faq.id, faq.is_published)}
                />
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(faq)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(faq.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}