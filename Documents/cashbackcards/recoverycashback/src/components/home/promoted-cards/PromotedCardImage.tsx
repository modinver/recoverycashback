import { Card } from "@/components/ui/card";

interface PromotedCardImageProps {
  imageUrl?: string;
  cardName: string;
  bankName?: string;
}

export const PromotedCardImage = ({ imageUrl, cardName, bankName }: PromotedCardImageProps) => {
  return (
    <div className="md:col-span-1 flex flex-col items-center justify-center bg-white dark:bg-gray-800 p-4 rounded-lg">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={cardName}
          className="w-full max-w-[200px] h-auto object-contain mb-4"
        />
      )}
      <h3 className="text-lg font-semibold text-center">{cardName}</h3>
      {bankName && (
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          {bankName}
        </p>
      )}
    </div>
  );
};