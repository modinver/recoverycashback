import { Building2, CreditCard, Coins, Percent } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Compare Cards</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Find the perfect card that matches your spending habits
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Percent className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Maximize Cashback</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get the highest returns on your everyday spending
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <Building2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Leading Banks</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Partner with UAE's most trusted financial institutions
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
              <Coins className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Rewards</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Track and optimize your cashback earnings
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};