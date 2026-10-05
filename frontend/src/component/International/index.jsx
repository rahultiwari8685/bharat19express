import React, { useEffect, useState } from "react";
import FontAwesome from "../uiStyle/FontAwesome";
import { Link } from "react-router-dom";

const API = "https://api.iotaclasses.in";

// National category ID
const NATIONAL_CATEGORY_ID = "6ab3e06740046655dd2db1e5";

const International = () => {
  const [nationalNews, setNationalNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNationalNews();
  }, []);

  const fetchNationalNews = async () => {
    try {
      const res = await fetch(
        `${API}/api/news/category/${NATIONAL_CATEGORY_ID}?limit=10`,
      );

      const data = await res.json();

      if (data.status && Array.isArray(data.data)) {
        const news = data.data
          // Published news
          .filter((item) => Number(item.type) === 1)
          // Latest first
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 5);

        setNationalNews(news);
      }
    } catch (error) {
      console.error("National News API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="international_news white_bg padding20 border-radious5 sm-mt30">
        <h3 className="widget-title">National</h3>

        <div className="text-center py-3">Loading...</div>
      </div>
    );
  }

  if (nationalNews.length === 0) {
    return (
      <div className="international_news white_bg padding20 border-radious5 sm-mt30">
        <h3 className="widget-title">National</h3>

        <div className="text-center py-3">No national news available</div>
      </div>
    );
  }

  return (
    <div className="international_news white_bg padding20 border-radious5 sm-mt30">
      <h3 className="widget-title">National</h3>

      {nationalNews.map((item, i) => {
        const image = item.thumbnail
          ? `${API}/uploads/images/${item.thumbnail}`
          : "/images/no-image.jpg";

        const newsUrl = `/news/${item.slug}`;

        const category = item.categories?.[0];

        return (
          <div key={item._id || i}>
            <div className="single_international">
              {/* CATEGORY */}
              <p className="meta before">
                <Link to={category?.slug ? `/category/${category.slug}` : "#"}>
                  {category?.name || "National"}
                </Link>
              </p>

              {/* TITLE */}
              <h4>
                <Link to={newsUrl}>{item.title}</Link>
              </h4>

              <div className="space-10" />

              {/* AUTHOR */}
              <div className="view_author">
                <FontAwesome name="user-circle mr-1" />

                <Link to="/">
                  {item.author?.name || item.authorName || "Admin"}
                </Link>
              </div>

              <div className="space-5" />

              <div className="row">
                {/* DESCRIPTION */}
                <div className="col-8 align-self-center">
                  <p>
                    {item.description
                      ? item.description.length > 150
                        ? `${item.description.substring(0, 150)}...`
                        : item.description
                      : item.shortDescription
                        ? item.shortDescription.length > 150
                          ? `${item.shortDescription.substring(0, 150)}...`
                          : item.shortDescription
                        : "Read the latest national news and updates."}
                  </p>
                </div>

                {/* IMAGE */}
                <div className="col-4 align-self-center">
                  <div className="img_wrap">
                    <Link to={newsUrl}>
                      <img src={image} alt={item.title || "National News"} />
                    </Link>
                  </div>
                </div>
              </div>

              {/* VIEWS / LIKES / SHARE */}

              <ul className="mt20 like_cm">
                <li>
                  <Link to={newsUrl}>
                    <FontAwesome name="eye" /> {item.views || 0}
                  </Link>
                </li>

                <li>
                  <Link to={newsUrl}>
                    <FontAwesome name="heart" /> {item.likes || 0}
                  </Link>
                </li>

                <li>
                  <Link to={newsUrl}>
                    <FontAwesome name="share" /> {item.shares || 0}
                  </Link>
                </li>
              </ul>
            </div>

            {/* SEPARATOR */}

            {i + 1 < nationalNews.length && (
              <>
                <div className="space-5" />
                <div className="border_black" />
                <div className="space-15" />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default International;
