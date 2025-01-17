import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { CreditCard } from "@/integrations/supabase/types/database/card.types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus, ListPlus, Percent } from "lucide-react";
import { CreditCardDialog } from "@/components/credit-cards/CreditCardDialog";
import { CardBenefitsDialog } from "@/components/credit-cards/CardBenefitsDialog";
import { CashbackRatesDialog } from "@/components/cashback-rates/CashbackRatesDialog";
import { useToast } from "@/hooks/use-toast";
import { format, isValid, parseISO } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Helper function to format currency in AED
const formatAED = (amount: number | null | undefined) => {
  if (amount == null) return "-";
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
  }).format(amount);
};

// Helper function to safely format dates
const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return "-";
  try {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, "PPp") : "-";
  } catch {
    return "-";
  }
};

// ... keep existing code (component state and query definitions)

export default function CreditCards() {
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(
    null
  );
  const [selectedBenefit, setSelectedBenefit] = useState<
    Tables<"card_benefits"> | null
  >(null);
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
  const [isBenefitsDialogOpen, setIsBenefitsDialogOpen] = useState(false);
  const [selectedCardForBenefits, setSelectedCardForBenefits] = useState<
    string | null
  >(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);
  const [benefitToDelete, setBenefitToDelete] = useState<string | null>(null);
  const [isDeleteBenefitDialogOpen, setIsDeleteBenefitDialogOpen] = useState(false);
  const [selectedWebpage, setSelectedWebpage] = useState<string | null>(null);
  const [selectedCardForRates, setSelectedCardForRates] = useState<string | null>(
    null
  );
  const [selectedRate, setSelectedRate] = useState<Tables<"cashback_rates"> | null>(
    null
  );
  const [isRatesDialogOpen, setIsRatesDialogOpen] = useState(false);
  const [isDeleteRateDialogOpen, setIsDeleteRateDialogOpen] = useState(false);
  const [rateToDelete, setRateToDelete] = useState<string | null>(null);

  const { toast } = useToast();

  const { data: cards, refetch: refetchCards } = useQuery({
    queryKey: ["credit-cards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("credit_cards")
        .select(`
          *,
          bank:banks(name),
          webpage:webpages(id, meta_title)
        `)
        .order("card_name");

      if (error) throw error;
      
      return ((data || []) as unknown[]).map(card => {
        const typedCard = card as Partial<CreditCard>;
        return {
          ...typedCard,
          bank: typedCard.bank || null,
          webpage: typedCard.webpage || null,
        } as CreditCard;
      });
    },
  });

  const { data: benefits, refetch: refetchBenefits } = useQuery({
    queryKey: ["card-benefits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("card_benefits")
        .select("*")
        .order("created_at");

      if (error) throw error;
      return data;
    },
  });

  const { data: rates, refetch: refetchRates } = useQuery({
    queryKey: ["cashback-rates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cashback_rates")
        .select("*")
        .order("created_at");

      if (error) throw error;
      return data;
    },
  });

  const { data: webpages, refetch: refetchWebpages } = useQuery({
    queryKey: ["webpages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("webpages")
        .select("*")
        .order("title");

      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("credit_cards").delete().eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete credit card. Please try again.",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Credit card deleted successfully.",
    });
    refetchCards();
    setIsDeleteDialogOpen(false);
  };

  const handleEdit = (card: Tables<"credit_cards">) => {
    setSelectedCard(card as CreditCard);
    setIsCardDialogOpen(true);
  };

  const handleCreate = () => {
    setSelectedCard(null);
    setIsCardDialogOpen(true);
  };

  const handleManageBenefits = (cardId: string) => {
    setSelectedCardForBenefits(cardId);
    setSelectedBenefit(null);
    setIsBenefitsDialogOpen(true);
  };

  const handleAddBenefit = () => {
    if (cards && cards.length > 0) {
      setSelectedCardForBenefits(cards[0].id);
      setSelectedBenefit(null);
      setIsBenefitsDialogOpen(true);
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please add a credit card first before adding benefits.",
      });
    }
  };

  const handleEditBenefit = (benefit: Tables<"card_benefits">) => {
    setSelectedBenefit(benefit);
    setSelectedCardForBenefits(benefit.card_id!);
    setIsBenefitsDialogOpen(true);
  };

  const handleDeleteBenefit = async (id: string) => {
    const { error } = await supabase.from("card_benefits").delete().eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete benefit. Please try again.",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Benefit deleted successfully.",
    });
    refetchBenefits();
    setIsDeleteBenefitDialogOpen(false);
  };

  const handleManageRates = (cardId: string, cardName: string) => {
    setSelectedCardForRates(cardId);
    setSelectedRate(null);
    setIsRatesDialogOpen(true);
  };

  const handleEditRate = (rate: Tables<"cashback_rates">) => {
    setSelectedRate(rate);
    setSelectedCardForRates(rate.card_id!);
    setIsRatesDialogOpen(true);
  };

  const handleDeleteRate = async (id: string) => {
    const { error } = await supabase.from("cashback_rates").delete().eq("id", id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete cashback rate. Please try again.",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Cashback rate deleted successfully.",
    });
    refetchRates();
    setIsDeleteRateDialogOpen(false);
  };

  const handleWebpageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    setSelectedWebpage(selectedId);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Credit Cards</h1>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Credit Card
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Card Name</TableHead>
            <TableHead>Bank</TableHead>
            <TableHead>Minimum Salary</TableHead>
            <TableHead>Annual Fee</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Webpage</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cards?.map((card) => (
            <TableRow key={card.id}>
              <TableCell>{card.card_name}</TableCell>
              <TableCell>{card.bank?.name}</TableCell>
              <TableCell>{formatAED(card.minimum_salary)}</TableCell>
              <TableCell>{card.annual_fee || "-"}</TableCell>
              <TableCell>{card.cashback_card ? "Cashback Card" : "Credit Card"}</TableCell>
              <TableCell>{card.webpage?.meta_title || "-"}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(card)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setCardToDelete(card.id);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleManageBenefits(card.id)}
                >
                  <ListPlus className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleManageRates(card.id, card.card_name)}
                >
                  <Percent className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Card Benefits</h2>
          <Button onClick={handleAddBenefit}>
            <Plus className="w-4 h-4 mr-2" />
            Add Benefit
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {benefits?.map((benefit) => (
              <TableRow key={benefit.id}>
                <TableCell className="capitalize">{benefit.benefit_type}</TableCell>
                <TableCell>
                  <div className="whitespace-pre-line">{benefit.description}</div>
                </TableCell>
                <TableCell>{formatDate(benefit.created_at)}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditBenefit(benefit)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setBenefitToDelete(benefit.id);
                      setIsDeleteBenefitDialogOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Cashback Rates</h2>
          <Button onClick={() => {
            if (cards && cards.length > 0) {
              setSelectedCardForRates(cards[0].id);
              setSelectedRate(null);
              setIsRatesDialogOpen(true);
            } else {
              toast({
                variant: "destructive",
                title: "Error",
                description: "Please add a credit card first before adding cashback rates.",
              });
            }
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Cashback Rate
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Card</TableHead>
              <TableHead>Supermarket</TableHead>
              <TableHead>Dining</TableHead>
              <TableHead>Travel</TableHead>
              <TableHead>Online</TableHead>
              <TableHead>Min Spend</TableHead>
              <TableHead>Max Cashback</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rates?.map((rate) => {
              const card = cards?.find((c) => c.id === rate.card_id);
              return (
                <TableRow key={rate.id}>
                  <TableCell>{card?.card_name || "-"}</TableCell>
                  <TableCell>{rate.supermarket_rate ? `${rate.supermarket_rate}%` : "-"}</TableCell>
                  <TableCell>{rate.dining_rate ? `${rate.dining_rate}%` : "-"}</TableCell>
                  <TableCell>{rate.travel_rate ? `${rate.travel_rate}%` : "-"}</TableCell>
                  <TableCell>{rate.online_rate ? `${rate.online_rate}%` : "-"}</TableCell>
                  <TableCell>{formatAED(rate.min_spend)}</TableCell>
                  <TableCell>{formatAED(rate.max_cashback)}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditRate(rate)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setRateToDelete(rate.id);
                        setIsDeleteRateDialogOpen(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      <CreditCardDialog
        card={selectedCard}
        open={isCardDialogOpen}
        onOpenChange={setIsCardDialogOpen}
        onSuccess={() => {
          refetchCards();
          setIsCardDialogOpen(false);
        }}
      />

      {selectedCardForBenefits && (
        <CardBenefitsDialog
          cardId={selectedCardForBenefits}
          benefit={selectedBenefit}
          open={isBenefitsDialogOpen}
          onOpenChange={setIsBenefitsDialogOpen}
          onSuccess={() => {
            refetchBenefits();
            setIsBenefitsDialogOpen(false);
          }}
        />
      )}

      {selectedCardForRates && (
        <CashbackRatesDialog
          cardId={selectedCardForRates}
          rate={selectedRate}
          open={isRatesDialogOpen}
          onOpenChange={setIsRatesDialogOpen}
          onSuccess={() => {
            refetchRates();
            setIsRatesDialogOpen(false);
          }}
          cardName={cards?.find(c => c.id === selectedCardForRates)?.card_name}
        />
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              credit card.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => cardToDelete && handleDelete(cardToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isDeleteBenefitDialogOpen}
        onOpenChange={setIsDeleteBenefitDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              benefit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => benefitToDelete && handleDeleteBenefit(benefitToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isDeleteRateDialogOpen}
        onOpenChange={setIsDeleteRateDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              cashback rate.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => rateToDelete && handleDeleteRate(rateToDelete)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}