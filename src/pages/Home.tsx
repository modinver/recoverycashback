import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Helmet } from "react-helmet";
import { useState } from "react";
import { BlogArticlesList } from "@/components/blog/BlogArticlesList";
import { HeroSection } from "@/components/home/HeroSection";
import { PromotedCards } from "@/components/home/PromotedCards";
import { ComparisonSection } from "@/components/home/ComparisonSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { FAQSection } from "@/components/home/FAQSection";
import { FooterSection } from "@/components/home/FooterSection";
import { NavMenu } from "@/components/navigation/NavMenu";
import { CreditCard, SupabaseCreditCardResponse } from "@/integrations/supabase/types/database/card.types";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [minSalary, setMinSalary] = useState<string>("");

  // Función para convertir la respuesta de Supabase al tipo CreditCard
  const convertToCreditCard = (data: any[]): CreditCard[] => {
    console.log("Raw data from Supabase:", data);
    const converted = data.map(card => ({
      ...card,
      bank: card.bank || null,
      webpage: card.webpage || null,
      cashback_rates: card.cashback_rates || [],
      card_benefits: card.card_benefits || []
    }));
    console.log("Converted data:", converted);
    return converted;
  };

  // Fetch promoted credit cards
  const { data: promotedCards, isLoading: isLoadingPromoted, error: promotedError } = useQuery<CreditCard[]>({
    queryKey: ["promoted-cards"],
    queryFn: async () => {
      console.log("Fetching promoted cards...");
      const { data, error } = await supabase
        .from("credit_cards")
        .select(`
          *,
          bank:banks(name),
          cashback_rates(*),
          card_benefits(*),
          webpage:webpages(id, meta_title, slug_url)
        `)
        .eq("is_promotion", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching promoted cards:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.log("No promoted cards found in database");
        return [];
      }

      console.log(`Found ${data.length} promoted cards:`, data);
      return convertToCreditCard(data);
    },
    refetchInterval: 5 * 60 * 1000,
    staleTime: 1 * 60 * 1000,
  });

  // Fetch all banks for filter
  const { data: banks, isLoading: isLoadingBanks } = useQuery({
    queryKey: ["banks"],
    queryFn: async () => {
      console.log("Fetching banks...");
      const { data, error } = await supabase
        .from("banks")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching banks:", error);
        throw error;
      }

      console.log("Banks data:", data);
      return data;
    },
  });

  // Fetch all cards for comparison
  const { data: allCards, isLoading: isLoadingAllCards } = useQuery<CreditCard[]>({
    queryKey: ["all-cards", searchTerm, selectedBank, minSalary],
    queryFn: async () => {
      console.log("Fetching all cards...");
      let query = supabase
        .from("credit_cards")
        .select(`
          *,
          bank:banks(name),
          cashback_rates(*),
          card_benefits(*),
          webpage:webpages(id, meta_title, slug_url)
        `)
        .order("card_name");

      if (searchTerm) {
        query = query.ilike("card_name", `%${searchTerm}%`);
      }

      if (selectedBank) {
        query = query.eq("bank_id", selectedBank);
      }

      if (minSalary) {
        query = query.lte("minimum_salary", minSalary);
      }

      const { data, error } = await query;

      if (error) throw error;

      console.log("All cards data:", data);
      return convertToCreditCard(data || []);
    },
  });

  const formatAED = (amount: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Helmet>
        <title>Cashback Cards - Compare Credit Cards</title>
        <meta
          name="description"
          content="Compare credit cards and find the best cashback rewards for your spending habits."
        />
      </Helmet>

      <NavMenu />

      <main className="flex-grow">
        <HeroSection
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedBank={selectedBank}
          setSelectedBank={(value: string) => setSelectedBank(value ? value : null)}
          minSalary={minSalary}
          setMinSalary={setMinSalary}
          banks={banks}
        />
        <ComparisonSection
          cards={allCards || []}
          banks={banks || []}
          searchTerm={searchTerm}
          selectedBank={selectedBank}
          minSalary={minSalary}
          onSearchChange={setSearchTerm}
          onBankChange={setSelectedBank}
          onMinSalaryChange={setMinSalary}
          formatAED={formatAED}
        />
        
        {promotedError ? (
          <div className="text-red-500 text-center py-4">
            Error loading promoted cards: {promotedError.message}
          </div>
        ) : isLoadingPromoted ? (
          <div className="text-center py-4">Loading promoted cards...</div>
        ) : promotedCards && promotedCards.length > 0 ? (
          <PromotedCards promotedCards={promotedCards} />
        ) : (
          <div className="text-center py-4">No promoted cards available</div>
        )}

        <FeaturesSection />
        
        <FAQSection />

        {/* Blog Articles Section */}
        <section className="py-8 sm:py-12 md:py-16 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-2 sm:px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-center">Latest Articles</h2>
            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
              <BlogArticlesList />
            </div>
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
}