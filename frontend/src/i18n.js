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
      footerDescription:
        "Bharat 19 Express is a trusted Hindi news platform. Our aim is to deliver important news to you in a simple, clear and fast way.",
      letsTalk: "Let's Talk",
      letsChat: "Let's Chat",
      headquarters: "Headquarters",
      appDownload: "Bharat19Express app download",
      freeSignDownload: "Free sign up & download, iOS & Android app",
      downloadOnThe: "Download on the",
      googlePlay: "Google Play",
      appStore: "App Store",
      loading: "Loading...",
      showMore: "Show More",
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
      footerDescription:
        "भारत 19 एक्सप्रेस एक भरोसेमंद हिंदी न्यूज़ प्लेटफॉर्म है, हमारा उद्देश्य महत्वपूर्ण खबरों को सरल, स्पष्ट और तेज़ तरीके से आप तक पहुँचाना है।",
      letsTalk: "बात करें",
      letsChat: "चैट करें",
      headquarters: "मुख्यालय",
      appDownload: "Bharat19Express ऐप डाउनलोड करें",
      freeSignDownload: "मुफ्त साइन अप करें और iOS एवं Android ऐप डाउनलोड करें",
      downloadOnThe: "डाउनलोड करें",
      googlePlay: "Google Play",
      appStore: "App Store",
      loading: "लोड हो रहा है...",
      showMore: "और दिखाएं",
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
      footerDescription:
        "بھارت 19 ایکسپریس ایک قابل اعتماد ہندی نیوز پلیٹ فارم ہے۔ ہمارا مقصد اہم خبروں کو آسان، واضح اور تیز انداز میں آپ تک پہنچانا ہے۔",
      letsTalk: "بات کریں",
      letsChat: "چیٹ کریں",
      headquarters: "مرکزی دفتر",
      appDownload: "Bharat19Express ایپ ڈاؤن لوڈ کریں",
      freeSignDownload:
        "مفت سائن اپ کریں اور iOS اور Android ایپ ڈاؤن لوڈ کریں",
      downloadOnThe: "ڈاؤن لوڈ کریں",
      googlePlay: "Google Play",
      appStore: "App Store",
      loading: "لوڈ ہو رہا ہے...",
      showMore: "مزید دکھائیں",
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
      footerDescription:
        "ভারত ১৯ এক্সপ্রেস একটি বিশ্বস্ত হিন্দি নিউজ প্ল্যাটফর্ম। আমাদের লক্ষ্য গুরুত্বপূর্ণ খবর সহজ, পরিষ্কার এবং দ্রুতভাবে আপনার কাছে পৌঁছে দেওয়া।",
      letsTalk: "যোগাযোগ করুন",
      letsChat: "চ্যাট করুন",
      headquarters: "প্রধান কার্যালয়",
      appDownload: "Bharat19Express অ্যাপ ডাউনলোড করুন",
      freeSignDownload:
        "বিনামূল্যে সাইন আপ করুন এবং iOS ও Android অ্যাপ ডাউনলোড করুন",
      downloadOnThe: "ডাউনলোড করুন",
      googlePlay: "Google Play",
      appStore: "App Store",
      loading: "লোড হচ্ছে...",
      showMore: "আরও দেখুন",
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
      footerDescription:
        "भारत १९ एक्सप्रेस हे एक विश्वासार्ह हिंदी न्यूज प्लॅटफॉर्म आहे. महत्त्वाच्या बातम्या सोप्या, स्पष्ट आणि जलद पद्धतीने तुमच्यापर्यंत पोहोचवणे हा आमचा उद्देश आहे.",
      letsTalk: "बोलूया",
      letsChat: "चॅट करा",
      headquarters: "मुख्यालय",
      appDownload: "Bharat19Express अॅप डाउनलोड करा",
      freeSignDownload: "मोफत साइन अप करा आणि iOS व Android अॅप डाउनलोड करा",
      downloadOnThe: "डाउनलोड करा",
      googlePlay: "Google Play",
      appStore: "App Store",
      loading: "लोड होत आहे...",
      showMore: "अधिक दाखवा",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,

    fallbackLng: "en",

    supportedLngs: ["en", "hi", "ur", "bn", "mr"],

    load: "languageOnly",

    detection: {
      order: ["localStorage"],
      caches: ["localStorage"],
    },

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
