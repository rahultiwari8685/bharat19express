import axios from "axios";
import mongoose from "mongoose";
import News from "../models/News.js";

import { sendNotification } from "../services/sendNotification.js";
import NotificationToken from "../models/NotificationToken.js";
import { TranslationServiceClient } from "@google-cloud/translate";
/*
|--------------------------------------------------------------------------
| Supported Languages
|--------------------------------------------------------------------------
*/

const SUPPORTED_LANGUAGES = ["en", "hi", "bn", "mr", "ta"];

const TRANSLATION_TARGETS = ["en", "bn", "mr", "ta"];

/*
|--------------------------------------------------------------------------
| Get Language
|--------------------------------------------------------------------------
*/

const getLanguage = (req) => {
  const lang = req.query.lang || "en";

  return SUPPORTED_LANGUAGES.includes(lang) ? lang : "en";
};

/*
|--------------------------------------------------------------------------
| Normalize Translation Content
|--------------------------------------------------------------------------
|
| TinyMCE / Editor content can sometimes be an object.
| Google Translate expects text/html.
|
*/

const normalizeTranslationContent = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify(value);
};

/*
|--------------------------------------------------------------------------
| Apply Translation
|--------------------------------------------------------------------------
|
| API response will continue returning:
|
| title
| subtitle
| content
|
| according to ?lang=
|
*/

const applyTranslation = (news, lang = "en") => {
  if (!news) return news;

  const item = news.toObject ? news.toObject() : { ...news };

  const translation = item.translations?.[lang] || {};

  return {
    ...item,

    title: translation.title || item.title || "",

    subtitle: translation.subtitle || item.subtitle || "",

    content: translation.content || item.content || {},
  };
};

const googleTranslationConfig = () => ({
  projectIdConfigured: Boolean(process.env.GOOGLE_CLOUD_PROJECT_ID),
  credentialsPathConfigured: Boolean(
    process.env.GOOGLE_APPLICATION_CREDENTIALS,
  ),
});

const generateGoogleTranslations = async ({ title, subtitle, content }) => {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;

  if (!projectId) {
    throw new Error(
      "GOOGLE_CLOUD_PROJECT_ID is not configured in the backend .env file.",
    );
  }

  const normalizedContent = normalizeTranslationContent(content);

  const translations = {
    hi: {
      title: title || "",
      subtitle: subtitle || "",
      content: normalizedContent,
    },
  };

  const translationClient = new TranslationServiceClient();

  const sourceValues = {
    title: title || "",
    subtitle: subtitle || "",
    content: normalizedContent,
  };

  for (const target of TRANSLATION_TARGETS) {
    try {
      console.log(`Translating Hindi news: hi -> ${target}`);

      const contents = [
        sourceValues.title,
        sourceValues.subtitle,
        sourceValues.content,
      ];

      const [response] = await translationClient.translateText({
        parent: `projects/${projectId}/locations/global`,
        contents,
        mimeType: "text/html",
        sourceLanguageCode: "hi",
        targetLanguageCode: target,
      });

      const values = response?.translations || [];

      translations[target] = {
        title: values[0]?.translatedText || "",
        subtitle: values[1]?.translatedText || "",
        content: values[2]?.translatedText || "",
      };

      console.log(
        `Translation completed: hi -> ${target} | ` +
          `title=${Boolean(translations[target].title)} | ` +
          `subtitle=${Boolean(translations[target].subtitle)} | ` +
          `content=${Boolean(translations[target].content)}`,
      );
    } catch (error) {
      console.error(`Google Translation failed for ${target}:`);

      if (error?.message) {
        console.error(error.message);
      }

      if (error?.details) {
        console.error(error.details);
      }

      translations[target] = {
        title: "",
        subtitle: "",
        content: "",
      };
    }
  }

  return translations;
};

const getTranslationStatus = (translations = {}) => {
  return Object.fromEntries(
    TRANSLATION_TARGETS.map((language) => [
      language,
      Boolean(
        translations?.[language]?.title ||
        translations?.[language]?.subtitle ||
        translations?.[language]?.content,
      ),
    ]),
  );
};

export const createNews = async (req, res) => {
  try {
    const {
      title,
      sub_title,
      video_type,
      youtube_url,
      content,
      slug,
      type,
      scheduledAt,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Categories
    |--------------------------------------------------------------------------
    */

    let categories = [];

    try {
      categories = JSON.parse(req.body.categories || "[]");
    } catch (err) {
      categories = [];
    }

    categories = categories
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    /*
    |--------------------------------------------------------------------------
    | Schedule Date
    |--------------------------------------------------------------------------
    */

    let scheduledDate = null;

    if (scheduledAt) {
      scheduledDate = new Date(new Date(scheduledAt).getTime() - 19800000);
    }

    /*
    |--------------------------------------------------------------------------
    | Duplicate News Check
    |--------------------------------------------------------------------------
    */

    const existingNews = await News.findOne({
      title: title.trim(),

      author: req.body.author,

      type: 1,
    });

    if (existingNews) {
      return res.status(400).json({
        status: false,
        message: "News already exists",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Duplicate Slug Check
    |--------------------------------------------------------------------------
    */

    if (slug && slug.trim()) {
      const existingSlug = await News.findOne({
        slug: slug.trim(),
      });

      if (existingSlug) {
        return res.status(400).json({
          status: false,
          message: "Slug already exists",
        });
      }
    }

    /*
    |--------------------------------------------------------------------------
    | GOOGLE TRANSLATION
    |--------------------------------------------------------------------------
    |
    | Hindi is the source.
    |
    */

    console.log("========================================");

    console.log("Generating automatic translations...");

    const translations = await generateGoogleTranslations({
      title,
      subtitle: sub_title,
      content,
    });

    console.log("Automatic translations completed.");

    console.log("========================================");

    /*
    |--------------------------------------------------------------------------
    | Create News
    |--------------------------------------------------------------------------
    */

    const createdNews = await News.create({
      /*
      |--------------------------------------------------------------------------
      | Hindi Source
      |--------------------------------------------------------------------------
      */

      title: title || "",

      subtitle: sub_title || "",

      content: content || "",

      /*
      |--------------------------------------------------------------------------
      | Automatic Translations
      |--------------------------------------------------------------------------
      */

      translations,

      /*
      |--------------------------------------------------------------------------
      | Other Fields
      |--------------------------------------------------------------------------
      */

      author: req.body.author,

      categories,

      ...(slug && slug.trim()
        ? {
            slug: slug.trim(),
          }
        : {}),

      videoType: video_type,

      youtubeUrl: youtube_url || "",

      type: Number(type),

      scheduledAt: scheduledDate,

      isScheduled: Number(type) === 3,

      thumbnail: req.file?.filename || "",
    });

    /*
    |--------------------------------------------------------------------------
    | Push Notification
    |--------------------------------------------------------------------------
    */

    if (Number(createdNews.type) === 1) {
      console.log("=================================");

      console.log("Sending Push Notification...");

      console.log("News:", createdNews.title);

      const tokens = await NotificationToken.find();

      console.log("Total Tokens:", tokens.length);

      if (tokens.length > 0) {
        await sendNotification(
          tokens.map((item) => item.token),
          createdNews,
        );

        console.log("Push Notification Sent");
      } else {
        console.log("No Device Tokens Found");
      }

      console.log("=================================");
    }

    /*
    |--------------------------------------------------------------------------
    | Populate
    |--------------------------------------------------------------------------
    */

    const news = await News.findById(createdNews._id)
      .populate("author", "name email")
      .populate("categories", "name slug");

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    return res.status(201).json({
      status: true,

      message: "News created successfully",

      data: news,
    });
  } catch (error) {
    console.error("Create News Error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        status: false,
        message: "News already exists",
      });
    }

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET PUBLISHED NEWS
|--------------------------------------------------------------------------
*/

export const getNews = async (req, res) => {
  try {
    const { page = 1, limit } = req.query;

    const lang = getLanguage(req);

    const query = {
      type: 1,
    };

    let newsQuery = News.find(query)
      .populate("author", "name email")
      .populate("categories", "name slug")
      .sort({
        createdAt: -1,
      });

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    if (limit) {
      const pageNumber = parseInt(page);

      const limitNumber = parseInt(limit);

      newsQuery = newsQuery
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);
    }

    const news = await newsQuery;

    /*
    |--------------------------------------------------------------------------
    | Translation
    |--------------------------------------------------------------------------
    */

    const translatedNews = news.map((item) => applyTranslation(item, lang));

    const total = await News.countDocuments(query);

    return res.status(200).json({
      status: true,

      total,

      totalPages: limit ? Math.ceil(total / parseInt(limit)) : 1,

      data: translatedNews,
    });
  } catch (error) {
    console.error("Get News Error:", error);

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET ALL DRAFT NEWS
|--------------------------------------------------------------------------
*/

export const getAllDraftNews = async (req, res) => {
  try {
    const { page = 1, limit = 10, author } = req.query;

    const query = {
      type: 2,
    };

    /*
      |--------------------------------------------------------------------------
      | Author Filter
      |--------------------------------------------------------------------------
      */

    if (author) {
      if (!mongoose.Types.ObjectId.isValid(author)) {
        return res.status(400).json({
          status: false,
          message: "Invalid author ID",
        });
      }

      query.author = author;
    }

    const pageNumber = parseInt(page);

    const limitNumber = parseInt(limit);

    const skip = (pageNumber - 1) * limitNumber;

    /*
      |--------------------------------------------------------------------------
      | Get Drafts
      |--------------------------------------------------------------------------
      */

    const news = await News.find(query)
      .populate("author", "name email profileImage")
      .populate("categories", "name slug")
      .sort({
        updatedAt: -1,
      })
      .skip(skip)
      .limit(limitNumber);

    const total = await News.countDocuments(query);

    return res.status(200).json({
      status: true,

      total,

      page: pageNumber,

      limit: limitNumber,

      totalPages: Math.ceil(total / limitNumber),

      data: news,
    });
  } catch (error) {
    console.error("Get All Draft News Error:", error);

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET NEWS BY CATEGORY
|--------------------------------------------------------------------------
*/

export const getAllNewsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const { page = 1, limit = 6 } = req.query;

    const lang = getLanguage(req);

    /*
      |--------------------------------------------------------------------------
      | Validate Category
      |--------------------------------------------------------------------------
      */

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid category ID",
      });
    }

    const pageNumber = parseInt(page);

    const limitNumber = parseInt(limit);

    const skip = (pageNumber - 1) * limitNumber;

    const query = {
      categories: {
        $in: [categoryId],
      },

      type: 1,
    };

    /*
      |--------------------------------------------------------------------------
      | Get News
      |--------------------------------------------------------------------------
      */

    const news = await News.find(query)
      .populate("categories", "name slug _id")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limitNumber);

    /*
      |--------------------------------------------------------------------------
      | Translation
      |--------------------------------------------------------------------------
      */

    const translatedNews = news.map((item) => applyTranslation(item, lang));

    const total = await News.countDocuments(query);

    return res.status(200).json({
      status: true,

      totalPages: Math.ceil(total / limitNumber),

      total,

      data: translatedNews,
    });
  } catch (error) {
    console.error("Get News By Category Error:", error);

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET NEWS BY SLUG
|--------------------------------------------------------------------------
*/

export const getNewsBySlug = async (req, res) => {
  try {
    const lang = getLanguage(req);

    const oldSlug = req.params.slug;

    /*
      |--------------------------------------------------------------------------
      | Old Slug Redirects
      |--------------------------------------------------------------------------
      */

    const slugRedirects = {
      "-2": "haryana-ko-mili-badi-jimmedari-cpa-zone-2-ki-karegi-mezbani",

      30: "sapa-ko-bada-jhatka-30-padadhikariyon-ne-thama-subhaspa-ka-daman",

      sc: "lakhimpur-hinsa-case-mein-dheeme-trial-par-sc-sakht-ashish-mishra-mamle-mein-mangi-nayi-report",

      "up--": "up-mein-congress-spa-ka-hoga-safaya-keshav",
    };

    if (slugRedirects[oldSlug]) {
      const newSlug = slugRedirects[oldSlug];

      return res.redirect(301, `/news/${newSlug}`);
    }

    /*
      |--------------------------------------------------------------------------
      | Find News
      |--------------------------------------------------------------------------
      */

    const news = await News.findOne({
      slug: oldSlug,
    })
      .populate("author", "name email profileImage")
      .populate("categories", "name slug _id");

    if (!news) {
      return res.status(404).json({
        status: false,
        message: "News not found",
      });
    }

    return res.status(200).json({
      status: true,

      data: applyTranslation(news, lang),
    });
  } catch (error) {
    console.error("Get News By Slug Error:", error);

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET NEWS BY ID
|--------------------------------------------------------------------------
*/

export const getNewsById = async (req, res) => {
  try {
    const lang = getLanguage(req);

    const { id } = req.params;

    const news = await News.findById(id).populate("categories", "name slug");

    if (!news) {
      return res.status(404).json({
        status: false,
        message: "News not found",
      });
    }

    return res.status(200).json({
      status: true,

      data: applyTranslation(news, lang),
    });
  } catch (error) {
    console.error("Get News By ID Error:", error);

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE NEWS
|--------------------------------------------------------------------------
*/

export const updateNews = async (req, res) => {
  try {
    const {
      id,
      title,
      sub_title,
      video_type,
      youtube_url,
      content,
      slug,
      type,
      scheduledAt,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Validate ID
    |--------------------------------------------------------------------------
    */

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid news ID",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Find Existing News
    |--------------------------------------------------------------------------
    */

    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({
        status: false,
        message: "News not found",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Categories
    |--------------------------------------------------------------------------
    */

    let categories = [];

    try {
      categories = JSON.parse(req.body.categories || "[]");
    } catch (error) {
      categories = [];
    }

    categories = categories
      .filter((categoryId) => mongoose.Types.ObjectId.isValid(categoryId))
      .map((categoryId) => new mongoose.Types.ObjectId(categoryId));

    /*
    |--------------------------------------------------------------------------
    | Existing Translations
    |--------------------------------------------------------------------------
    */

    // let parsedTranslations = news.translations || {};

    // if (translations) {
    //   try {
    //     parsedTranslations =
    //       typeof translations === "string"
    //         ? JSON.parse(translations)
    //         : translations;
    //   } catch (error) {
    //     console.error("Translation Parse Error:", error);
    //   }
    // }

    /*
    |--------------------------------------------------------------------------
    | Slug Duplicate Check
    |--------------------------------------------------------------------------
    */

    if (slug && slug.trim()) {
      const existingSlug = await News.findOne({
        slug: slug.trim(),

        _id: {
          $ne: id,
        },
      });

      if (existingSlug) {
        return res.status(400).json({
          status: false,
          message: "Slug already exists",
        });
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Generate Automatic Translation
    |--------------------------------------------------------------------------
    |
    | Hindi is the source language.
    |
    | Every time the published/saved news is
    | updated, translations are regenerated.
    |
    */

    console.log("========================================");

    console.log("Generating translations for updated news...");

    const automaticTranslations = await generateGoogleTranslations({
      title,
      subtitle: sub_title,
      content,
    });

    console.log("Updated translations generated.");

    console.log("========================================");

    /*
    |--------------------------------------------------------------------------
    | Schedule Date
    |--------------------------------------------------------------------------
    */

    let scheduledDate = null;

    if (scheduledAt) {
      scheduledDate = new Date(new Date(scheduledAt).getTime() - 19800000);
    }

    /*
    |--------------------------------------------------------------------------
    | Update News
    |--------------------------------------------------------------------------
    */

    news.title = title || "";

    news.subtitle = sub_title || "";

    news.content = content || "";

    news.categories = categories;

    news.videoType = video_type;

    news.youtubeUrl = youtube_url || "";

    /*
    |--------------------------------------------------------------------------
    | Automatic Translation
    |--------------------------------------------------------------------------
    |
    | Ignore old manually supplied translations
    | when Hindi source is updated.
    |
    */

    news.translations = automaticTranslations;

    /*
    |--------------------------------------------------------------------------
    | Slug
    |--------------------------------------------------------------------------
    */

    if (slug && slug.trim()) {
      news.slug = slug.trim();
    }

    /*
    |--------------------------------------------------------------------------
    | Type
    |--------------------------------------------------------------------------
    */

    if (type !== undefined) {
      news.type = Number(type);

      news.isScheduled = Number(type) === 3;
    }

    /*
    |--------------------------------------------------------------------------
    | Schedule
    |--------------------------------------------------------------------------
    */

    news.scheduledAt = scheduledDate;

    /*
    |--------------------------------------------------------------------------
    | Thumbnail
    |--------------------------------------------------------------------------
    */

    if (req.file) {
      news.thumbnail = req.file.filename;
    }

    /*
    |--------------------------------------------------------------------------
    | Save
    |--------------------------------------------------------------------------
    */

    await news.save();

    /*
    |--------------------------------------------------------------------------
    | Push Notification
    |--------------------------------------------------------------------------
    */

    if (Number(news.type) === 1) {
      console.log("================================");

      console.log("Sending Notification...");

      console.log("News:", news.title);

      const tokens = await NotificationToken.find().select("token");

      console.log("Total Tokens:", tokens.length);

      if (tokens.length > 0) {
        await sendNotification(
          tokens.map((item) => item.token),
          news,
        );

        console.log("Notification Sent Successfully");
      } else {
        console.log("No Device Tokens Found");
      }

      console.log("================================");
    }

    /*
    |--------------------------------------------------------------------------
    | Populate
    |--------------------------------------------------------------------------
    */

    const updatedNews = await News.findById(news._id)
      .populate("author", "name email profileImage")
      .populate("categories", "name slug");

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    return res.status(200).json({
      status: true,

      message: "News updated successfully",

      data: updatedNews,
    });
  } catch (error) {
    console.error("Update News Error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        status: false,
        message: "News already exists",
      });
    }

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| DELETE NEWS
|--------------------------------------------------------------------------
*/

export const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    /*
    |--------------------------------------------------------------------------
    | Validate ID
    |--------------------------------------------------------------------------
    */

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: false,
        message: "Invalid news ID",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Delete
    |--------------------------------------------------------------------------
    */

    const news = await News.findByIdAndDelete(id);

    if (!news) {
      return res.status(404).json({
        status: false,
        message: "News not found",
      });
    }

    return res.status(200).json({
      status: true,

      message: "News deleted successfully",
    });
  } catch (error) {
    console.error("Delete News Error:", error);

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET ALL NEWS BY AUTHOR
|--------------------------------------------------------------------------
*/

export const getAllNewsByAuthorId = async (req, res) => {
  try {
    const { authorId } = req.params;

    const { page = 1, limit = 10 } = req.query;

    /*
      |--------------------------------------------------------------------------
      | Validate Author
      |--------------------------------------------------------------------------
      */

    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid author ID",
      });
    }

    const pageNumber = parseInt(page);

    const limitNumber = parseInt(limit);

    const skip = (pageNumber - 1) * limitNumber;

    /*
      |--------------------------------------------------------------------------
      | Query
      |--------------------------------------------------------------------------
      */

    const query = {
      author: authorId,
    };

    /*
      |--------------------------------------------------------------------------
      | Get News
      |--------------------------------------------------------------------------
      */

    const news = await News.find(query)
      .populate("author", "name email profileImage")
      .populate("categories", "name slug")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limitNumber);

    /*
      |--------------------------------------------------------------------------
      | Total
      |--------------------------------------------------------------------------
      */

    const total = await News.countDocuments(query);

    /*
      |--------------------------------------------------------------------------
      | Response
      |--------------------------------------------------------------------------
      */

    return res.status(200).json({
      status: true,

      totalPages: Math.ceil(total / limitNumber),

      total,

      data: news,
    });
  } catch (error) {
    console.error("Get News By Author Error:", error);

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| AUTO SAVE NEWS
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| Auto-save should NOT call Google Translate.
|
| Otherwise every few seconds:
|
| Hindi → Google API
|
| This would consume translation quota.
|
| Auto-save stores only Hindi.
|
|--------------------------------------------------------------------------
*/

export const autoSaveNews = async (req, res) => {
  try {
    const { title, subtitle, categories, videoType, content, slug } = req.body;

    /*
      |--------------------------------------------------------------------------
      | Parse Categories
      |--------------------------------------------------------------------------
      */

    let parsedCategories = [];

    try {
      parsedCategories = JSON.parse(categories || "[]");
    } catch (error) {
      parsedCategories = [];
    }

    parsedCategories = parsedCategories
      .filter((id) => mongoose.Types.ObjectId.isValid(id))
      .map((id) => new mongoose.Types.ObjectId(id));

    /*
      |--------------------------------------------------------------------------
      | Find Latest Draft
      |--------------------------------------------------------------------------
      */

    let draft = await News.findOne({
      author: req.body.author,

      type: 2,
    }).sort({
      updatedAt: -1,
    });

    /*
      |--------------------------------------------------------------------------
      | Slug Check
      |--------------------------------------------------------------------------
      */

    if (slug && slug.trim()) {
      const existingSlug = await News.findOne({
        slug: slug.trim(),

        _id: {
          $ne: draft?._id,
        },
      });

      if (existingSlug) {
        return res.status(400).json({
          status: false,
          message: "Slug already exists",
        });
      }
    }

    /*
      |--------------------------------------------------------------------------
      | Hindi Translation Object
      |--------------------------------------------------------------------------
      |
      | Only Hindi is stored during auto-save.
      |
      */

    const hindiTranslation = {
      hi: {
        title: title || "",

        subtitle: subtitle || "",

        content: normalizeTranslationContent(content),
      },
    };

    /*
      |--------------------------------------------------------------------------
      | Update Existing Draft
      |--------------------------------------------------------------------------
      */

    if (draft) {
      draft.title = title || "";

      draft.subtitle = subtitle || "";

      if (slug && slug.trim()) {
        draft.slug = slug.trim();
      }

      draft.categories = parsedCategories;

      draft.videoType = videoType;

      draft.content =
        typeof content === "string" ? content : JSON.stringify(content || {});

      /*
        |--------------------------------------------------------------------------
        | Save Hindi Only
        |--------------------------------------------------------------------------
        */

      draft.translations = hindiTranslation;

      /*
        |--------------------------------------------------------------------------
        | Thumbnail
        |--------------------------------------------------------------------------
        */

      if (req.file) {
        draft.thumbnail = req.file.filename;
      }

      await draft.save();
    } else {
      /*
        |--------------------------------------------------------------------------
        | Create New Draft
        |--------------------------------------------------------------------------
        */

      draft = await News.create({
        title: title || "",

        subtitle: subtitle || "",

        ...(slug && slug.trim()
          ? {
              slug: slug.trim(),
            }
          : {}),

        categories: parsedCategories,

        videoType,

        /*
            |--------------------------------------------------------------------------
            | Hindi Only
            |--------------------------------------------------------------------------
            */

        translations: hindiTranslation,

        content:
          typeof content === "string" ? content : JSON.stringify(content || {}),

        type: 2,

        author: req.body.author,

        thumbnail: req.file?.filename || "",

        youtubeUrl: "",
      });
    }

    /*
      |--------------------------------------------------------------------------
      | Response
      |--------------------------------------------------------------------------
      */

    return res.json({
      status: true,

      message: "Draft auto-saved",

      data: draft,
    });
  } catch (error) {
    console.error("AUTO SAVE ERROR:", error);

    return res.status(500).json({
      status: false,

      message: "Auto save failed",

      error: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| INCREASE VIEW
|--------------------------------------------------------------------------
*/

export const increaseView = async (req, res) => {
  try {
    const { id } = req.params;

    await News.findByIdAndUpdate(id, {
      $inc: {
        views: 1,
      },
    });

    return res.json({
      status: true,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| TRENDING NEWS
|--------------------------------------------------------------------------
*/

export const getTrendingNews = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const lang = getLanguage(req);

    /*
      |--------------------------------------------------------------------------
      | Last 7 Days
      |--------------------------------------------------------------------------
      */

    const last7Days = new Date();

    last7Days.setDate(last7Days.getDate() - 7);

    /*
      |--------------------------------------------------------------------------
      | Get Trending
      |--------------------------------------------------------------------------
      */

    const news = await News.find({
      type: 1,

      createdAt: {
        $gte: last7Days,
      },
    })
      .populate("author", "name")
      .populate("categories", "name slug")
      .sort({
        views: -1,

        createdAt: -1,
      })
      .limit(parseInt(limit));

    /*
      |--------------------------------------------------------------------------
      | Apply Translation
      |--------------------------------------------------------------------------
      */

    const translatedNews = news.map((item) => applyTranslation(item, lang));

    return res.status(200).json({
      status: true,

      total: news.length,

      data: translatedNews,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| POPULAR NEWS
|--------------------------------------------------------------------------
*/

export const getPopularNews = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const lang = getLanguage(req);

    /*
      |--------------------------------------------------------------------------
      | Get Popular News
      |--------------------------------------------------------------------------
      */

    const news = await News.find({
      type: 1,
    })
      .populate("author", "name")
      .populate("categories", "name slug")
      .sort({
        views: -1,

        createdAt: -1,
      })
      .limit(parseInt(limit));

    /*
      |--------------------------------------------------------------------------
      | Apply Translation
      |--------------------------------------------------------------------------
      */

    const translatedNews = news.map((item) => applyTranslation(item, lang));

    return res.status(200).json({
      status: true,

      total: news.length,

      data: translatedNews,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| INCREASE SHARE
|--------------------------------------------------------------------------
*/

export const increaseShare = async (req, res) => {
  try {
    const { id } = req.params;

    await News.findByIdAndUpdate(id, {
      $inc: {
        shares: 1,
      },
    });

    return res.json({
      status: true,

      message: "Share updated",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| MOST SHARED NEWS
|--------------------------------------------------------------------------
*/

export const getMostSharedNews = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const lang = getLanguage(req);

    /*
      |--------------------------------------------------------------------------
      | Get Most Shared
      |--------------------------------------------------------------------------
      */

    const news = await News.find({
      type: 1,
    })
      .populate("author", "name")
      .populate("categories", "name slug")
      .sort({
        shares: -1,

        createdAt: -1,
      })
      .limit(parseInt(limit));

    /*
      |--------------------------------------------------------------------------
      | Translation
      |--------------------------------------------------------------------------
      */

    const translatedNews = news.map((item) => applyTranslation(item, lang));

    return res.status(200).json({
      status: true,

      total: news.length,

      data: translatedNews,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| VIDEO NEWS
|--------------------------------------------------------------------------
*/

export const getVideoNews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const lang = getLanguage(req);

    const pageNumber = parseInt(page);

    const limitNumber = parseInt(limit);

    const skip = (pageNumber - 1) * limitNumber;

    const query = {
      type: 1,

      videoType: 1,
    };

    /*
      |--------------------------------------------------------------------------
      | Get Video News
      |--------------------------------------------------------------------------
      */

    const news = await News.find(query)
      .populate("author", "name")
      .populate("categories", "name slug")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limitNumber);

    const total = await News.countDocuments(query);

    /*
      |--------------------------------------------------------------------------
      | Translation
      |--------------------------------------------------------------------------
      */

    const translatedNews = news.map((item) => applyTranslation(item, lang));

    return res.status(200).json({
      status: true,

      total,

      totalPages: Math.ceil(total / limitNumber),

      data: translatedNews,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| PREVIOUS / NEXT NEWS
|--------------------------------------------------------------------------
*/

export const previousNextNews = async (req, res) => {
  try {
    const { id } = req.params;

    const lang = getLanguage(req);

    /*
      |--------------------------------------------------------------------------
      | Current News
      |--------------------------------------------------------------------------
      */

    const currentNews = await News.findById(id);

    if (!currentNews) {
      return res.status(404).json({
        success: false,

        message: "News not found",
      });
    }

    /*
      |--------------------------------------------------------------------------
      | Previous
      |--------------------------------------------------------------------------
      */

    const previous = await News.findOne({
      type: 1,

      createdAt: {
        $lt: currentNews.createdAt,
      },
    })
      .sort({
        createdAt: -1,
      })
      .select("_id title subtitle slug translations");

    /*
      |--------------------------------------------------------------------------
      | Next
      |--------------------------------------------------------------------------
      */

    const next = await News.findOne({
      type: 1,

      createdAt: {
        $gt: currentNews.createdAt,
      },
    })
      .sort({
        createdAt: 1,
      })
      .select("_id title subtitle slug translations");

    /*
      |--------------------------------------------------------------------------
      | Response
      |--------------------------------------------------------------------------
      */

    return res.json({
      success: true,

      previous: previous ? applyTranslation(previous, lang) : null,

      next: next ? applyTranslation(next, lang) : null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| SHARE NEWS
|--------------------------------------------------------------------------
*/

export const shareNews = async (req, res) => {
  try {
    const news = await News.findOne({
      slug: req.params.slug,

      type: 1,
    });

    if (!news) {
      return res.status(404).send("News not found");
    }

    res.render("share", {
      title: news.title,

      description: news.subtitle || news.metaDescription || "",

      image: `https://api.iotaclasses.in/uploads/images/${news.thumbnail}`,

      url: `https://api.iotaclasses.in/api/news/share/${news.slug}`,

      frontendUrl: `https://iotaclasses.in/news/${news.slug}`,
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

/*
|--------------------------------------------------------------------------
| YOUTUBE LIVE STATUS
|--------------------------------------------------------------------------
*/

export const getLiveStatus = async (req, res) => {
  try {
    const API_KEY = process.env.YOUTUBE_API_KEY;

    const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

    console.log("API KEY:", API_KEY);

    console.log("CHANNEL:", CHANNEL_ID);

    const url = "https://www.googleapis.com/youtube/v3/search";

    const response = await axios.get(url, {
      params: {
        part: "snippet",

        channelId: CHANNEL_ID,

        eventType: "live",

        type: "video",

        key: API_KEY,
      },
    });

    /*
      |--------------------------------------------------------------------------
      | Live Available
      |--------------------------------------------------------------------------
      */

    if (response.data.items.length > 0) {
      const live = response.data.items[0];

      return res.json({
        status: true,

        isLive: true,

        videoId: live.id.videoId,

        title: live.snippet.title,

        thumbnail: live.snippet.thumbnails.high.url,
      });
    }

    /*
      |--------------------------------------------------------------------------
      | Not Live
      |--------------------------------------------------------------------------
      */

    return res.json({
      status: true,

      isLive: false,
    });
  } catch (error) {
    console.log("========== GOOGLE ERROR ==========");

    if (error.response) {
      console.log(error.response.status);

      console.log(JSON.stringify(error.response.data, null, 2));

      return res.status(error.response.status).json(error.response.data);
    }

    console.log(error.message);

    return res.status(500).json({
      status: false,

      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| NEWS META / SEO
|--------------------------------------------------------------------------
*/

export const newsMeta = async (req, res) => {
  try {
    const news = await News.findOne({
      slug: req.params.slug,

      type: 1,
    });

    if (!news) {
      return res.status(404).send("News not found");
    }

    const image = `https://api.iotaclasses.in/uploads/images/${news.thumbnail}`;

    const url = `https://iotaclasses.in/news/${news.slug}`;

    res.send(`
<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<title>${news.title}</title>

<meta
  name="description"
  content="${news.subtitle || ""}"
>

<meta
  property="og:type"
  content="article"
>

<meta
  property="og:title"
  content="${news.title}"
>

<meta
  property="og:description"
  content="${news.subtitle || ""}"
>

<meta
  property="og:image"
  content="${image}"
>

<meta
  property="og:url"
  content="${url}"
>

<meta
  name="twitter:card"
  content="summary_large_image"
>

<meta
  name="twitter:title"
  content="${news.title}"
>

<meta
  name="twitter:description"
  content="${news.subtitle || ""}"
>

<meta
  name="twitter:image"
  content="${image}"
>

<script>
window.location.href="${url}";
</script>

</head>

<body>

Redirecting...

</body>

</html>
`);
  } catch (error) {
    res.status(500).send(error.message);
  }
};
