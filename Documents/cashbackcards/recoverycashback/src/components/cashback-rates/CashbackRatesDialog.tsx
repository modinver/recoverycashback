import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  card_id: z.string().min(1, "Please select a card"),
  supermarket_rate: z.string().optional(),
  international_rate: z.string().optional(),
  online_rate: z.string().optional(),
  other_rate: z.string().optional(),
  cinema_rate: z.string().optional(),
  dining_rate: z.string().optional(),
  government_rate: z.string().optional(),
  real_estate_rate: z.string().optional(),
  education_rate: z.string().optional(),
  fuel_rate: z.string().optional(),
  rental_rate: z.string().optional(),
  telecom_rate: z.string().optional(),
  insurance_rate: z.string().optional(),
  utility_rate: z.string().optional(),
  travel_rate: z.string().optional(),
  min_spend: z.string().optional(),
  max_cashback: z.string().optional(),
  redemption_method: z.string().optional(),
  additional_info: z.string().optional(),
});

interface CashbackRatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  cardId?: string;
  rate?: Tables<"cashback_rates">;
  cardName?: string;
}

export function CashbackRatesDialog({
  open,
  onOpenChange,
  onSuccess,
  cardId,
  rate,
  cardName,
}: CashbackRatesDialogProps) {
  const { toast } = useToast();

  // Fetch available cards
  const { data: cards } = useQuery({
    queryKey: ["credit-cards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("credit_cards")
        .select("id, card_name")
        .order("card_name");

      if (error) throw error;
      return data;
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      card_id: cardId || "",
      supermarket_rate: "",
      international_rate: "",
      online_rate: "",
      other_rate: "",
      cinema_rate: "",
      dining_rate: "",
      government_rate: "",
      real_estate_rate: "",
      education_rate: "",
      fuel_rate: "",
      rental_rate: "",
      telecom_rate: "",
      insurance_rate: "",
      utility_rate: "",
      travel_rate: "",
      min_spend: "",
      max_cashback: "",
      redemption_method: "",
      additional_info: "",
    },
  });

  useEffect(() => {
    if (rate) {
      form.reset({
        card_id: rate.card_id || "",
        supermarket_rate: rate.supermarket_rate?.toString() || "",
        international_rate: rate.international_rate?.toString() || "",
        online_rate: rate.online_rate?.toString() || "",
        other_rate: rate.other_rate?.toString() || "",
        cinema_rate: rate.cinema_rate?.toString() || "",
        dining_rate: rate.dining_rate?.toString() || "",
        government_rate: rate.government_rate?.toString() || "",
        real_estate_rate: rate.real_estate_rate?.toString() || "",
        education_rate: rate.education_rate?.toString() || "",
        fuel_rate: rate.fuel_rate?.toString() || "",
        rental_rate: rate.rental_rate?.toString() || "",
        telecom_rate: rate.telecom_rate?.toString() || "",
        insurance_rate: rate.insurance_rate?.toString() || "",
        utility_rate: rate.utility_rate?.toString() || "",
        travel_rate: rate.travel_rate?.toString() || "",
        min_spend: rate.min_spend?.toString() || "",
        max_cashback: rate.max_cashback?.toString() || "",
        redemption_method: rate.redemption_method || "",
        additional_info: rate.additional_info || "",
      });
    } else {
      form.reset({
        card_id: cardId || "",
        supermarket_rate: "",
        international_rate: "",
        online_rate: "",
        other_rate: "",
        cinema_rate: "",
        dining_rate: "",
        government_rate: "",
        real_estate_rate: "",
        education_rate: "",
        fuel_rate: "",
        rental_rate: "",
        telecom_rate: "",
        insurance_rate: "",
        utility_rate: "",
        travel_rate: "",
        min_spend: "",
        max_cashback: "",
        redemption_method: "",
        additional_info: "",
      });
    }
  }, [rate, cardId, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const numericValues = {
      card_id: values.card_id,
      supermarket_rate: values.supermarket_rate ? parseFloat(values.supermarket_rate) : null,
      international_rate: values.international_rate ? parseFloat(values.international_rate) : null,
      online_rate: values.online_rate ? parseFloat(values.online_rate) : null,
      other_rate: values.other_rate ? parseFloat(values.other_rate) : null,
      cinema_rate: values.cinema_rate ? parseFloat(values.cinema_rate) : null,
      dining_rate: values.dining_rate ? parseFloat(values.dining_rate) : null,
      government_rate: values.government_rate ? parseFloat(values.government_rate) : null,
      real_estate_rate: values.real_estate_rate ? parseFloat(values.real_estate_rate) : null,
      education_rate: values.education_rate ? parseFloat(values.education_rate) : null,
      fuel_rate: values.fuel_rate ? parseFloat(values.fuel_rate) : null,
      rental_rate: values.rental_rate ? parseFloat(values.rental_rate) : null,
      telecom_rate: values.telecom_rate ? parseFloat(values.telecom_rate) : null,
      insurance_rate: values.insurance_rate ? parseFloat(values.insurance_rate) : null,
      utility_rate: values.utility_rate ? parseFloat(values.utility_rate) : null,
      travel_rate: values.travel_rate ? parseFloat(values.travel_rate) : null,
      min_spend: values.min_spend ? parseFloat(values.min_spend) : null,
      max_cashback: values.max_cashback ? parseFloat(values.max_cashback) : null,
      redemption_method: values.redemption_method || null,
      additional_info: values.additional_info || null,
    };

    if (rate) {
      const { error } = await supabase
        .from("cashback_rates")
        .update(numericValues)
        .eq("id", rate.id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not update cashback rates. Please try again.",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Cashback rates updated successfully.",
      });
    } else {
      const { error } = await supabase.from("cashback_rates").insert(numericValues);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not create cashback rates. Please try again.",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Cashback rates created successfully.",
      });
    }

    onSuccess();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {rate ? "Edit" : "Add"} Cashback Rates {cardName && `for ${cardName}`}
          </DialogTitle>
          <DialogDescription>
            Manage cashback rates for this credit card. All rates should be entered as percentages.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {!rate && (
              <FormField
                control={form.control}
                name="card_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Credit Card</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a credit card" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cards?.map((card) => (
                          <SelectItem key={card.id} value={card.id}>
                            {card.card_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="supermarket_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supermarket Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="international_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>International Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="online_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Online Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="other_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cinema_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cinema Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dining_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dining Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="government_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Government Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="real_estate_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Real Estate Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="education_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fuel_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fuel Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rental_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rental Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telecom_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telecom Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="insurance_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insurance Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="utility_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Utility Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="travel_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Travel Rate (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="min_spend"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Spend (AED)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="max_cashback"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Cashback (AED)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="redemption_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Redemption Method</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="additional_info"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              {rate ? "Update Cashback Rates" : "Add Cashback Rates"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}