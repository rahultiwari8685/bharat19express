// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { useTranslation } from "react-i18next";

// const API = "https://api.bharat19express.com";

// const Opinion = () => {
//   const { i18n, t } = useTranslation();

//   const [news, setNews] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchOpinionNews();
//   }, [i18n.resolvedLanguage]);

//   const fetchOpinionNews = async () => {
//     try {
//       setLoading(true);

//       const language = i18n.resolvedLanguage || "en";

//       const res = await fetch(
//         `${API}/api/news/category/6adf44e0dbd6e030fd68abae?limit=10&lang=${language}`,
//       );

//       const data = await res.json();

//       console.log("Opinion News API:", data);
//       console.log("Current Language:", language);

   
// if (data.status && Array.isArray(data.data)) {
//   const opinionNews = data.data
//     .filter((item) => Number(item.type) === 1)
//     .filter((item) => Number(item.videoType) === 2)
//     .sort(
//       (a, b) =>
//         new Date(b.createdAt).getTime() -
//         new Date(a.createdAt).getTime(),
//     );

//   setNews(opinionNews);
// } else {
//   setNews([]);
// }

//     } catch (error) {
//       console.error("Opinion News API Error:", error);
//       setNews(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (date) => {
//     if (!date) return "";

//     const language = i18n.resolvedLanguage || "en";

//     const localeMap = {
//       en: "en-IN",
//       hi: "hi-IN",
//       ur: "ur-PK",
//       bn: "bn-IN",
//       mr: "mr-IN",
//     };

//     return new Date(date).toLocaleDateString(localeMap[language] || "en-IN", {
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     });
//   };

//   if (loading) {
//     return (
//       <div className="opinion white_bg padding20 border-radious5">
//         <h3 className="widget-title">{t("opinion", "Public Opinion")}</h3>

//         <div className="text-center py-3">{t("loading", "Loading...")}</div>
//       </div>
//     );
//   }

//   if (!news) {
//     return (
//       <div className="opinion white_bg padding20 border-radious5">
//         <h3 className="widget-title">{t("opinion", "Public Opinion")}</h3>

//         <div className="text-center py-3">
//           {t("noOpinionNews", "No opinion news available")}
//         </div>
//       </div>
//     );
//   }

//   const image = news.thumbnail
//     ? `${API}/uploads/images/${news.thumbnail}`
//     : "/images/no-image.jpg";

//   const newsUrl = `/news/${news.slug}`;

//   const category = news.categories?.[0];

//   return (
//     <div className="opinion white_bg padding20 border-radious5">
//       <h3 className="widget-title">{t("opinion", "Opinion")}</h3>

//       <div className="single_post post_type3 post_type15">
//         <div className="post_img border-radious5">
//           <Link to={newsUrl}>
//             <img src={image} alt={news.title || t("opinion", "Opinion")} />
//           </Link>
//         </div>

//         <div className="single_post_text">
//           <h4>
//             <Link to={newsUrl}>{news.title}</Link>
//           </h4>

//           <div className="space-10" />

//           {/* DESCRIPTION */}
//           <p className="post-p">
//             {news.description
//               ? news.description.length > 180
//                 ? `${news.description.substring(0, 180)}...`
//                 : news.description
//               : news.shortDescription
//                 ? news.shortDescription.length > 180
//                   ? `${news.shortDescription.substring(0, 180)}...`
//                   : news.shortDescription
//                 : t(
//                     "latestOpinionAnalysis",
//                     "Read the latest opinion and analysis.",
//                   )}
//           </p>

//           <div className="space-20" />

//           {/* META */}
//           <div className="meta3">
//             <Link to={category?.slug ? `/category/${category.slug}` : "#"}>
//               {category?.name || t("opinion", "Opinion")}
//             </Link>

//             <Link to={newsUrl}>{formatDate(news.createdAt)}</Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Opinion;


import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const API = "https://api.bharat19express.com";

const Opinion = () => {
  const { i18n, t } = useTranslation();

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpinionNews();
  }, [i18n.resolvedLanguage]);

  const fetchOpinionNews = async () => {
    try {
      setLoading(true);

      const language = i18n.resolvedLanguage || "en";

      const res = await fetch(
        `${API}/api/news/category/6adf44e0dbd6e030fd68abae?limit=2lang=${language}`
      );

      if (!res.ok) {
        throw new Error(`API request failed: ${res.status}`);
      }

      const data = await res.json();

      console.log("Opinion News API:", data);
      console.log("Current Language:", language);

      if (data.status && Array.isArray(data.data)) {
        const opinionNews = data.data
          .filter((item) => Number(item.type) === 1)
          .filter((item) => Number(item.videoType) === 2)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          );

        setNews(opinionNews);
      } else {
        setNews([]);
      }
    } catch (error) {
      console.error("Opinion News API Error:", error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    const language = i18n.resolvedLanguage || "en";

    const localeMap = {
      en: "en-IN",
      hi: "hi-IN",
      ur: "ur-PK",
      bn: "bn-IN",
      mr: "mr-IN",
    };

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "";

    return parsedDate.toLocaleDateString(
      localeMap[language] || "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  if (loading) {
    return (
      <div className="opinion white_bg padding20 border-radious5">
        <h3 className="widget-title">
          {t("opinion", "Public Opinion")}
        </h3>

        <div className="text-center py-3">
          {t("loading", "Loading...")}
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="opinion white_bg padding20 border-radious5">
        <h3 className="widget-title">
          {t("opinion", "Public Opinion")}
        </h3>

        <div className="text-center py-3">
          {t("noOpinionNews", "No opinion news available")}
        </div>
      </div>
    );
  }

  return (
    <div className="opinion white_bg padding20 border-radious5">
      <h3 className="widget-title">
        {t("opinion", "Public Opinion")}
      </h3>

      {news.map((item) => {
        const image = item.thumbnail
          ? item.thumbnail.startsWith("http")
            ? item.thumbnail
            : `${API}/uploads/images/${item.thumbnail}`
          : "/images/no-image.jpg";

        const newsUrl = `/news/${item.slug}`;

        const category = item.categories?.[0];

        const description =
          item.description || item.shortDescription || "";

        return (
          <div
            className="single_post post_type3 post_type15 mb-4"
            key={item._id || item.slug}
          >
            {/* NEWS IMAGE */}
            <div className="post_img border-radious5">
              <Link to={newsUrl}>
                <img
                  src={image}
                  alt={item.title || t("opinion", "Opinion")}
                  loading="lazy"
                />
              </Link>
            </div>

            {/* NEWS CONTENT */}
            <div className="single_post_text">
              <h4>
                <Link to={newsUrl}>
                  {item.title || t("opinion", "Opinion")}
                </Link>
              </h4>

              <div className="space-10" />

              {/* DESCRIPTION */}
              <p className="post-p">
                {description
                  ? description.length > 180
                    ? `${description.substring(0, 180)}...`
                    : description
                  : t(
                      "latestOpinionAnalysis",
                      "Read the latest opinion and analysis."
                    )}
              </p>

              <div className="space-20" />

              {/* CATEGORY AND DATE */}
              <div className="meta3">
                <Link
                  to={
                    category?.slug
                      ? `/category/${category.slug}`
                      : "#"
                  }
                >
                  {category?.name || t("opinion", "Opinion")}
                </Link>

                <Link to={newsUrl}>
                  {formatDate(item.createdAt)}
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Opinion;
