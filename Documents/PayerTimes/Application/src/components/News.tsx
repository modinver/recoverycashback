import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock } from 'lucide-react';
import dayjs from 'dayjs';

interface NewsItem {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  category: string;
}

const NewsCard = ({ news }: { news: NewsItem }) => {
  const publishDate = dayjs(news.date);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <img
        src={news.image}
        alt={news.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-sm">
            {news.category}
          </span>
          <div className="flex items-center text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm">{publishDate.format('MMMM D, YYYY')}</span>
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{news.title}</h3>
        <p className="text-gray-600 mb-4">{news.excerpt}</p>
        <button className="text-emerald-600 hover:text-emerald-700 font-semibold">
          Read More →
        </button>
      </div>
    </div>
  );
};

const News = () => {
  const { t } = useTranslation();

  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: t('news.ramadan.title'),
      date: '2024-03-10',
      excerpt: t('news.ramadan.excerpt'),
      image: 'https://images.unsplash.com/photo-1564633351631-e85bd43d6624?auto=format&fit=crop&q=80',
      category: t('news.categories.announcement'),
    },
    {
      id: 2,
      title: t('news.education.title'),
      date: '2024-03-08',
      excerpt: t('news.education.excerpt'),
      image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80',
      category: t('news.categories.education'),
    },
    {
      id: 3,
      title: t('news.community.title'),
      date: '2024-03-05',
      excerpt: t('news.community.excerpt'),
      image: 'https://images.unsplash.com/photo-1574236170880-faf59c10b265?auto=format&fit=crop&q=80',
      category: t('news.categories.community'),
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {t('news.title')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('news.subtitle')}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;