import React from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';
import { gulfCountries } from '../data/gulfCountries';

interface LocationSelectorProps {
  selectedCountry: string;
  selectedCity: string;
  onCountryChange: (country: string) => void;
  onCityChange: (city: string) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedCountry,
  selectedCity,
  onCountryChange,
  onCityChange,
}) => {
  const { t } = useTranslation();
  
  const selectedCountryData = gulfCountries.find(
    (country) => country.name === selectedCountry
  );

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const country = e.target.value;
    onCountryChange(country);
    // Reset city when country changes
    onCityChange('');
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
      <div className="flex items-center space-x-2">
        <MapPin className="w-5 h-5 text-primary" />
        <select
          value={selectedCountry}
          onChange={handleCountryChange}
          className="bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">{t('Select Country')}</option>
          {gulfCountries.map((country) => (
            <option key={country.name} value={country.name}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCountryData && (
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-primary" />
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="bg-white border border-gray-300 text-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">{t('Select City')}</option>
            {selectedCountryData.cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;