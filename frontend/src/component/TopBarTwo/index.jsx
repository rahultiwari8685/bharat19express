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
    // <div className="topbar white_bg" id="top">
    //   <div className="container">
    //     <div className="row">
    //       {/* <div className="col-md-8 align-self-center">
    //         <div className="trancarousel_area" style={{ display: "flex" }}>
    //           <p className="trand">{t("trending")}</p>

    //           <div className="trancarousel nav_style1" style={{ width: "80%" }}>
    //             <Slider
    //               navigation={{
    //                 nextEl: ".swiper-button-next15",
    //                 prevEl: ".swiper-button-prev15",
    //               }}
    //               className="trancarousel"
    //               slidesPerView={1}
    //               loop={trendingNews.length > 1}
    //               autoplay={{
    //                 delay: 2500,
    //                 disableOnInteraction: false,
    //               }}
    //             >
    //               {trendingNews.map((news) => (
    //                 <div className="trancarousel_item" key={news._id}>
    //                   <p>
    //                     <Link to={`/news/${news.slug}`}>{news.title}</Link>
    //                   </p>
    //                 </div>
    //               ))}
    //             </Slider>

    //             <div className="navBtns">
    //               <button className="navBtn prevBtn swiper-button-prev15">
    //                 <FontAwesome name="angle-left" />
    //               </button>

    //               <button className="navBtn nextBtn swiper-button-next15">
    //                 <FontAwesome name="angle-right" />
    //               </button>
    //             </div>
    //           </div>
    //         </div>
    //       </div> */}

    //        <div className="col-md-4 align-self-center">
    //                   <div className="top_date_social text-right">
    //                     <div className={`paper_date ${dark ? "white" : ""}`}>
    //                       <p>
    //                         {new Date().toLocaleDateString("en-US", {
    //                           weekday: "long",
    //                           month: "long",
    //                           day: "numeric",
    //                           year: "numeric",
    //                         })}
    //                       </p>
    //                     </div>

    //                     <div className={`social1 ${dark ? "white" : ""}`}>
    //                       <ul className="inline">
    //                         <li>
    //                           <Link to="#">
    //                             <FontAwesome name="twitter" />
    //                           </Link>
    //                         </li>

    //                         <li>
    //                           <Link to="#">
    //                             <FontAwesome name="facebook-f" />
    //                           </Link>
    //                         </li>

    //                         <li>
    //                           <Link to="#">
    //                             <FontAwesome name="youtube-play" />
    //                           </Link>
    //                         </li>

    //                         <li>
    //                           <Link to="#">
    //                             <FontAwesome name="instagram" />
    //                           </Link>
    //                         </li>
    //                       </ul>
    //                     </div>
    //                   </div>
    //                 </div>

    //       <div className="col-md-4 align-self-center">
    //         <div className="top_date_social text-right">
    //           <div
    //             style={{
    //               display: "inline-flex",
    //               alignItems: "center",
    //               marginRight: "10px",
    //             }}
    //           >
    //             <div
    //               style={{
    //                 position: "relative",
    //               }}
    //               onMouseEnter={() => setShowYoutubeMenu(true)}
    //               onMouseLeave={() => setShowYoutubeMenu(false)}
    //             >
    //               {/* YOUTUBE BUTTON */}
    //               <button
    //                 type="button"
    //                 style={{
    //                   display: "inline-flex",
    //                   alignItems: "center",
    //                   justifyContent: "center",
    //                   gap: "6px",
    //                   height: "34px",
    //                   padding: "0 13px",
    //                   border: "none",
    //                   borderRadius: "5px",
    //                   background: "#e31e24",
    //                   color: "#fff",
    //                   fontSize: "12px",
    //                   fontWeight: "700",
    //                   cursor: "pointer",
    //                   whiteSpace: "nowrap",
    //                 }}
    //               >
    //                 <FontAwesome name="youtube-play" />
    //                 <span>{t("youtubeButton", "YouTube")}</span>
    //               </button>

    //               {/* DROPDOWN */}
    //               {showYoutubeMenu && (
    //                 <div
    //                   style={{
    //                     position: "absolute",
    //                     top: "38px",
    //                     right: "0",
    //                     width: "220px",
    //                     background: "#fff",
    //                     borderRadius: "5px",
    //                     boxShadow: "0 5px 20px rgba(0,0,0,0.25)",
    //                     zIndex: 99999,
    //                     overflow: "hidden",
    //                     textAlign: "left",
    //                   }}
    //                 >
    //                   <div
    //                     style={{
    //                       background: "#b40000",
    //                       color: "#fff",
    //                       padding: "10px 14px",
    //                       fontSize: "13px",
    //                       fontWeight: "700",
    //                     }}
    //                   >
    //                     {t("youtubeChannels", "Our YouTube Channels")}
    //                   </div>

    //                   <a
    //                     href="https://www.youtube.com/channel/UC0lg7tqrUdlky_u1Wug7uEw"
    //                     target="_blank"
    //                     rel="noopener noreferrer"
    //                     style={{
    //                       display: "block",
    //                       padding: "10px 14px",
    //                       color: "#333",
    //                       background: "#fff",
    //                       textDecoration: "none",
    //                       fontSize: "13px",
    //                       borderBottom: "1px solid #eee",
    //                     }}
    //                   >
    //                     {t("channelNation", "Bharat 19 Express Nation")}
    //                   </a>

    //                   <a
    //                     href="https://www.youtube.com/channel/UC7_OlirbGWvmG0-0Nc3WedA"
    //                     target="_blank"
    //                     rel="noopener noreferrer"
    //                     style={{
    //                       display: "block",
    //                       padding: "10px 14px",
    //                       color: "#333",
    //                       background: "#fff",
    //                       textDecoration: "none",
    //                       fontSize: "13px",
    //                       borderBottom: "1px solid #eee",
    //                     }}
    //                   >
    //                     {t("channelRegional", "Bharat 19 Express Regional")}
    //                   </a>

    //                   <a
    //                     href="https://www.youtube.com/channel/UCkJQAejO5Zx1TaQzzA_3Hvg"
    //                     target="_blank"
    //                     rel="noopener noreferrer"
    //                     style={{
    //                       display: "block",
    //                       padding: "10px 14px",
    //                       color: "#333",
    //                       background: "#fff",
    //                       textDecoration: "none",
    //                       fontSize: "13px",
    //                       borderBottom: "1px solid #eee",
    //                     }}
    //                   >
    //                     {t("channelEntertainment", "Bharat 19 Entertainment")}
    //                   </a>

    //                   <a
    //                     href="https://www.youtube.com/channel/UCygk_AnahPPNje9H3NLK1tA"
    //                     target="_blank"
    //                     rel="noopener noreferrer"
    //                     style={{
    //                       display: "block",
    //                       padding: "10px 14px",
    //                       color: "#333",
    //                       background: "#fff",
    //                       textDecoration: "none",
    //                       fontSize: "13px",
    //                     }}
    //                   >
    //                     {t("channelMain", "Bharat 19 Express")}
    //                   </a>
    //                 </div>
    //               )}
    //             </div>
    //           </div>
    //           <div
    //             className="user3"
    //             style={{
    //               display: "inline-flex",
    //               alignItems: "center",
    //               marginLeft: "12px",
    //             }}
    //           >
    //             <Link
    //               to="/login"
    //               style={{
    //                 display: "inline-flex",
    //                 alignItems: "center",
    //                 justifyContent: "center",
    //                 gap: "6px",
    //                 height: "34px",
    //                 padding: "0 13px",
    //                 borderRadius: "5px",
    //                 background: "#e31e24",
    //                 color: "#fff",
    //                 fontSize: "12px",
    //                 fontWeight: "700",
    //                 textDecoration: "none",
    //                 whiteSpace: "nowrap",
    //               }}
    //             >
    //               <FontAwesome name="user-circle" />
    //               <span>{t("login", "Login")}</span>
    //             </Link>
    //           </div>

    //           <div className="lang-3">
    //             <select
    //               value={i18n.resolvedLanguage || "en"}
    //               onChange={(e) => changeLanguage(e.target.value)}
    //               style={{
    //                 border: "none",
    //                 background: "transparent",
    //                 cursor: "pointer",
    //                 outline: "none",
    //                 fontSize: "14px",
    //               }}
    //             >
    //               <option value="en">English</option>

    //               <option value="hi">हिन्दी</option>

    //               {/* <option value="ur">اردو</option> */}

    //               <option value="bn">বাংলা</option>

    //               <option value="mr">मराठी</option>
    //             </select>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>

    <div
      className="topbar"
      id="top"
      style={{
        background: "#f1f1f1",
        color: "#fff",
        minHeight: "45px",
        fontSize: "12px",
        padding: 0,
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
          padding: "0 15px",
          background: "#a90000",
          borderBottom: "3px solid #e4b8b8",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            minHeight: "42px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
            flexWrap: "nowrap",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* LEFT: Date, weather and AQI */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
              <FontAwesome name="calendar" />{" "}
              {new Date().toLocaleDateString("hi-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                weekday: "long",
              })}
            </span>

            <span style={{ opacity: 0.8 }}>|</span>

            <span style={{ whiteSpace: "nowrap" }}>
              <FontAwesome name="map-marker" /> लखनऊ 24°C
            </span>

            <span style={{ whiteSpace: "nowrap" }}>
              <FontAwesome name="cloud" /> AQI 78 (अच्छा)
            </span>
          </div>

          {/* RIGHT: Quick links and social icons */}

          {/* RIGHT: Preserve previous header actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "12px",
              flexWrap: "nowrap",
              marginLeft: "auto",
            }}
          >
            {/* YouTube dropdown */}
            <div
              style={{ position: "relative", flexShrink: 0 }}
              onMouseEnter={() => setShowYoutubeMenu(true)}
              onMouseLeave={() => setShowYoutubeMenu(false)}
            >
              <button
                type="button"
                onClick={() => setShowYoutubeMenu((prev) => !prev)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#fff",
                  padding: 0,
                  fontSize: "12px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                <FontAwesome name="youtube-play" /> YouTube
              </button>

              {showYoutubeMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "25px",
                    right: 0,
                    width: "230px",
                    background: "#fff",
                    borderRadius: "5px",
                    boxShadow: "0 5px 20px rgba(0,0,0,0.25)",
                    zIndex: 99999,
                    overflow: "hidden",
                    textAlign: "left",
                  }}
                >
                  {[
                    {
                      label: t("channelNation", "Bharat 19 Express Nation"),
                      url: "https://www.youtube.com/channel/UC0lg7tqrUdlky_u1Wug7uEw",
                    },
                    {
                      label: t("channelRegional", "Bharat 19 Express Regional"),
                      url: "https://www.youtube.com/channel/UC7_OlirbGWvmG0-0Nc3WedA",
                    },
                    {
                      label: t(
                        "channelEntertainment",
                        "Bharat 19 Entertainment",
                      ),
                      url: "https://www.youtube.com/channel/UCkJQAejO5Zx1TaQzzA_3Hvg",
                    },
                    {
                      label: t("channelMain", "Bharat 19 Express"),
                      url: "https://www.youtube.com/channel/UCygk_AnahPPNje9H3NLK1tA",
                    },
                  ].map((channel) => (
                    <a
                      key={channel.url}
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "block",
                        padding: "10px 14px",
                        color: "#333",
                        textDecoration: "none",
                        fontSize: "13px",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      {channel.label}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/login"
              style={{
                color: "#fff",
                textDecoration: "none",
                fontSize: "12px",
                whiteSpace: "nowrap",
              }}
            >
              <FontAwesome name="user-circle" /> {t("login", "Login")}
            </Link>

            {[
              { icon: "youtube-play", url: "https://www.youtube.com/" },
              { icon: "facebook-f", url: "https://www.facebook.com/" },
              { icon: "instagram", url: "https://www.instagram.com/" },
              { icon: "twitter", url: "https://x.com/" },
            ].map((item) => (
              <a
                key={item.icon}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.icon}
                style={{
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: "14px",
                  flexShrink: 0,
                }}
              >
                <FontAwesome name={item.icon} />
              </a>
            ))}

            {/* Language selector */}
            <select
              value={i18n.resolvedLanguage || "en"}
              onChange={(e) => changeLanguage(e.target.value)}
              aria-label="Select language"
              style={{
                border: "none",
                background: "transparent",
                color: "#fff",
                cursor: "pointer",
                outline: "none",
                fontSize: "12px",
                maxWidth: "85px",
              }}
            >
              <option value="en" style={{ color: "#222" }}>
                English
              </option>
              <option value="hi" style={{ color: "#222" }}>
                हिन्दी
              </option>
              <option value="bn" style={{ color: "#222" }}>
                বাংলা
              </option>
              <option value="mr" style={{ color: "#222" }}>
                मराठी
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBarTwo;
