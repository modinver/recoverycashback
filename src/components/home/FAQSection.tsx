import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ReactMarkdown from "react-markdown";

export function FAQSection() {
  const { data: faqs } = useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .eq("is_published", true)
        .order("order_index");
      if (error) throw error;
      return data;
    },
  });

  if (!faqs?.length) return null;

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{faq.answer}</ReactMarkdown>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}