import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Sun, Sunrise, Moon } from 'lucide-react';
import dayjs from 'dayjs';
import axios from 'axios';
import LocationSelector from './LocationSelector';
import { gulfCountries } from '../data/gulfCountries';
import { usePrayer } from '../contexts/PrayerContext';

interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface HijriDate {
  date: string;
  month: {
    en: string;
    ar: string;
    number: number;
  };
  year: string;
}

const PrayerTimes = () => {
  const { t } = useTranslation();
  const currentDate = dayjs().format('MMMM D, YYYY');
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const { selectedCity, setSelectedCity, selectedCountry, setSelectedCountry } = usePrayer();
  
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimings | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrayerTimes = async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.aladhan.com/v1/timingsByAddress/${dayjs().format('DD-MM-YYYY')}`,
        {
          params: {
            address: `${city}, ${selectedCountry}`,
            method: 4, // Using Umm Al-Qura method for Gulf countries
          },
        }
      );
      setPrayerTimes(response.data.data.timings);
    } catch (err) {
      setError('Failed to fetch prayer times. Please try again later.');
      console.error('Error fetching prayer times:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHijriDate = async () => {
    try {
      const response = await axios.get('https://api.aladhan.com/v1/gToH', {
        params: {
          date: dayjs().format('DD-MM-YYYY')
        }
      });
      setHijriDate(response.data.data.hijri);
    } catch (err) {
      console.error('Error fetching Hijri date:', err);
    }
  };

  useEffect(() => {
    if (selectedCity) {
      fetchPrayerTimes(selectedCity);
    }
  }, [selectedCity, selectedCountry]);

  useEffect(() => {
    fetchPrayerTimes('Dubai');
    fetchHijriDate();
  }, []);

  const getNextPrayer = (prayerTimes: PrayerTimings): string => {
    const now = dayjs();
    const times = [
      { name: 'Fajr', time: prayerTimes.Fajr },
      { name: 'Sunrise', time: prayerTimes.Sunrise },
      { name: 'Dhuhr', time: prayerTimes.Dhuhr },
      { name: 'Asr', time: prayerTimes.Asr },
      { name: 'Maghrib', time: prayerTimes.Maghrib },
      { name: 'Isha', time: prayerTimes.Isha },
    ];

    // Convertir la hora actual y las horas de oración a minutos desde medianoche para comparar
    const currentMinutes = now.hour() * 60 + now.minute();
    
    for (const prayer of times) {
      const [hours, minutes] = prayer.time.split(':').map(Number);
      const prayerMinutes = hours * 60 + minutes;
      
      if (prayerMinutes > currentMinutes) {
        return prayer.name;
      }
    }
    
    // Si todas las oraciones del día han pasado, la próxima es Fajr
    return 'Fajr';
  };

  const prayers = prayerTimes ? [
    { name: 'Fajr', time: prayerTimes.Fajr, icon: Sunrise },
    { name: 'Dhuhr', time: prayerTimes.Dhuhr, icon: Sun },
    { name: 'Asr', time: prayerTimes.Asr, icon: Sun },
    { name: 'Maghrib', time: prayerTimes.Maghrib, icon: Sunrise },
    { name: 'Isha', time: prayerTimes.Isha, icon: Moon },
  ] : [];

  const nextPrayer = prayerTimes ? getNextPrayer(prayerTimes) : '';

  return (
    <section className="py-16 bg-emerald-600">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('Prayer Times')} - {selectedCity}
          </h2>
          {hijriDate && (
            <p className="text-emerald-100 mb-1">
              {hijriDate.date} {hijriDate.month.en} {hijriDate.year}
            </p>
          )}
          <p className="text-emerald-100">{currentDate}</p>
        </div>

        <LocationSelector
          selectedCountry={selectedCountry}
          selectedCity={selectedCity}
          onCountryChange={setSelectedCountry}
          onCityChange={setSelectedCity}
        />

        {error && (
          <div className="text-center mb-8">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
          </div>
        ) : selectedCity && prayerTimes && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {prayers.map(({ name, time, icon: Icon }) => {
              const isNext = name.toLowerCase() === nextPrayer.toLowerCase();
              return (
                <div
                  key={name}
                  className={`relative bg-white rounded-lg p-6 text-center shadow-lg transition-all duration-300 ${
                    isNext 
                      ? 'transform scale-105 ring-4 ring-yellow-400 shadow-xl bg-gradient-to-b from-white to-yellow-50' 
                      : 'hover:scale-102 border-2 border-emerald-200'
                  }`}
                >
                  {isNext && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black text-sm px-3 py-1 rounded-full font-bold">
                      Next
                    </div>
                  )}
                  <Icon 
                    className={`w-8 h-8 mx-auto mb-4 ${
                      isNext ? 'text-yellow-600 animate-pulse' : 'text-emerald-600'
                    }`} 
                  />
                  <h3 className={`font-bold mb-2 ${
                    isNext ? 'text-yellow-700' : 'text-gray-800'
                  }`}>
                    {name}
                  </h3>
                  <p className={`font-semibold ${
                    isNext ? 'text-yellow-600 text-lg' : 'text-emerald-600'
                  }`}>
                    {time}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default PrayerTimes;