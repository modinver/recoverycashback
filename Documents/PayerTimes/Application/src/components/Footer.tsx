import React from 'react';
import { useTranslation } from 'react-i18next';
import { Moon, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Moon className="h-8 w-8 text-emerald-500" />
              <span className="text-xl font-bold text-white">Islamic Center</span>
            </div>
            <p className="text-gray-400 mb-6">
              {t('footer.about')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-emerald-500">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-emerald-500">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              {['about', 'services', 'events', 'news', 'contact'].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item}`}
                    className="text-gray-400 hover:text-emerald-500 transition-colors"
                  >
                    {t(`footer.links.${item}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-6">{t('footer.contact')}</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-emerald-500" />
                <span>123 Islamic Center St, City, Country</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-emerald-500" />
                <span>+1 234 567 8900</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-emerald-500" />
                <span>info@islamiccenter.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold mb-6">{t('footer.newsletter')}</h3>
            <p className="text-gray-400 mb-4">
              {t('footer.newsletterText')}
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {t('footer.subscribe')}
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Islamic Center. {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;