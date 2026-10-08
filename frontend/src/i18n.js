import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  // =====================================================
  // ENGLISH
  // =====================================================
  en: {
    translation: {
      home: "Home",
      politics: "Politics",
      national: "National",
      sports: "Sports",
      states: "States",
      world: "World",
      opinion: "Opinion",
      trending: "Trending",
      latest: "Latest",
      popular: "Popular",
      related: "Related",
      readMore: "Read More",
      search: "Search",
      categories: "Categories",
      about: "About Us",
      contact: "Contact Us",
      privacy: "Privacy Policy",
      terms: "Terms & Conditions",
      share: "Share",
      author: "Author",
      noNews: "No news available",
      language: "Language",
    },
  },

  // =====================================================
  // HINDI
  // =====================================================
  hi: {
    translation: {
      home: "होम",
      politics: "राजनीति",
      national: "राष्ट्रीय",
      sports: "खेल",
      states: "राज्य",
      world: "दुनिया",
      opinion: "राय",
      trending: "ट्रेंडिंग",
      latest: "ताजा",
      popular: "लोकप्रिय",
      related: "संबंधित",
      readMore: "और पढ़ें",
      search: "खोजें",
      categories: "श्रेणियां",
      about: "हमारे बारे में",
      contact: "संपर्क करें",
      privacy: "गोपनीयता नीति",
      terms: "नियम एवं शर्तें",
      share: "शेयर करें",
      author: "लेखक",
      noNews: "कोई खबर उपलब्ध नहीं है",
      language: "भाषा",
    },
  },

  // =====================================================
  // URDU
  // =====================================================
  ur: {
    translation: {
      home: "ہوم",
      politics: "سیاست",
      national: "قومی",
      sports: "کھیل",
      states: "ریاستیں",
      world: "دنیا",
      opinion: "رائے",
      trending: "تازہ ترین",
      latest: "تازہ ترین",
      popular: "مقبول",
      related: "متعلقہ",
      readMore: "مزید پڑھیں",
      search: "تلاش",
      categories: "زمرے",
      about: "ہمارے بارے میں",
      contact: "رابطہ کریں",
      privacy: "پرائیویسی پالیسی",
      terms: "شرائط و ضوابط",
      share: "شیئر کریں",
      author: "مصنف",
      noNews: "کوئی خبر دستیاب نہیں",
      language: "زبان",
    },
  },

  // =====================================================
  // BENGALI
  // =====================================================
  bn: {
    translation: {
      home: "হোম",
      politics: "রাজনীতি",
      national: "জাতীয়",
      sports: "খেলাধুলা",
      states: "রাজ্য",
      world: "বিশ্ব",
      opinion: "মতামত",
      trending: "ট্রেন্ডিং",
      latest: "সর্বশেষ",
      popular: "জনপ্রিয়",
      related: "সম্পর্কিত",
      readMore: "আরও পড়ুন",
      search: "অনুসন্ধান",
      categories: "বিভাগ",
      about: "আমাদের সম্পর্কে",
      contact: "যোগাযোগ করুন",
      privacy: "গোপনীয়তা নীতি",
      terms: "শর্তাবলী",
      share: "শেয়ার করুন",
      author: "লেখক",
      noNews: "কোনো খবর পাওয়া যায়নি",
      language: "ভাষা",
    },
  },

  // =====================================================
  // MARATHI
  // =====================================================
  mr: {
    translation: {
      home: "मुख्यपृष्ठ",
      politics: "राजकारण",
      national: "राष्ट्रीय",
      sports: "क्रीडा",
      states: "राज्य",
      world: "जग",
      opinion: "मत",
      trending: "ट्रेंडिंग",
      latest: "ताज्या",
      popular: "लोकप्रिय",
      related: "संबंधित",
      readMore: "अधिक वाचा",
      search: "शोधा",
      categories: "श्रेणी",
      about: "आमच्याबद्दल",
      contact: "संपर्क करा",
      privacy: "गोपनीयता धोरण",
      terms: "अटी आणि शर्ती",
      share: "शेअर करा",
      author: "लेखक",
      noNews: "कोणतीही बातमी उपलब्ध नाही",
      language: "भाषा",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,

    fallbackLng: "en",

    // ===================================================
    // SUPPORTED LANGUAGES
    // ===================================================
    supportedLngs: ["en", "hi", "ur", "bn", "mr"],

    detection: {
      order: ["localStorage"],
      caches: ["localStorage"],
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
