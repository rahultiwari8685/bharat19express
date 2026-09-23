import axios from "axios";
import mongoose from "mongoose";
import News from "../models/News.js";

import { sendNotification } from "../services/sendNotification.js";
import NotificationToken from "../models/NotificationToken.js";

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

    let categories = [];

    try {
      categories = JSON.parse(req.body.categories || "[]");
    } catch (err) {
      categories = [];
    }

    categories = categories.map((id) => new mongoose.Types.ObjectId(id));

    // Convert schedule date
    let scheduledDate = null;

    if (scheduledAt) {
      scheduledDate = new Date(new Date(scheduledAt).getTime() - 19800000);
    }

    // const existingNews = await News.findOne({
    //   title: title.trim(),
    //   author: req.body.author,
    //   type: 1,
    // });

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

    if (slug) {
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

    const createdNews = await News.create({
      title,
      subtitle: sub_title,

      author: req.body.author,

      categories,
      ...(req.body.slug && req.body.slug.trim()
        ? { slug: req.body.slug.trim() }
        : {}),
      videoType: video_type,

      youtubeUrl: youtube_url || "",

      content: content || "",

      type: Number(type),

      scheduledAt: scheduledDate,

      isScheduled: Number(type) === 3,

      thumbnail: req.file?.filename || "",
    });

    // Send Push Notification only when Published

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

        console.log("✅ Push Notification Sent");
      } else {
        console.log("❌ No Device Tokens Found");
      }

      console.log("=================================");
    }

    // populate author after create
    const news = await News.findById(createdNews._id)
      .populate("author", "name email")
      .populate("categories", "name");

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

export const getNews = async (req, res) => {
  try {
    const { page = 1, limit } = req.query;

    const query = {
      type: 1, // Published News
    };

    let newsQuery = News.find(query)
      .populate("author", "name email")
      .populate("categories", "name slug")
      .sort({ createdAt: -1 });

    // Apply pagination only if limit is provided
    if (limit) {
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);

      newsQuery = newsQuery
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber);
    }

    const news = await newsQuery;

    const total = await News.countDocuments(query);

    return res.status(200).json({
      status: true,
      total,
      totalPages: limit ? Math.ceil(total / parseInt(limit)) : 1,
      data: news,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const getAllDraftNews = async (req, res) => {
  try {
    const { page = 1, limit = 10, author } = req.query;

    const query = {
      type: 2, // Draft News
    };

    // Optional: filter drafts by author
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

    const news = await News.find(query)
      .populate("author", "name email profileImage")
      .populate("categories", "name slug")
      .sort({ updatedAt: -1 })
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

export const getAllNewsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, limit = 6 } = req.query;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid category ID",
      });
    }

    const skip = (page - 1) * limit;

    const news = await News.find({
      categories: { $in: [categoryId] },
      type: 1, // ✅ Only published news
    })
      .populate("categories", "name slug _id")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await News.countDocuments({
      categories: { $in: [categoryId] },
      type: 1, // ✅ Only published news
    });

    return res.status(200).json({
      status: true,
      totalPages: Math.ceil(total / limit),
      total,
      data: news,
    });
  } catch (error) {
    console.error("Get News By Category Error:", error);

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

// export const getNewsBySlug = async (req, res) => {
//   try {
//     const news = await News.findOne({ slug: req.params.slug })
//       .populate("author", "name email profileImage")
//       .populate("categories", "name slug _id");

//     if (!news) {
//       return res.status(404).json({
//         status: false,
//         message: "News not found",
//       });
//     }

//     return res.status(200).json({
//       status: true,
//       data: news,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       message: error.message,
//     });
//   }
// };

export const getNewsBySlug = async (req, res) => {
  try {
    const oldSlug = req.params.slug;

    // Permanent redirects for changed old slugs
    const slugRedirects = {
      "-2": "haryana-ko-mili-badi-jimmedari-cpa-zone-2-ki-karegi-mezbani",

      30: "sapa-ko-bada-jhatka-30-padadhikariyon-ne-thama-subhaspa-ka-daman",

      sc: "lakhimpur-hinsa-case-mein-dheeme-trial-par-sc-sakht-ashish-mishra-mamle-mein-mangi-nayi-report",

      "up--": "up-mein-congress-spa-ka-hoga-safaya-keshav",
    };

    // If old slug exists, redirect to new slug
    if (slugRedirects[oldSlug]) {
      const newSlug = slugRedirects[oldSlug];

      return res.redirect(301, `/news/${newSlug}`);
    }

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
      data: news,
    });
  } catch (error) {
    console.error("Get News By Slug Error:", error);

    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const getNewsById = async (req, res) => {
  try {
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
      data: news,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

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

    // ✅ SAFE PARSE
    let categories = [];
    try {
      categories = JSON.parse(req.body.categories || "[]");
    } catch (err) {
      categories = [];
    }

    // ✅ CONVERT TO OBJECTID
    categories = categories.map((id) => new mongoose.Types.ObjectId(id));

    const existingNews = await News.findOne({
      title: title.trim(),
      author: req.body.author,
      _id: { $ne: id },
      type: 1,
    });

    if (existingNews) {
      return res.status(400).json({
        status: false,
        message: "News already exists",
      });
    }

    const updateData = {
      title,
      subtitle: sub_title,
      categories,
      videoType: video_type,
      ...(slug && slug.trim() ? { slug: slug.trim() } : {}),
      youtubeUrl: youtube_url || "",

      // ✅ update content
      content: content || "",
      scheduledAt: req.body.scheduledAt
        ? new Date(new Date(req.body.scheduledAt).getTime() - 19800000)
        : null,
      isScheduled: Number(type) === 3,

      // ✅ publish draft
      type: Number(type),
    };

    if (req.file) {
      updateData.thumbnail = req.file.filename;
    }

    if (slug) {
      const existingSlug = await News.findOne({
        slug: slug.trim(),
        _id: { $ne: id },
      });

      if (existingSlug) {
        return res.status(400).json({
          status: false,
          message: "Slug already exists",
        });
      }
    }

    const updated = await News.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    // =============================
    // Send Push Notification
    // =============================

    if (Number(updated.type) === 1) {
      console.log("================================");
      console.log("Sending Notification...");
      console.log("News:", updated.title);

      const tokens = await NotificationToken.find().select("token");

      console.log("Total Tokens:", tokens.length);

      if (tokens.length > 0) {
        await sendNotification(
          tokens.map((item) => item.token),
          updated,
        );

        console.log("✅ Notification Sent Successfully");
      } else {
        console.log("❌ No Device Tokens Found");
      }

      console.log("================================");
    }

    return res.status(200).json({
      status: true,
      message: "News updated successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const deleteNews = async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      status: true,
      message: "News deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const getAllNewsByAuthorId = async (req, res) => {
  try {
    const { authorId } = req.params;

    const { page = 1, limit = 10 } = req.query;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      return res.status(400).json({
        status: false,
        message: "Invalid author ID",
      });
    }

    const skip = (page - 1) * limit;

    // Get News
    const news = await News.find({
      author: authorId,
    })
      .populate("author", "name email profileImage")
      .populate("categories", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Total Count
    const total = await News.countDocuments({
      author: authorId,
    });

    return res.status(200).json({
      status: true,
      totalPages: Math.ceil(total / limit),
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

export const autoSaveNews = async (req, res) => {
  try {
    const { title, subtitle, categories, videoType, content, type, slug } =
      req.body;

    if (Number(type) === 2) {
      console.log("Draft auto-save: translation skipped");
    }

    let parsedCategories = [];

    try {
      parsedCategories = JSON.parse(categories || "[]");
    } catch (err) {
      parsedCategories = [];
    }

    parsedCategories = parsedCategories.map(
      (id) => new mongoose.Types.ObjectId(id),
    );

    let draft = await News.findOne({
      author: req.body.author,
      type: 2,
    }).sort({ updatedAt: -1 });

    if (slug) {
      const existingSlug = await News.findOne({
        slug: slug.trim(),
        _id: { $ne: draft?._id },
      });

      if (existingSlug) {
        return res.status(400).json({
          status: false,
          message: "Slug already exists",
        });
      }
    }

    if (draft) {
      draft.title = title;
      draft.subtitle = subtitle;
      if (slug && slug.trim()) {
        draft.slug = slug.trim();
      }
      draft.categories = parsedCategories;
      draft.videoType = videoType;

      draft.content =
        typeof content === "string" ? content : JSON.stringify(content);

      if (req.file) {
        draft.thumbnail = req.file.filename;
      }

      await draft.save();
    } else {
      draft = await News.create({
        title,
        subtitle,
        ...(slug && slug.trim() ? { slug: slug.trim() } : {}),
        categories: parsedCategories,
        videoType,
        content:
          typeof content === "string" ? content : JSON.stringify(content),
        type: 2,
        author: req.body.author,
        thumbnail: req.file?.filename || "",
        youtubeUrl: "",
      });
    }

    res.json({
      status: true,
      message: "Draft auto-saved",
      data: draft,
    });
  } catch (error) {
    console.error("AUTO SAVE ERROR:", error);

    res.status(500).json({
      status: false,
      message: "Auto save failed",
      error: error.message,
    });
  }
};

export const increaseView = async (req, res) => {
  try {
    const { id } = req.params;

    await News.findByIdAndUpdate(id, {
      $inc: { views: 1 },
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

export const getTrendingNews = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // Last 7 days
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const news = await News.find({
      type: 1,
      createdAt: { $gte: last7Days },
    })
      .populate("author", "name")
      .populate("categories", "name slug")
      .sort({
        views: -1,
        createdAt: -1,
      })
      .limit(parseInt(limit));

    return res.status(200).json({
      status: true,
      total: news.length,
      data: news,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const getPopularNews = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

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

    return res.status(200).json({
      status: true,
      total: news.length,
      data: news,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

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

export const getMostSharedNews = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

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

    return res.status(200).json({
      status: true,
      total: news.length,
      data: news,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const getVideoNews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const news = await News.find({
      type: 1, // Published
      videoType: 1, // Video News
    })
      .populate("author", "name")
      .populate("categories", "name slug")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await News.countDocuments({
      type: 1,
      videoType: 1,
    });

    return res.status(200).json({
      status: true,
      total,
      totalPages: Math.ceil(total / limit),
      data: news,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};

export const previousNextNews = async (req, res) => {
  try {
    const { id } = req.params;

    const currentNews = await News.findById(id);

    if (!currentNews) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    const previous = await News.findOne({
      type: 1,
      createdAt: { $lt: currentNews.createdAt },
    })
      .sort({ createdAt: -1 })
      .select("_id title slug");

    const next = await News.findOne({
      type: 1,
      createdAt: { $gt: currentNews.createdAt },
    })
      .sort({ createdAt: 1 })
      .select("_id title slug");

    return res.json({
      success: true,
      previous,
      next,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

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
      image: `https://api.hindustantvlive.com/uploads/images/${news.thumbnail}`,
      url: `https://api.hindustantvlive.com/api/news/share/${news.slug}`,
      frontendUrl: `https://hindustantvlive.com/news/${news.slug}`,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export const getLiveStatus = async (req, res) => {
  try {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

    console.log("API KEY:", API_KEY);
    console.log("CHANNEL:", CHANNEL_ID);

    const url = `https://www.googleapis.com/youtube/v3/search`;

    const response = await axios.get(url, {
      params: {
        part: "snippet",
        channelId: CHANNEL_ID,
        eventType: "live",
        type: "video",
        key: API_KEY,
      },
    });

    console.log(response.data);

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

    return res.json({
      status: true,
      isLive: false,
    });
  } catch (err) {
    console.log("========== GOOGLE ERROR ==========");

    if (err.response) {
      console.log(err.response.status);
      console.log(JSON.stringify(err.response.data, null, 2));

      return res.status(err.response.status).json(err.response.data);
    }

    console.log(err.message);

    return res.status(500).json({
      status: false,
      message: err.message,
    });
  }
};

export const newsMeta = async (req, res) => {
  try {
    const news = await News.findOne({
      slug: req.params.slug,
      type: 1,
    });

    if (!news) {
      return res.status(404).send("News not found");
    }

    const image = `https://api.hindustantvlive.com/uploads/images/${news.thumbnail}`;
    const url = `https://hindustantvlive.com/news/${news.slug}`;

    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="UTF-8">

<title>${news.title}</title>

<meta name="description" content="${news.subtitle || ""}">

<meta property="og:type" content="article">
<meta property="og:title" content="${news.title}">
<meta property="og:description" content="${news.subtitle || ""}">
<meta property="og:image" content="${image}">
<meta property="og:url" content="${url}">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${news.title}">
<meta name="twitter:description" content="${news.subtitle || ""}">
<meta name="twitter:image" content="${image}">

<script>
window.location.href="${url}";
</script>

</head>

<body>
Redirecting...
</body>

</html>
`);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
