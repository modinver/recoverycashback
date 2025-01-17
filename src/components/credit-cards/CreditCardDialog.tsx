import React, { useState, useEffect } from "react";
import { Tables } from "@/integrations/supabase/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

// Helper function to format currency in AED
const formatAED = (amount: number | null | undefined) => {
  if (amount == null) return "";
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper function to parse AED formatted string back to number
const parseAED = (value: string): number | null => {
  if (!value) return null;
  // Remove currency symbol, commas, and spaces
  const cleanValue = value.replace(/[^0-9.-]+/g, "");
  const number = parseFloat(cleanValue);
  return isNaN(number) ? null : number;
};

interface CreditCardDialogProps {
  card: Tables<"credit_cards"> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreditCardDialog({ card, open, onOpenChange, onSuccess }: CreditCardDialogProps) {
  const [bankId, setBankId] = useState(card?.bank_id || "");
  const [cardName, setCardName] = useState(card?.card_name || "");
  const [minimumSalary, setMinimumSalary] = useState(card?.minimum_salary ? formatAED(card.minimum_salary) : "");
  const [joiningOffer, setJoiningOffer] = useState(card?.joining_offer || "");
  const [annualFee, setAnnualFee] = useState(card?.annual_fee || "");
  const [monthlyRetailApr, setMonthlyRetailApr] = useState(card?.monthly_retail_apr?.toString() || "");
  const [cashApr, setCashApr] = useState(card?.cash_apr?.toString() || "");
  const [cashAdvanceFee, setCashAdvanceFee] = useState(card?.cash_advance_fee || "");
  const [foreignTransactionFee, setForeignTransactionFee] = useState(card?.foreign_transaction_fee || "");
  const [lateFee, setLateFee] = useState(card?.late_fee ? formatAED(card.late_fee) : "");
  const [overlimitFee, setOverlimitFee] = useState(card?.overlimit_fee || "");
  const [minimumDue, setMinimumDue] = useState(card?.minimum_due || "");
  const [otherKeyBenefits, setOtherKeyBenefits] = useState(card?.other_key_benefits || "");
  const [offers, setOffers] = useState(card?.offers || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(card?.image_url || "");
  const [isPromotion, setIsPromotion] = useState(card?.is_promotion || false);
  const [isCashbackCard, setIsCashbackCard] = useState(card?.cashback_card || false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Reset form when dialog opens with new data
  useEffect(() => {
    if (open && card) {
      setBankId(card.bank_id || "");
      setCardName(card.card_name || "");
      setMinimumSalary(card.minimum_salary ? formatAED(card.minimum_salary) : "");
      setJoiningOffer(card.joining_offer || "");
      setAnnualFee(card.annual_fee || "");
      setMonthlyRetailApr(card.monthly_retail_apr?.toString() || "");
      setCashApr(card.cash_apr?.toString() || "");
      setCashAdvanceFee(card.cash_advance_fee || "");
      setForeignTransactionFee(card.foreign_transaction_fee || "");
      setLateFee(card.late_fee ? formatAED(card.late_fee) : "");
      setOverlimitFee(card.overlimit_fee || "");
      setMinimumDue(card.minimum_due || "");
      setOtherKeyBenefits(card.other_key_benefits || "");
      setOffers(card.offers || "");
      setPreviewUrl(card.image_url || "");
      setIsPromotion(card.is_promotion || false);
      setIsCashbackCard(card.cashback_card || false);
      setImageFile(null);
    } else if (open) {
      // Reset form for new card
      setBankId("");
      setCardName("");
      setMinimumSalary("");
      setJoiningOffer("");
      setAnnualFee("");
      setMonthlyRetailApr("");
      setCashApr("");
      setCashAdvanceFee("");
      setForeignTransactionFee("");
      setLateFee("");
      setOverlimitFee("");
      setMinimumDue("");
      setOtherKeyBenefits("");
      setOffers("");
      setPreviewUrl("");
      setIsPromotion(false);
      setIsCashbackCard(false);
      setImageFile(null);
    }
  }, [open, card]);

  const { data: banks } = useQuery({
    queryKey: ["banks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("banks")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('card-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('card-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = card?.image_url;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const data = {
        bank_id: bankId || null,
        card_name: cardName,
        minimum_salary: parseAED(minimumSalary),
        joining_offer: joiningOffer || null,
        annual_fee: annualFee || null,
        monthly_retail_apr: monthlyRetailApr ? parseFloat(monthlyRetailApr) : null,
        cash_apr: cashApr ? parseFloat(cashApr) : null,
        cash_advance_fee: cashAdvanceFee || null,
        foreign_transaction_fee: foreignTransactionFee || null,
        late_fee: parseAED(lateFee),
        overlimit_fee: overlimitFee || null,
        minimum_due: minimumDue || null,
        other_key_benefits: otherKeyBenefits || null,
        offers: offers || null,
        image_url: imageUrl,
        is_promotion: isPromotion,
        cashback_card: isCashbackCard,
      };

      if (card) {
        const { error } = await supabase
          .from("credit_cards")
          .update(data)
          .eq("id", card.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Credit card updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from("credit_cards")
          .insert([data]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Credit card created successfully.",
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save credit card. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{card ? "Edit Credit Card" : "Add Credit Card"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bank">Bank</Label>
              <Select value={bankId} onValueChange={setBankId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a bank" />
                </SelectTrigger>
                <SelectContent>
                  {banks?.map((bank) => (
                    <SelectItem key={bank.id} value={bank.id}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardName">Card Name</Label>
              <Input
                id="cardName"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Enter card name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimumSalary">Minimum Salary (AED)</Label>
              <Input
                id="minimumSalary"
                value={minimumSalary}
                onChange={(e) => {
                  const value = e.target.value;
                  const number = parseAED(value);
                  if (number !== null) {
                    setMinimumSalary(formatAED(number));
                  } else {
                    setMinimumSalary(value);
                  }
                }}
                placeholder="Enter minimum salary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="joiningOffer">Joining Offer</Label>
              <Input
                id="joiningOffer"
                value={joiningOffer}
                onChange={(e) => setJoiningOffer(e.target.value)}
                placeholder="Enter joining offer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="annualFee">Annual Fee</Label>
              <Input
                id="annualFee"
                value={annualFee}
                onChange={(e) => setAnnualFee(e.target.value)}
                placeholder="Enter annual fee"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyRetailApr">Monthly Retail APR (%)</Label>
              <Input
                id="monthlyRetailApr"
                type="number"
                step="0.01"
                value={monthlyRetailApr}
                onChange={(e) => setMonthlyRetailApr(e.target.value)}
                placeholder="Enter monthly retail APR"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cashApr">Cash APR (%)</Label>
              <Input
                id="cashApr"
                type="number"
                step="0.01"
                value={cashApr}
                onChange={(e) => setCashApr(e.target.value)}
                placeholder="Enter cash APR"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cashAdvanceFee">Cash Advance Fee</Label>
              <Input
                id="cashAdvanceFee"
                value={cashAdvanceFee}
                onChange={(e) => setCashAdvanceFee(e.target.value)}
                placeholder="Enter cash advance fee"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="foreignTransactionFee">Foreign Transaction Fee</Label>
              <Input
                id="foreignTransactionFee"
                value={foreignTransactionFee}
                onChange={(e) => setForeignTransactionFee(e.target.value)}
                placeholder="Enter foreign transaction fee"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lateFee">Late Fee (AED)</Label>
              <Input
                id="lateFee"
                value={lateFee}
                onChange={(e) => {
                  const value = e.target.value;
                  const number = parseAED(value);
                  if (number !== null) {
                    setLateFee(formatAED(number));
                  } else {
                    setLateFee(value);
                  }
                }}
                placeholder="Enter late fee"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="overlimitFee">Overlimit Fee</Label>
              <Input
                id="overlimitFee"
                value={overlimitFee}
                onChange={(e) => setOverlimitFee(e.target.value)}
                placeholder="Enter overlimit fee"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimumDue">Minimum Due</Label>
              <Input
                id="minimumDue"
                value={minimumDue}
                onChange={(e) => setMinimumDue(e.target.value)}
                placeholder="Enter minimum due"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_promotion"
                  checked={isPromotion}
                  onCheckedChange={(checked) => setIsPromotion(checked as boolean)}
                />
                <Label htmlFor="is_promotion">Promotion Card</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cashback_card"
                  checked={isCashbackCard}
                  onCheckedChange={(checked) => setIsCashbackCard(checked as boolean)}
                />
                <Label htmlFor="cashback_card">Is Cashback Card</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="otherKeyBenefits">Other Key Benefits</Label>
            <Textarea
              id="otherKeyBenefits"
              value={otherKeyBenefits}
              onChange={(e) => setOtherKeyBenefits(e.target.value)}
              placeholder="Enter other key benefits"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="offers">Offers</Label>
            <Textarea
              id="offers"
              value={offers}
              onChange={(e) => setOffers(e.target.value)}
              placeholder="Enter offers"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardImage">Card Image</Label>
            <div className="flex items-center gap-4">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Card preview"
                  className="w-40 h-24 object-contain rounded border"
                />
              )}
              <label className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-50">
                  <ImagePlus className="w-4 h-4" />
                  <span>Upload Image</span>
                </div>
                <input
                  type="file"
                  id="cardImage"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
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
              {card ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
