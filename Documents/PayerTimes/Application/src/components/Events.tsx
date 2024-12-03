import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar } from 'lucide-react';
import dayjs from 'dayjs';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
  image: string;
}

const EventCard = ({ event }: { event: Event }) => {
  const eventDate = dayjs(event.date);
  
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <img
        src={event.image}
        alt={event.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex items-center text-emerald-600 mb-2">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="text-sm">
            {eventDate.format('MMMM D, YYYY')} at {event.time}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-4">{event.description}</p>
        <button className="text-emerald-600 hover:text-emerald-700 font-semibold">
          Register Now →
        </button>
      </div>
    </div>
  );
};

const Events = () => {
  const { t } = useTranslation();

  const events: Event[] = [
    {
      id: 1,
      title: t('events.quranClass.title'),
      date: '2024-03-20',
      time: '7:00 PM',
      description: t('events.quranClass.description'),
      image: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      title: t('events.familyGathering.title'),
      date: '2024-03-25',
      time: '5:30 PM',
      description: t('events.familyGathering.description'),
      image: 'https://images.unsplash.com/photo-1574236170880-faf59c10b265?auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      title: t('events.youthProgram.title'),
      date: '2024-03-30',
      time: '6:00 PM',
      description: t('events.youthProgram.description'),
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {t('events.title')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('events.subtitle')}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;