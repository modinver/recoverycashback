import React from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Heart, GraduationCap, Building2, Users } from 'lucide-react';

const ServiceCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
    <Icon className="w-12 h-12 text-emerald-600 mb-4" />
    <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
    <button className="mt-4 text-emerald-600 hover:text-emerald-700 font-semibold">
      Learn More →
    </button>
  </div>
);

const Services = () => {
  const { t } = useTranslation();

  const services = [
    {
      icon: Building2,
      title: t('services.mosque.title'),
      description: t('services.mosque.description'),
    },
    {
      icon: BookOpen,
      title: t('services.quran.title'),
      description: t('services.quran.description'),
    },
    {
      icon: GraduationCap,
      title: t('services.education.title'),
      description: t('services.education.description'),
    },
    {
      icon: Heart,
      title: t('services.charity.title'),
      description: t('services.charity.description'),
    },
    {
      icon: Users,
      title: t('services.community.title'),
      description: t('services.community.description'),
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {t('services.title')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;