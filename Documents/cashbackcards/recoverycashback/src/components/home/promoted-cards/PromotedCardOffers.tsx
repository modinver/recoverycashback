import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PromotedCardOffersProps {
  joiningOffer?: string;
  offers?: string;
}

export const PromotedCardOffers = ({ joiningOffer, offers }: PromotedCardOffersProps) => {
  return (
    <div className="md:col-span-2">
      <h4 className="text-sm font-medium text-gray-500 uppercase mb-3">Special Offers</h4>
      {joiningOffer && (
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg mb-4">
          <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
            Welcome Offer: {joiningOffer}
          </p>
        </div>
      )}
      {offers && (
        <div className="space-y-2">
          {offers.split('\n').map((offer, index) => (
            <p key={index} className="text-sm flex items-start gap-2">
              <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
              {offer}
            </p>
          ))}
        </div>
      )}
      <div className="mt-4">
        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
          Learn More
        </Button>
      </div>
    </div>
  );
};