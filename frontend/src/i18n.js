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
      about: {
        title: "About Bharat 19 Express",
        heading: "Bharat 19 Express",
        intro:
          "Bharat 19 Express is a trusted Hindi news platform. Our aim is to deliver important news to you in a simple, clear and fast way.",
        missionTitle: "Our Mission",
        mission:
          "Our mission is to provide trustworthy journalism, factual reporting and real-time updates covering Politics, National, International, Sports, Entertainment, Business, Technology and Local News.",
        visionTitle: "Our Vision",
        vision:
          "To become one of India's most trusted digital news organizations by delivering quality journalism with speed, transparency and credibility.",
        coverTitle: "What We Cover",
        politics: "Politics",
        national: "National News",
        states: "State News",
        business: "Business",
        sports: "Sports",

        entertainment: "Entertainment",
        technology: "Technology",
        health: "Health",
        world: "World News",
        latestNews: "Latest news",
        popularNews: "Popular news",
      },
      youtubeButton: "YouTube",
      youtubeChannels: "Our YouTube Channels",
      login: "Login",
      channelNation: "Bharat 19 Express Nation",
      channelRegional: "Bharat 19 Express Regional",
      channelEntertainment: "Bharat 19 Entertainment",
      channelMain: "Bharat 19 Express",
      copyright: "Copyright",
      allRightsReserved: "All Rights Reserved",
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

      about: {
        title: "भारत 19 एक्सप्रेस के बारे में",
        heading: "भारत 19 एक्सप्रेस",
        intro:
          "भारत 19 एक्सप्रेस एक भरोसेमंद हिंदी न्यूज़ प्लेटफॉर्म है। हमारा उद्देश्य महत्वपूर्ण खबरों को सरल, स्पष्ट और तेज़ तरीके से आप तक पहुँचाना है।",
        missionTitle: "हमारा मिशन",
        mission:
          "हमारा मिशन राजनीति, राष्ट्रीय, अंतरराष्ट्रीय, खेल, मनोरंजन, व्यापार, तकनीक और स्थानीय समाचारों की विश्वसनीय पत्रकारिता, तथ्यात्मक रिपोर्टिंग और ताज़ा अपडेट प्रदान करना है।",
        visionTitle: "हमारा विज़न",
        vision:
          "तेज़ी, पारदर्शिता और विश्वसनीयता के साथ गुणवत्तापूर्ण पत्रकारिता प्रदान करके देश के सबसे भरोसेमंद डिजिटल समाचार संगठनों में शामिल होना हमारा विज़न है।",
        coverTitle: "हम किन विषयों पर खबरें देते हैं",
        politics: "राजनीति",
        national: "राष्ट्रीय समाचार",
        states: "राज्य समाचार",
        business: "व्यापार",
        sports: "खेल",
        entertainment: "मनोरंजन",
        technology: "तकनीक",
        health: "स्वास्थ्य",
        world: "विश्व समाचार",
        latestNews: "ताज़ा खबरें",
        popularNews: "लोकप्रिय खबरें",
      },

      youtubeButton: "यूट्यूब",
      youtubeChannels: "हमारे यूट्यूब चैनल",
      login: "लॉगिन",
      channelNation: "भारत 19 एक्सप्रेस नेशन",
      channelRegional: "भारत 19 एक्सप्रेस रीजनल",
      channelEntertainment: "भारत 19 एंटरटेनमेंट",
      channelMain: "भारत 19 एक्सप्रेस",
      copyright: "कॉपीराइट",
      allRightsReserved: "सर्वाधिकार सुरक्षित",
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

      copyright: "کاپی رائٹ",
      allRightsReserved: "جملہ حقوق محفوظ ہیں",

      about: {
        title: "بھارت 19 ایکسپریس کے بارے میں",
        heading: "بھارت 19 ایکسپریس",
        intro:
          "بھارت 19 ایکسپریس ایک قابل اعتماد ہندی نیوز پلیٹ فارم ہے۔ ہمارا مقصد اہم خبروں کو آسان، واضح اور تیز انداز میں آپ تک پہنچانا ہے۔",
        missionTitle: "ہمارا مشن",
        mission:
          "ہمارا مشن سیاست، قومی، بین الاقوامی، کھیل، تفریح، کاروبار، ٹیکنالوجی اور مقامی خبروں سے متعلق قابل اعتماد صحافت، حقائق پر مبنی رپورٹنگ اور تازہ ترین اپ ڈیٹس فراہم کرنا ہے۔",
        visionTitle: "ہمارا وژن",
        vision:
          "تیز رفتار، شفاف اور قابل اعتماد صحافت کے ذریعے ملک کے معتبر ترین ڈیجیٹل نیوز اداروں میں شامل ہونا ہمارا وژن ہے۔",
        coverTitle: "ہم کن موضوعات کا احاطہ کرتے ہیں",
        politics: "سیاست",
        national: "قومی خبریں",
        states: "ریاستی خبریں",
        business: "کاروبار",
        sports: "کھیل",
        entertainment: "تفریح",
        technology: "ٹیکنالوجی",
        health: "صحت",
        world: "عالمی خبریں",
        latestNews: "تازہ خبریں",
        popularNews: "مقبول خبریں",
      },
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

      about: {
        title: "ভারত ১৯ এক্সপ্রেস সম্পর্কে",
        heading: "ভারত ১৯ এক্সপ্রেস",
        intro:
          "ভারত ১৯ এক্সপ্রেস একটি নির্ভরযোগ্য হিন্দি নিউজ প্ল্যাটফর্ম। আমাদের লক্ষ্য গুরুত্বপূর্ণ খবর সহজ, স্পষ্ট এবং দ্রুতভাবে আপনার কাছে পৌঁছে দেওয়া।",
        missionTitle: "আমাদের লক্ষ্য",
        mission:
          "রাজনীতি, জাতীয়, আন্তর্জাতিক, খেলাধুলা, বিনোদন, ব্যবসা, প্রযুক্তি এবং স্থানীয় সংবাদ সম্পর্কে নির্ভরযোগ্য সাংবাদিকতা, তথ্যভিত্তিক প্রতিবেদন ও তাৎক্ষণিক আপডেট দেওয়াই আমাদের লক্ষ্য।",
        visionTitle: "আমাদের দৃষ্টিভঙ্গি",
        vision:
          "গুণগত সাংবাদিকতা, দ্রুততা, স্বচ্ছতা এবং বিশ্বাসযোগ্যতার মাধ্যমে দেশের অন্যতম নির্ভরযোগ্য ডিজিটাল সংবাদমাধ্যম হয়ে ওঠা আমাদের দৃষ্টিভঙ্গি।",
        coverTitle: "আমরা যে বিষয়গুলি কভার করি",
        politics: "রাজনীতি",
        national: "জাতীয় সংবাদ",
        states: "রাজ্যের সংবাদ",
        business: "ব্যবসা",
        sports: "খেলাধুলা",
        entertainment: "বিনোদন",
        technology: "প্রযুক্তি",
        health: "স্বাস্থ্য",
        world: "বিশ্ব সংবাদ",
        latestNews: "সর্বশেষ খবর",
        popularNews: "জনপ্রিয় খবর",
      },
      youtubeButton: "ইউটিউব",
      youtubeChannels: "আমাদের ইউটিউব চ্যানেল",
      login: "লগইন",
      channelNation: "ভারত ১৯ এক্সপ্রেস নেশন",
      channelRegional: "ভারত ১৯ এক্সপ্রেস রিজিওনাল",
      channelEntertainment: "ভারত ১৯ এন্টারটেইনমেন্ট",
      channelMain: "ভারত ১৯ এক্সপ্রেস",
      copyright: "কপিরাইট",
      allRightsReserved: "সর্বস্বত্ব সংরক্ষিত",
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

      about: {
        title: "भारत १९ एक्सप्रेसबद्दल",
        heading: "भारत १९ एक्सप्रेस",
        intro:
          "भारत १९ एक्सप्रेस हे एक विश्वासार्ह हिंदी न्यूज प्लॅटफॉर्म आहे. महत्त्वाच्या बातम्या सोप्या, स्पष्ट आणि जलद पद्धतीने तुमच्यापर्यंत पोहोचवणे हा आमचा उद्देश आहे.",
        missionTitle: "आमचे ध्येय",
        mission:
          "राजकारण, राष्ट्रीय, आंतरराष्ट्रीय, क्रीडा, मनोरंजन, व्यवसाय, तंत्रज्ञान आणि स्थानिक बातम्यांबाबत विश्वासार्ह पत्रकारिता, तथ्याधारित वृत्तांकन आणि ताज्या बातम्या देणे हे आमचे ध्येय आहे.",
        visionTitle: "आमची दृष्टी",
        vision:
          "गुणवत्तापूर्ण पत्रकारिता, वेग, पारदर्शकता आणि विश्वासार्हतेद्वारे देशातील सर्वात विश्वासार्ह डिजिटल वृत्तसंस्थांपैकी एक बनणे ही आमची दृष्टी आहे.",
        coverTitle: "आम्ही कोणत्या विषयांवर बातम्या देतो",
        politics: "राजकारण",
        national: "राष्ट्रीय बातम्या",
        states: "राज्य बातम्या",
        business: "व्यवसाय",
        sports: "क्रीडा",
        entertainment: "मनोरंजन",
        technology: "तंत्रज्ञान",
        health: "आरोग्य",
        world: "जागतिक बातम्या",
        latestNews: "ताज्या बातम्या",
        popularNews: "लोकप्रिय बातम्या",
      },

      youtubeButton: "यूट्यूब",
      youtubeChannels: "आमचे यूट्यूब चॅनेल",
      login: "लॉगिन",
      channelNation: "भारत १९ एक्सप्रेस नेशन",
      channelRegional: "भारत १९ एक्सप्रेस रिजनल",
      channelEntertainment: "भारत १९ एंटरटेनमेंट",
      channelMain: "भारत १९ एक्सप्रेस",
      copyright: "कॉपीराइट",
      allRightsReserved: "सर्व हक्क राखीव",
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
