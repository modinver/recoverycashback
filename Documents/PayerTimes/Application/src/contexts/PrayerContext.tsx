import React, { createContext, useContext, useState, ReactNode } from 'react';

interface PrayerContextType {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
}

const PrayerContext = createContext<PrayerContextType | undefined>(undefined);

export const PrayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState<string>('Dubai');
  const [selectedCountry, setSelectedCountry] = useState<string>('UAE');

  return (
    <PrayerContext.Provider
      value={{
        selectedCity,
        setSelectedCity,
        selectedCountry,
        setSelectedCountry,
      }}
    >
      {children}
    </PrayerContext.Provider>
  );
};

export const usePrayer = () => {
  const context = useContext(PrayerContext);
  if (context === undefined) {
    throw new Error('usePrayer must be used within a PrayerProvider');
  }
  return context;
};
