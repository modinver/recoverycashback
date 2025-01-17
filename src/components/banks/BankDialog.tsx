import { useState } from "react";
import { Tables } from "@/integrations/supabase/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface BankDialogProps {
  bank: Tables<"banks"> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function BankDialog({ bank, open, onOpenChange, onSuccess }: BankDialogProps) {
  const [name, setName] = useState(bank?.name || "");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (bank) {
        // Update existing bank
        const { error } = await supabase
          .from("banks")
          .update({ name })
          .eq("id", bank.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Bank updated successfully.",
        });
      } else {
        // Create new bank
        const { error } = await supabase
          .from("banks")
          .insert([{ name }]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Bank created successfully.",
        });
      }

      onSuccess();
      setName("");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save bank. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{bank ? "Edit Bank" : "Add Bank"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Bank Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter bank name"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {bank ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}