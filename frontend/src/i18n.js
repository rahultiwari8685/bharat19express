import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      trending: "Trending",
      home: "Home",
      business: "Business",
      politics: "Politics",
      entertainment: "Entertainment",
      sports: "Sports",
      world: "World",
      latestNews: "Latest News",
      popularNews: "Popular News",
      readMore: "Read More",
      search: "Search",
      categories: "Categories",
      about: "About Us",
      contact: "Contact Us",
      privacy: "Privacy Policy",
      terms: "Terms & Conditions",
      language: "Language",
      english: "English",
      hindi: "हिन्दी",
      bengali: "বাংলা",
      marathi: "मराठी",
      tamil: "தமிழ்",
      noNews: "No news available",
    },
  },

  hi: {
    translation: {
      trending: "ट्रेंडिंग",
      home: "होम",
      business: "बिजनेस",
      politics: "राजनीति",
      entertainment: "मनोरंजन",
      sports: "खेल",
      world: "दुनिया",
      latestNews: "ताजा खबरें",
      popularNews: "लोकप्रिय खबरें",
      readMore: "और पढ़ें",
      search: "खोजें",
      categories: "श्रेणियां",
      about: "हमारे बारे में",
      contact: "संपर्क करें",
      privacy: "गोपनीयता नीति",
      terms: "नियम एवं शर्तें",
      language: "भाषा",
      english: "English",
      hindi: "हिन्दी",
      bengali: "বাংলা",
      marathi: "मराठी",
      tamil: "தமிழ்",
      noNews: "कोई खबर उपलब्ध नहीं है",
    },
  },

  bn: {
    translation: {
      trending: "ট্রেন্ডিং",
      home: "হোম",
      business: "ব্যবসা",
      politics: "রাজনীতি",
      entertainment: "বিনোদন",
      sports: "খেলাধুলা",
      world: "বিশ্ব",
      latestNews: "সর্বশেষ খবর",
      popularNews: "জনপ্রিয় খবর",
      readMore: "আরও পড়ুন",
      search: "অনুসন্ধান",
      categories: "বিভাগ",
      about: "আমাদের সম্পর্কে",
      contact: "যোগাযোগ করুন",
      privacy: "গোপনীয়তা নীতি",
      terms: "শর্তাবলী",
      language: "ভাষা",
      english: "English",
      hindi: "हिन्दी",
      bengali: "বাংলা",
      marathi: "मराठी",
      tamil: "தமிழ்",
      noNews: "কোনো খবর পাওয়া যায়নি",
    },
  },

  mr: {
    translation: {
      trending: "ट्रेंडिंग",
      home: "मुख्यपृष्ठ",
      business: "व्यवसाय",
      politics: "राजकारण",
      entertainment: "मनोरंजन",
      sports: "क्रीडा",
      world: "जग",
      latestNews: "ताज्या बातम्या",
      popularNews: "लोकप्रिय बातम्या",
      readMore: "अधिक वाचा",
      search: "शोधा",
      categories: "श्रेणी",
      about: "आमच्याबद्दल",
      contact: "संपर्क करा",
      privacy: "गोपनीयता धोरण",
      terms: "अटी आणि शर्ती",
      language: "भाषा",
      english: "English",
      hindi: "हिन्दी",
      bengali: "বাংলা",
      marathi: "मराठी",
      tamil: "தமிழ்",
      noNews: "कोणतीही बातमी उपलब्ध नाही",
    },
  },

  ta: {
    translation: {
      trending: "டிரெண்டிங்",
      home: "முகப்பு",
      business: "வணிகம்",
      politics: "அரசியல்",
      entertainment: "பொழுதுபோக்கு",
      sports: "விளையாட்டு",
      world: "உலகம்",
      latestNews: "சமீபத்திய செய்திகள்",
      popularNews: "பிரபலமான செய்திகள்",
      readMore: "மேலும் படிக்க",
      search: "தேடல்",
      categories: "வகைகள்",
      about: "எங்களைப் பற்றி",
      contact: "தொடர்பு கொள்ள",
      privacy: "தனியுரிமைக் கொள்கை",
      terms: "விதிமுறைகள்",
      language: "மொழி",
      english: "English",
      hindi: "हिन्दी",
      bengali: "বাংলা",
      marathi: "मराठी",
      tamil: "தமிழ்",
      noNews: "செய்திகள் எதுவும் இல்லை",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,

    fallbackLng: "en",

    supportedLngs: ["en", "hi", "bn", "mr", "ta"],

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
