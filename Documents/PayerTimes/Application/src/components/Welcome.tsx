import React from 'react';
import { useTranslation } from 'react-i18next';

const Welcome = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              {t('welcome.title')}
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {t('welcome.description')}
            </p>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg transition-colors">
              {t('welcome.joinUs')}
            </button>
          </div>
          <div className="relative h-[400px]">
            <img
              src="https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80"
              alt="Islamic Center"
              className="rounded-lg object-cover w-full h-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Welcome;