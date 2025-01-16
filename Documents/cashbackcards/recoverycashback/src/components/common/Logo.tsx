import { CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <CreditCard className="h-8 w-8 text-blue-600" strokeWidth={2} />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-bold leading-none text-blue-600">
          RecoveryCashBack
          <span className="text-green-500">.com</span>
        </span>
        <span className="text-xs text-gray-500 leading-none">Smart Card Rewards</span>
      </div>
    </div>
  );
};
