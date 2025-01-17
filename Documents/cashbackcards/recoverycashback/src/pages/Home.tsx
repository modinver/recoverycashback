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

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [minSalary, setMinSalary] = useState<string>("");

  // Fetch promoted credit cards
  const { data: promotedCards } = useQuery({
    queryKey: ["promoted-cards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("credit_cards")
        .select(`
          *,
          bank:banks(name),
          cashback_rates(*),
          card_benefits(*)
        `)
        .eq("is_promotion", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching promoted cards:", error);
        throw error;
      }
      
      console.log("Promoted cards data:", data); // Debug log
      return data;
    },
  });

  // Fetch all banks for filter
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

  // Fetch all cards for comparison
  const { data: allCards } = useQuery({
    queryKey: ["all-cards", searchTerm, selectedBank, minSalary],
    queryFn: async () => {
      let query = supabase
        .from("credit_cards")
        .select(`
          *,
          bank:banks(name),
          cashback_rates(*)
        `)
        .order("card_name");

      if (searchTerm) {
        query = query.ilike("card_name", `%${searchTerm}%`);
      }

      if (selectedBank) {
        query = query.eq("bank_id", selectedBank);
      }

      if (minSalary) {
        query = query.lte("minimum_salary", parseFloat(minSalary));
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });

  const formatAED = (amount: number | null) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
    }).format(amount);
  };

  return (
    <>
      <Helmet>
        <title>CashBack Card Comparison in UAE - RecoveryCashBack.com</title>
        <meta
          name="description"
          content="Compare the best cashback credit cards in UAE. Find cards with highest cashback rates, exclusive rewards, and special promotions. Make your spending count with RecoveryCashback.com"
        />
        <meta
          name="keywords"
          content="cashback UAE, credit card UAE, best cashback cards, UAE credit cards, Dubai credit cards, Abu Dhabi credit cards, UAE banking, cashback rewards"
        />
        <link rel="canonical" href="https://recoverycashback.com" />
      </Helmet>
      <div className="min-h-screen flex flex-col overflow-x-hidden">
        <NavMenu />
        <main className="flex-1 mt-14 sm:mt-16">
          <div className="w-full max-w-[100vw] overflow-x-hidden">
            <HeroSection
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedBank={selectedBank}
              setSelectedBank={setSelectedBank}
              minSalary={minSalary}
              setMinSalary={setMinSalary}
              banks={banks}
            />

            <ComparisonSection allCards={allCards} formatAED={formatAED} />

            <PromotedCards promotedCards={promotedCards} />

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
          </div>
        </main>

        <FooterSection />
      </div>
    </>
  );
}