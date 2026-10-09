import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Slider from "../Slider";

const API = "https://api.iotaclasses.in";

const BreakingNews = () => {
  const { i18n } = useTranslation();
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const language = i18n.resolvedLanguage || "en";
        const response = await fetch(
          `${API}/api/news/trending?limit=10&lang=${language}`,
        );
        const result = await response.json();

        if (result.status) {
          setNews(result.data || []);
        }
      } catch (error) {
        console.error("Breaking News Error:", error);
      }
    };

    fetchNews();
  }, [i18n.resolvedLanguage]);

  return (
    <>
      <style>{`
     
.breaking-news-container {
  width: calc(100% - 40px);
  max-width: 1200px;
  height: 36px;
  min-height: 36px;
  margin: 10px auto;
  display: flex;
  align-items: center;
  overflow: hidden;
  box-sizing: border-box;
  background: #fff;
  border: 1px solid #e3e3e3;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
  font-family: Arial, sans-serif;
}


        .breaking-news-label {
          height: 36px;
          padding: 0 14px;


          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
          background: #c9151e;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          white-space: nowrap;
          border-radius: 0 18px 18px 0;
          position: relative;
          z-index: 2;
        }

        .breaking-news-dot {
          width: 8px;
          height: 8px;
          flex-shrink: 0;
          background: #fff;
          border-radius: 50%;
        }

        .breaking-news-headlines {
          flex: 1;
          min-width: 0;
          padding: 0 10px;
          overflow: hidden;
        }

        .breaking-news-slider,
        .breaking-news-slider .swiper-wrapper,
        .breaking-news-slider .swiper-slide {
          height: 34px;
        }

        .breaking-news-item {
          height: 34px;
          line-height: 34px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .breaking-news-item a {
          color: #222;
          font-size: 13px;
          text-decoration: none;
          font-weight: 500;
        }

        .breaking-news-item a:hover {
          color: #c9151e;
        }

        .breaking-news-controls {
          height: 32px;
          padding: 0 5px;
          display: flex;
          align-items: center;
          gap: 3px;
          flex-shrink: 0;
          background: #fff;
        }

        .breaking-news-controls button {
          width: 18px;
          height: 24px;
          padding: 0;
          border: 0;
          background: transparent;
          color: #333;
          font-size: 19px;
          cursor: pointer;
        }

        .breaking-news-controls button:hover {
          color: #c9151e;
        }

        @media (max-width: 576px) {
          .breaking-news-label {
            padding: 0 7px;
            font-size: 9px;
          }

          .breaking-news-container {
  width: calc(100% - 16px);
  margin: 6px auto;
  height: 32px;
  min-height: 32px;
}

.breaking-news-item a {
  font-size: 11px;
}

          .breaking-news-headlines {
            padding: 0 5px;
          }

          .breaking-news-item a {
            font-size: 10px;
          }
        }
      `}</style>

      <div className="breaking-news-container">
        <div className="breaking-news-label">
          <span className="breaking-news-dot" />
          BREAKING NEWS
        </div>

        <div className="breaking-news-headlines">
          <Slider
            className="breaking-news-slider"
            slidesPerView={1}
            loop={news.length > 1}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            navigation={{
              nextEl: ".breaking-news-next",
              prevEl: ".breaking-news-prev",
            }}
          >
            {news.map((item) => (
              <div className="breaking-news-item" key={item._id}>
                <Link
                  to={`/${item.categories?.[0]?.slug || "news"}/${item.slug}`}
                >
                  {item.title}
                </Link>
              </div>
            ))}
          </Slider>
        </div>

        <div className="breaking-news-controls">
          <button
            className="breaking-news-prev"
            type="button"
            aria-label="Previous headline"
          >
            ‹
          </button>
          <button
            className="breaking-news-next"
            type="button"
            aria-label="Next headline"
          >
            ›
          </button>
        </div>
      </div>
    </>
  );
};

export default BreakingNews;
