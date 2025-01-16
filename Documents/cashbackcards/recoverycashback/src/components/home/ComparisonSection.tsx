import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ComparisonSectionProps {
  allCards?: any[];
  formatAED: (amount: number | null) => string;
}

export const ComparisonSection = ({ allCards, formatAED }: ComparisonSectionProps) => {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-2 sm:px-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-center">Compare Credit Cards</h2>
        <div className="overflow-x-auto -mx-2 sm:mx-0 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 dark:bg-gray-900">
                    <TableHead className="font-semibold whitespace-nowrap py-2 px-2 sm:px-4">Card</TableHead>
                    <TableHead className="font-semibold whitespace-nowrap py-2 px-2 sm:px-4">Bank</TableHead>
                    <TableHead className="font-semibold text-right whitespace-nowrap py-2 px-2 sm:px-4">Min. Salary</TableHead>
                    <TableHead className="font-semibold text-right whitespace-nowrap py-2 px-2 sm:px-4">Annual Fee</TableHead>
                    <TableHead className="font-semibold text-right whitespace-nowrap py-2 px-2 sm:px-4">Supermarket</TableHead>
                    <TableHead className="font-semibold text-right whitespace-nowrap py-2 px-2 sm:px-4">Online</TableHead>
                    <TableHead className="font-semibold text-right whitespace-nowrap py-2 px-2 sm:px-4">Dining</TableHead>
                    <TableHead className="font-semibold text-right whitespace-nowrap py-2 px-2 sm:px-4">Fuel</TableHead>
                    <TableHead className="font-semibold text-right whitespace-nowrap py-2 px-2 sm:px-4">Travel</TableHead>
                    <TableHead className="font-semibold text-right whitespace-nowrap py-2 px-2 sm:px-4">Insurance</TableHead>
                    <TableHead className="font-semibold text-right whitespace-nowrap py-2 px-2 sm:px-4">Rental</TableHead>
                    <TableHead className="font-semibold text-right whitespace-nowrap py-2 px-2 sm:px-4">Telecom</TableHead>
                    <TableHead className="font-semibold text-right whitespace-nowrap py-2 px-2 sm:px-4">Education</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allCards?.map((card) => (
                    <TableRow key={card.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <TableCell className="font-medium whitespace-nowrap py-2 px-2 sm:px-4">{card.card_name}</TableCell>
                      <TableCell className="whitespace-nowrap py-2 px-2 sm:px-4">{(card.bank as any)?.name}</TableCell>
                      <TableCell className="text-right whitespace-nowrap py-2 px-2 sm:px-4">{formatAED(card.minimum_salary)}</TableCell>
                      <TableCell className="text-right whitespace-nowrap py-2 px-2 sm:px-4">{card.annual_fee || "Contact bank"}</TableCell>
                      <TableCell className="text-right whitespace-nowrap py-2 px-2 sm:px-4">
                        {card.cashback_rates?.[0]?.supermarket_rate
                          ? `${card.cashback_rates[0].supermarket_rate}%`
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap py-2 px-2 sm:px-4">
                        {card.cashback_rates?.[0]?.online_rate
                          ? `${card.cashback_rates[0].online_rate}%`
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap py-2 px-2 sm:px-4">
                        {card.cashback_rates?.[0]?.dining_rate
                          ? `${card.cashback_rates[0].dining_rate}%`
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap py-2 px-2 sm:px-4">
                        {card.cashback_rates?.[0]?.fuel_rate
                          ? `${card.cashback_rates[0].fuel_rate}%`
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap py-2 px-2 sm:px-4">
                        {card.cashback_rates?.[0]?.travel_rate
                          ? `${card.cashback_rates[0].travel_rate}%`
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap py-2 px-2 sm:px-4">
                        {card.cashback_rates?.[0]?.insurance_rate
                          ? `${card.cashback_rates[0].insurance_rate}%`
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap py-2 px-2 sm:px-4">
                        {card.cashback_rates?.[0]?.rental_rate
                          ? `${card.cashback_rates[0].rental_rate}%`
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap py-2 px-2 sm:px-4">
                        {card.cashback_rates?.[0]?.telecom_rate
                          ? `${card.cashback_rates[0].telecom_rate}%`
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap py-2 px-2 sm:px-4">
                        {card.cashback_rates?.[0]?.education_rate
                          ? `${card.cashback_rates[0].education_rate}%`
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