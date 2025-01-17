import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface HeroSectionProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedBank: string | null;
  setSelectedBank: (value: string) => void;
  minSalary: string;
  setMinSalary: (value: string) => void;
  banks?: { id: string; name: string }[];
}

export const HeroSection = ({
  searchTerm,
  setSearchTerm,
  selectedBank,
  setSelectedBank,
  minSalary,
  setMinSalary,
  banks,
}: HeroSectionProps) => {
  return (
    <section className="bg-gradient-to-r from-purple-100 to-blue-50 dark:from-gray-900 dark:to-gray-800 mt-8 sm:mt-16">
      <div className="container mx-auto px-2 sm:px-4 py-8 sm:py-12 md:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
            Find Your Perfect Cashback Card in UAE
          </h1>
          <p className="text-sm sm:text-base md:text-lg mb-4 sm:mb-6 md:mb-8 text-gray-600 dark:text-gray-300 px-2 sm:px-4">
            Compare the best cashback credit cards and maximize your rewards on every purchase
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2 sm:px-4">
            <div className="w-full sm:w-auto">
              <Input
                placeholder="Search cards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-[200px] md:w-[250px]"
              />
            </div>
            
            <div className="w-full sm:w-auto">
              <Select value={selectedBank || undefined} onValueChange={setSelectedBank}>
                <SelectTrigger className="w-full sm:w-[200px] md:w-[250px]">
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Banks</SelectItem>
                  {banks?.map((bank) => (
                    <SelectItem key={bank.id} value={bank.id}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-auto">
              <Input
                type="number"
                placeholder="Min. Salary (AED)"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                className="w-full sm:w-[200px] md:w-[250px]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};