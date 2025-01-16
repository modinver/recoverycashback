import { Check } from "lucide-react";

interface Benefit {
  description: string;
}

interface PromotedCardBenefitsProps {
  benefits?: Benefit[];
}

export const PromotedCardBenefits = ({ benefits }: PromotedCardBenefitsProps) => {
  return (
    <div className="md:col-span-1">
      <h4 className="text-sm font-medium text-gray-500 uppercase mb-3">Key Benefits</h4>
      <ul className="space-y-2">
        {benefits?.slice(0, 4).map((benefit, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
            <span className="text-sm">{benefit.description}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};