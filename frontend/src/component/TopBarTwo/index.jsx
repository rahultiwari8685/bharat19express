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

  const changeLanguage = async (language) => {
    try {
      setTrendingNews([]);

      localStorage.setItem("i18nextLng", language);

      await i18n.changeLanguage(language);

      document.documentElement.lang = language;

      if (language === "ur") {
        document.documentElement.dir = "rtl";
      } else {
        document.documentElement.dir = "ltr";
      }

      console.log("Selected Language:", language);
      console.log("i18n Language:", i18n.language);
      console.log("Resolved Language:", i18n.resolvedLanguage);
    } catch (error) {
      console.error("Language change error:", error);
    }
  };

  return (
    <div className="topbar white_bg" id="top">
      <div className="container">
        <div className="row">
          <div className="col-md-8 align-self-center">
            <div className="trancarousel_area" style={{ display: "flex" }}>
              <p className="trand">{t("trending")}</p>

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
                        <Link to={`/news/${news.slug}`}>{news.title}</Link>
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
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  marginRight: "10px",
                }}
              >
                <div
                  style={{
                    position: "relative",
                  }}
                  onMouseEnter={() => setShowYoutubeMenu(true)}
                  onMouseLeave={() => setShowYoutubeMenu(false)}
                >
                  {/* YOUTUBE BUTTON */}
                  <button
                    type="button"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      height: "34px",
                      padding: "0 13px",
                      border: "none",
                      borderRadius: "5px",
                      background: "#e31e24",
                      color: "#fff",
                      fontSize: "12px",
                      fontWeight: "700",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <FontAwesome name="youtube-play" />
                    <span>{t("youtubeButton", "YouTube")}</span>
                  </button>

                  {/* DROPDOWN */}
                  {showYoutubeMenu && (
                    <div
                      style={{
                        position: "absolute",
                        top: "38px",
                        right: "0",
                        width: "220px",
                        background: "#fff",
                        borderRadius: "5px",
                        boxShadow: "0 5px 20px rgba(0,0,0,0.25)",
                        zIndex: 99999,
                        overflow: "hidden",
                        textAlign: "left",
                      }}
                    >
                      <div
                        style={{
                          background: "#b40000",
                          color: "#fff",
                          padding: "10px 14px",
                          fontSize: "13px",
                          fontWeight: "700",
                        }}
                      >
                        {t("youtubeChannels", "Our YouTube Channels")}
                      </div>

                      <a
                        href="https://www.youtube.com/channel/UC0lg7tqrUdlky_u1Wug7uEw"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "block",
                          padding: "10px 14px",
                          color: "#333",
                          background: "#fff",
                          textDecoration: "none",
                          fontSize: "13px",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {t("channelNation", "Bharat 19 Express Nation")}
                      </a>

                      <a
                        href="https://www.youtube.com/channel/UC7_OlirbGWvmG0-0Nc3WedA"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "block",
                          padding: "10px 14px",
                          color: "#333",
                          background: "#fff",
                          textDecoration: "none",
                          fontSize: "13px",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {t("channelRegional", "Bharat 19 Express Regional")}
                      </a>

                      <a
                        href="https://www.youtube.com/channel/UCkJQAejO5Zx1TaQzzA_3Hvg"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "block",
                          padding: "10px 14px",
                          color: "#333",
                          background: "#fff",
                          textDecoration: "none",
                          fontSize: "13px",
                          borderBottom: "1px solid #eee",
                        }}
                      >
                        {t("channelEntertainment", "Bharat 19 Entertainment")}
                      </a>

                      <a
                        href="https://www.youtube.com/channel/UCygk_AnahPPNje9H3NLK1tA"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "block",
                          padding: "10px 14px",
                          color: "#333",
                          background: "#fff",
                          textDecoration: "none",
                          fontSize: "13px",
                        }}
                      >
                        {t("channelMain", "Bharat 19 Express")}
                      </a>
                    </div>
                  )}
                </div>
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
                    background: "#e31e24",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "700",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  <FontAwesome name="user-circle" />
                  <span>{t("login", "Login")}</span>
                </Link>
              </div>

              <div className="lang-3">
                <select
                  value={i18n.resolvedLanguage || "en"}
                  onChange={(e) => changeLanguage(e.target.value)}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    outline: "none",
                    fontSize: "14px",
                  }}
                >
                  <option value="en">English</option>

                  <option value="hi">हिन्दी</option>

                  {/* <option value="ur">اردو</option> */}

                  <option value="bn">বাংলা</option>

                  <option value="mr">मराठी</option>
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
