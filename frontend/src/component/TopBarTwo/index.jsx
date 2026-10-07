import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import FontAwesome from "../uiStyle/FontAwesome";
import Slider from "../Slider";

const TopBarTwo = () => {
  const API = "https://api.iotaclasses.in";

  const { t, i18n } = useTranslation();

  const [trendingNews, setTrendingNews] = useState([]);
  const [showYoutubeMenu, setShowYoutubeMenu] = useState(false);

  useEffect(() => {
    getTrendingNews();
  }, [i18n.resolvedLanguage]);

  const getTrendingNews = async () => {
    try {
      const language = i18n.resolvedLanguage || "en";

      const res = await fetch(
        `${API}/api/news/trending?limit=10&lang=${language}`,
      );

      const data = await res.json();

      if (data.status) {
        setTrendingNews(data.data || []);
      }
    } catch (error) {
      console.error("Trending News Error:", error);
    }
  };

  const changeLanguage = (language) => {
    setTrendingNews([]);
    i18n.changeLanguage(language);
  };

  return (
    // <div className="topbar white_bg" id="top">
    <div
      className="topbar"
      id="top"
      style={{
        background: "#b40000",
        color: "#fff",
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-8 align-self-center">
            <div className="trancarousel_area" style={{ display: "flex" }}>
              <p
                className="trand"
                style={{
                  color: "#fff",
                  background: "transparent",
                  fontWeight: "600",
                }}
              >
                {t("trending")}
              </p>

              <div className="trancarousel nav_style1" style={{ width: "80%" }}>
                <Slider
                  navigation={{
                    nextEl: ".swiper-button-next15",
                    prevEl: ".swiper-button-prev15",
                  }}
                  className="trancarousel"
                  slidesPerView={1}
                  loop={trendingNews.length > 1}
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                >
                  {trendingNews.map((news) => (
                    <div className="trancarousel_item" key={news._id}>
                      <p>
                        <Link
                          to={`/news/${news.slug}`}
                          style={{
                            color: "#fff",
                            textDecoration: "none",
                            fontWeight: "500",
                          }}
                        >
                          {news.title}
                        </Link>
                      </p>
                    </div>
                  ))}
                </Slider>

                <div className="navBtns">
                  <button className="navBtn prevBtn swiper-button-prev15">
                    <FontAwesome name="angle-left" />
                  </button>

                  <button className="navBtn nextBtn swiper-button-next15">
                    <FontAwesome name="angle-right" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4 align-self-center">
            <div className="top_date_social text-right">
              {/* SOCIAL */}
              <div
                className="social1"
                style={{
                  color: "#fff",
                }}
              >
                <ul className="inline">
                  <li>
                    <a
                      href="https://twitter.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#fff",
                      }}
                    >
                      <FontAwesome name="twitter" />
                    </a>
                  </li>

                  <li>
                    <a
                      href="https://facebook.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#fff",
                      }}
                    >
                      <FontAwesome name="facebook-f" />
                    </a>
                  </li>

                  <li
                    style={{
                      position: "relative",
                    }}
                    onMouseEnter={() => setShowYoutubeMenu(true)}
                    onMouseLeave={() => setShowYoutubeMenu(false)}
                  >
                    <a
                      href="#!"
                      onClick={(e) => e.preventDefault()}
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      <FontAwesome name="youtube-play" />
                    </a>

                    {showYoutubeMenu && (
                      <div
                        style={{
                          position: "absolute",
                          top: "32px",
                          right: "-10px",
                          width: "230px",
                          background: "#fff",
                          borderRadius: "6px",
                          boxShadow: "0 5px 20px rgba(0,0,0,0.25)",
                          padding: "8px 0",
                          zIndex: 9999,
                          textAlign: "left",
                        }}
                      >
                        <div
                          style={{
                            padding: "8px 14px",
                            fontSize: "13px",
                            fontWeight: "700",
                            color: "#b40000",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          Our YouTube Channels
                        </div>

                        <a
                          href="https://youtube.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "block",
                            padding: "10px 14px",
                            color: "#333",
                            textDecoration: "none",
                            fontSize: "13px",
                          }}
                        >
                          Bharat TV Media
                        </a>

                        <a
                          href="https://youtube.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "block",
                            padding: "10px 14px",
                            color: "#333",
                            textDecoration: "none",
                            fontSize: "13px",
                          }}
                        >
                          Bharat TV Hindi
                        </a>

                        <a
                          href="https://youtube.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "block",
                            padding: "10px 14px",
                            color: "#333",
                            textDecoration: "none",
                            fontSize: "13px",
                          }}
                        >
                          Bharat TV News
                        </a>

                        <a
                          href="https://youtube.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "block",
                            padding: "10px 14px",
                            color: "#333",
                            textDecoration: "none",
                            fontSize: "13px",
                          }}
                        >
                          Bharat TV Live
                        </a>
                      </div>
                    )}
                  </li>

                  <li>
                    <a
                      href="https://instagram.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesome name="instagram" />
                    </a>
                  </li>
                </ul>
              </div>

              <div
                className="user3"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  marginLeft: "12px",
                }}
              >
                <Link
                  to="/login"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    height: "34px",
                    padding: "0 13px",
                    borderRadius: "5px",
                    background: "transparent",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "700",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  <FontAwesome name="user-circle" />
                  <span>Login</span>
                </Link>
              </div>

              <div className="lang-3">
                <select
                  value={i18n.resolvedLanguage || "en"}
                  onChange={(e) => changeLanguage(e.target.value)}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#fff",
                    cursor: "pointer",
                    outline: "none",
                    fontSize: "14px",
                  }}
                >
                  <option value="en">English</option>

                  <option value="hi">हिन्दी</option>

                  <option value="bn">বাংলা</option>

                  <option value="mr">मराठी</option>

                  <option value="ta">தமிழ்</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBarTwo;
