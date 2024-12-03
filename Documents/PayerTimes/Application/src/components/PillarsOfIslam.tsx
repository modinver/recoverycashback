import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, BookOpen, Coins, CalendarDays, MapPin } from 'lucide-react';

const PillarCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="text-center">
    <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
      <Icon className="w-10 h-10 text-emerald-600" />
    </div>
    <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const PillarsOfIslam = () => {
  const { t } = useTranslation();

  const pillars = [
    {
      icon: Heart,
      title: t('pillars.shahadah.title'),
      description: t('pillars.shahadah.description'),
    },
    {
      icon: BookOpen,
      title: t('pillars.salah.title'),
      description: t('pillars.salah.description'),
    },
    {
      icon: Coins,
      title: t('pillars.zakat.title'),
      description: t('pillars.zakat.description'),
    },
    {
      icon: CalendarDays,
      title: t('pillars.sawm.title'),
      description: t('pillars.sawm.description'),
    },
    {
      icon: MapPin,
      title: t('pillars.hajj.title'),
      description: t('pillars.hajj.description'),
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {t('pillars.title')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('pillars.subtitle')}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {pillars.map((pillar) => (
            <PillarCard key={pillar.title} {...pillar} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PillarsOfIslam;