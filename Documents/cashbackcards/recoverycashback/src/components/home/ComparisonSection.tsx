import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SlidersHorizontal } from "lucide-react";

interface ComparisonSectionProps {
  allCards?: any[];
  formatAED: (amount: number | null) => string;
}

export const ComparisonSection = ({ allCards, formatAED }: ComparisonSectionProps) => {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center mb-6">
            <SlidersHorizontal className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">Compare Credit Cards</h2>
        </div>
        <div className="overflow-x-auto -mx-2 sm:mx-0 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 dark:bg-gray-900">
                    <TableHead className="py-3 px-4 text-left">Card Name</TableHead>
                    <TableHead className="py-3 px-4 text-left">Bank</TableHead>
                    <TableHead className="py-3 px-4 text-right">Min. Salary</TableHead>
                    <TableHead className="py-3 px-4 text-right">Annual Fee</TableHead>
                    <TableHead className="py-3 px-4 text-right">Supermarket</TableHead>
                    <TableHead className="py-3 px-4 text-right">Online</TableHead>
                    <TableHead className="py-3 px-4 text-right">Dining</TableHead>
                    <TableHead className="py-3 px-4 text-right">Fuel</TableHead>
                    <TableHead className="py-3 px-4 text-right">Travel</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allCards?.map((card) => (
                    <TableRow key={card.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell className="py-3 px-4">{card.card_name}</TableCell>
                      <TableCell className="py-3 px-4">{card.bank?.name}</TableCell>
                      <TableCell className="py-3 px-4 text-right">{formatAED(card.minimum_salary)}</TableCell>
                      <TableCell className="py-3 px-4 text-right">{card.annual_fee || "Contact bank"}</TableCell>
                      <TableCell className="py-3 px-4 text-right">
                        {card.cashback_rates?.[0]?.supermarket_rate
                          ? `${card.cashback_rates[0].supermarket_rate}%`
                          : "-"}
                      </TableCell>
                      <TableCell className="py-3 px-4 text-right">
                        {card.cashback_rates?.[0]?.online_rate
                          ? `${card.cashback_rates[0].online_rate}%`
                          : "-"}
                      </TableCell>
                      <TableCell className="py-3 px-4 text-right">
                        {card.cashback_rates?.[0]?.dining_rate
                          ? `${card.cashback_rates[0].dining_rate}%`
                          : "-"}
                      </TableCell>
                      <TableCell className="py-3 px-4 text-right">
                        {card.cashback_rates?.[0]?.fuel_rate
                          ? `${card.cashback_rates[0].fuel_rate}%`
                          : "-"}
                      </TableCell>
                      <TableCell className="py-3 px-4 text-right">
                        {card.cashback_rates?.[0]?.travel_rate
                          ? `${card.cashback_rates[0].travel_rate}%`
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};