import React from 'react';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <div className="relative h-[600px] w-full group overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center transform transition-all duration-500 group-hover:scale-125"
        style={{ 
          backgroundImage: `url(/images/mosque-near-me-for-prayer-time.jpg)`,
          transformOrigin: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative h-full flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
          {t('hero.title')}
        </h1>
        <p className="text-xl md:text-2xl text-center mb-8 max-w-2xl">
          {t('hero.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-lg font-semibold transition-colors">
            {t('hero.prayerTimes')}
          </button>
          <button className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-lg font-semibold transition-colors">
            {t('hero.learnMore')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;