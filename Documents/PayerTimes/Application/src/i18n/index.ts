import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        services: 'Services',
        'prayer-times': 'Prayer Times',
        contact: 'Contact',
        login: 'Login',
      },
      hero: {
        title: 'Real-time prayer alerts and Mosques near it for prayer',
        quote: 'Indeed, prayer has been decreed upon the believers a decree of specified times.' // Quran 4:103
      },
      welcome: {
        description: 'At Prayer Times UAE, we provide up-to-date and accurate prayer times for all cities across the Emirates, including Dubai, Abu Dhabi, and beyond. Our service ensures you never miss a moment of worship, with real-time updates for all five daily prayers: Fajr, Dhuhr, Asr, Maghrib, and Isha.'
      },
      prayers: {
        fajr: 'Fajr',
        sunrise: 'Sunrise',
        dhuhr: 'Dhuhr',
        asr: 'Asr',
        maghrib: 'Maghrib',
        isha: 'Isha'
      },
      // ... (rest of the translations)
    },
  },
  ar: {
    translation: {
      nav: {
        home: 'الرئيسية',
        services: 'الخدمات',
        'prayer-times': 'أوقات الصلاة',
        contact: 'اتصل بنا',
        login: 'تسجيل الدخول',
      },
      hero: {
        title: 'تنبيهات الصلاة في الوقت الحقيقي والمساجد القريبة منها للصلاة',
        quote: 'إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَوْقُوتًا' // النساء: ١٠٣
      },
      welcome: {
        description: 'في مواقيت الصلاة الإمارات، نقدم مواقيت صلاة دقيقة ومحدثة لجميع مدن الإمارات، بما في ذلك دبي وأبوظبي وغيرها. تضمن خدمتنا عدم تفويت أي لحظة من لحظات العبادة، مع تحديثات في الوقت الحقيقي للصلوات الخمس اليومية: الفجر والظهر والعصر والمغرب والعشاء.'
      },
      prayers: {
        fajr: 'الفجر',
        sunrise: 'الشروق',
        dhuhr: 'الظهر',
        asr: 'العصر',
        maghrib: 'المغرب',
        isha: 'العشاء'
      },
      // ... (Arabic translations)
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;