import { Card } from "@/components/ui/card";
import { PromotedCardImage } from "./promoted-cards/PromotedCardImage";
import { PromotedCardDetails } from "./promoted-cards/PromotedCardDetails";
import { PromotedCardBenefits } from "./promoted-cards/PromotedCardBenefits";
import { PromotedCardOffers } from "./promoted-cards/PromotedCardOffers";

interface PromotedCardsProps {
  promotedCards?: any[];
}

export const PromotedCards = ({ promotedCards }: PromotedCardsProps) => {
  return (
    <section className="py-6 sm:py-8 md:py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-2 sm:px-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-center">Featured Credit Cards</h2>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 text-center mb-4 sm:mb-6 md:mb-8">
          Discover our top picks with exclusive benefits
        </p>
        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {promotedCards?.map((card) => (
            <Card
              key={card.id}
              className="overflow-hidden border hover:border-purple-300 transition-all duration-300 shadow hover:shadow-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-6">
                <div className="md:col-span-1 lg:col-span-1 flex justify-center md:justify-start">
                  <PromotedCardImage
                    imageUrl={card.image_url}
                    cardName={card.card_name}
                    bankName={card.bank?.name}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 md:col-span-1 lg:col-span-4">
                  <PromotedCardDetails
                    minimumSalary={card.minimum_salary}
                    annualFee={card.annual_fee}
                    maxCashbackRate={
                      card.cashback_rates?.[0] &&
                      Math.max(
                        ...[
                          card.cashback_rates[0].dining_rate,
                          card.cashback_rates[0].supermarket_rate,
                          card.cashback_rates[0].online_rate,
                          card.cashback_rates[0].other_rate,
                        ].filter(Boolean)
                      )
                    }
                  />
                  <PromotedCardBenefits benefits={card.card_benefits} />
                  <div className="sm:col-span-2 lg:col-span-2">
                    <PromotedCardOffers
                      joiningOffer={card.joining_offer}
                      offers={card.offers}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};