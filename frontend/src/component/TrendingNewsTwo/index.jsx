import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TrendingCarousel from "../TrendingCarousel";
import FontAwesome from "../uiStyle/FontAwesome";

const TrendingNewsTwo = () => {
  const [featuredNews, setFeaturedNews] = useState(null);
  const [upNews, setUpNews] = useState([]);

  useEffect(() => {
    getUPNews();
  }, []);

  const getUPNews = async () => {
    try {
      const res = await fetch(
        "https://api.iotaclasses.in/api/news/category/6ab5133ae0146bb0a4a80e48?limit=10",
      );

      const data = await res.json();

      console.log("Uttar Pradesh News:", data);

      if (data.status && Array.isArray(data.data)) {
        const news = data.data
          .filter((item) => Number(item.videoType) === 2)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setUpNews(news);
        setFeaturedNews(news[0] || null);
      }
    } catch (error) {
      console.error("Uttar Pradesh News Error:", error);
    }
  };

  if (!featuredNews) return null;

  const image = featuredNews.thumbnail
    ? `https://api.iotaclasses.in/uploads/images/${featuredNews.thumbnail}`
    : "";

  const newsUrl = `/news/${featuredNews.slug}`;

  const category = featuredNews.categories?.[0];

  return (
    <div className="white_bg tranding3 padding20 border-radious5 mb30">
      {/* HEADING */}
      <div className="row">
        <div className="col-12">
          <div className="heading">
            <h2 className="widget-title">Uttar Pradesh</h2>
          </div>
        </div>
      </div>

      <div className="row">
        {/* =========================
            LEFT - FEATURED NEWS
        ========================== */}
        <div className="col-md-6">
          <div className="single_post post_type3 xs-mb90 post_type15">
            {/* IMAGE */}
            <div className="post_img border-radious5">
              <Link to={newsUrl}>
                {image && (
                  <img
                    src={image}
                    alt={featuredNews.title}
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "cover",
                    }}
                  />
                )}
              </Link>

              <span className="tranding border_tranding">
                <FontAwesome name="bolt" />
              </span>
            </div>

            {/* CONTENT */}
            <div className="single_post_text">
              <h4>
                <Link to={newsUrl}>{featuredNews.title}</Link>
              </h4>

              <div className="space-10" />

              <p className="post-p">
                {featuredNews.subtitle
                  ? featuredNews.subtitle.substring(0, 160) + "..."
                  : ""}
              </p>

              <div className="space-20" />

              <div className="meta3">
                <Link to={category?.slug ? `/category/${category.slug}` : "#"}>
                  {category?.name || "Uttar Pradesh"}
                </Link>

                <Link to={newsUrl}>
                  {new Date(featuredNews.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    },
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* =========================
            RIGHT - UP NEWS CAROUSEL
        ========================== */}
        <div className="col-md-6">
          <TrendingCarousel news={upNews.slice(0, 10)} />
        </div>
      </div>
    </div>
  );
};

export default TrendingNewsTwo;
