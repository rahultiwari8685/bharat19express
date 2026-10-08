import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const API_URL = "https://api.iotaclasses.in/api/youtube/videos";
// Production:
// const API_URL = "https://your-api-domain.com/api/youtube/videos";

const YouTubeChannelSlider = () => {
  const { i18n, t } = useTranslation();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, [i18n.resolvedLanguage]);

  const fetchVideos = async () => {
    try {
      const language = i18n.resolvedLanguage || "en";

      const response = await fetch(`${API_URL}?lang=${language}`);

      if (!response.ok) {
        throw new Error("Failed to fetch YouTube videos");
      }

      const result = await response.json();

      if (result.success) {
        setChannels(result.data || []);
      }
    } catch (error) {
      console.error("YouTube Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <section className="youtube-section">
          <div className="container">
            <div className="youtube-heading">
              <span>WATCH NOW</span>
              <h2>YouTube Videos</h2>
            </div>

            <div className="youtube-loading">
              {t("loadingVideos", "Loading videos...")}
            </div>
          </div>
        </section>

        <YouTubeStyles />
      </>
    );
  }

  if (!channels.length) {
    return null;
  }

  const maxVideos = Math.max(
    ...channels.map((channel) => channel.videos?.length || 0),
  );

  const videos = [];

  for (let index = 0; index < maxVideos; index++) {
    channels.forEach((channel) => {
      const video = channel.videos?.[index];

      if (video) {
        videos.push(video);
      }
    });
  }

  return (
    <>
      <section className="youtube-section">
        <div className="container">
          <div className="youtube-heading">
            <div>
              {/* <span>WATCH NOW</span> */}
              <h2>{t("videosNews", "Videos News")}</h2>
            </div>
          </div>

          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{
              clickable: true,
            }}
            spaceBetween={20}
            slidesPerView={4}
            slidesPerGroup={4}
            loop={false}
            breakpoints={{
              0: {
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: 15,
              },

              576: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                spaceBetween: 15,
              },

              992: {
                slidesPerView: 3,
                slidesPerGroup: 3,
                spaceBetween: 20,
              },

              1200: {
                slidesPerView: 4,
                slidesPerGroup: 4,
                spaceBetween: 20,
              },
            }}
          >
            {videos.map((video, index) => (
              <SwiperSlide key={`${video.videoId}-${index}`}>
                <div className="youtube-card">
                  {/* CHANNEL NAME - TOP */}

                  <div className="youtube-channel-top">
                    <div className="youtube-channel-icon">▶</div>

                    <div className="youtube-channel-title">
                      {video.channelName}
                    </div>
                  </div>

                  <a
                    href={`https://www.youtube.com/watch?v=${video.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="youtube-thumbnail-link"
                  >
                    <div className="youtube-thumbnail">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        loading="lazy"
                      />

                      <div className="youtube-play">
                        <span>▶</span>
                      </div>
                    </div>
                  </a>

                  <div className="youtube-content">
                    <h3>{video.title}</h3>

                    {video.publishedAt && (
                      <div className="youtube-date">
                        {new Date(video.publishedAt).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <YouTubeStyles />
    </>
  );
};

const YouTubeStyles = () => {
  return (
    <style>
      {`
        .youtube-section {
          width: 100%;
          padding: 40px 0;
          background: #f5f5f5;
        }

        .youtube-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 25px;
        }

        .youtube-heading span {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #e60000;
          letter-spacing: 1px;
          margin-bottom: 5px;
          text-transform: uppercase;
        }

        .youtube-heading h2 {
          margin: 0;
          padding: 0;
          font-size: 28px;
          line-height: 1.2;
          font-weight: 700;
          color: #111;
        }



.youtube-channel-top {
  width: 100%;
  min-height: 48px;

  padding: 10px 12px;

  display: flex;
  align-items: center;
  gap: 10px;

  background: #ffffff;

  border-bottom: 1px solid #eeeeee;
}


.youtube-channel-icon {
  width: 30px;
  height: 30px;

  flex: 0 0 30px;

  border-radius: 50%;

  background: #ff0000;

  color: #ffffff;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 11px;

  padding-left: 2px;
}

/* Channel name */

.youtube-channel-title {
  flex: 1;

  font-size: 14px;
  font-weight: 700;

  color: #111111;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Small red line */

.youtube-channel-top::after {
  content: "";

  width: 4px;
  height: 30px;

  background: #ff0000;

  border-radius: 3px;

  order: -1;
}

        .youtube-card {
          width: 100%;
          height: 100%;
          background: #ffffff;
          border-radius: 6px;
          overflow: hidden;

          box-shadow:
            0 2px 12px
            rgba(0, 0, 0, 0.08);

          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .youtube-card:hover {
          transform: translateY(-4px);

          box-shadow:
            0 8px 25px
            rgba(0, 0, 0, 0.14);
        }


        .youtube-thumbnail-link {
          display: block;
          width: 100%;
          text-decoration: none;
        }

        .youtube-thumbnail {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #111111;
        }

        .youtube-thumbnail img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;

          transition:
            transform 0.4s ease;
        }

        .youtube-card:hover
        .youtube-thumbnail img {
          transform: scale(1.05);
        }



        .youtube-play {
          position: absolute;

          top: 50%;
          left: 50%;

          width: 54px;
          height: 54px;

          transform:
            translate(-50%, -50%);

          background: #ff0000;

          border-radius: 50%;

          display: flex;
          align-items: center;
          justify-content: center;

          color: #ffffff;

          box-shadow:
            0 4px 15px
            rgba(0, 0, 0, 0.3);

          transition:
            transform 0.3s ease;
        }

        .youtube-card:hover
        .youtube-play {
          transform:
            translate(-50%, -50%)
            scale(1.1);
        }

        .youtube-play span {
          font-size: 19px;
          line-height: 1;
          margin-left: 3px;
        }


        .youtube-content {
          padding: 15px;
        }



        .youtube-channel-name {
          color: #e60000;

          font-size: 13px;
          font-weight: 700;

          margin-bottom: 7px;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }


        .youtube-content h3 {
          margin: 0;
          padding: 0;

          font-size: 16px;
          line-height: 1.45;
          font-weight: 600;

          color: #111111;

          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;

          overflow: hidden;
        }


        .youtube-date {
          margin-top: 10px;

          font-size: 12px;
          line-height: 1.2;

          color: #888888;
        }


        .youtube-section
        .swiper-button-prev,
        .youtube-section
        .swiper-button-next {
          width: 40px;
          height: 40px;

          border-radius: 50%;

          background: #ffffff;

          box-shadow:
            0 3px 12px
            rgba(0, 0, 0, 0.15);
        }

        .youtube-section
        .swiper-button-prev::after,
        .youtube-section
        .swiper-button-next::after {
          font-size: 15px;
          font-weight: 700;
          color: #222222;
        }


        .youtube-section
        .swiper-pagination {
          position: relative;

          margin-top: 20px;

          bottom: auto;
        }

        .youtube-section
        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          opacity: 0.5;
        }

        .youtube-section
        .swiper-pagination-bullet-active {
          opacity: 1;
        }



        .youtube-loading {
          width: 100%;

          padding: 40px;

          background: #ffffff;

          border-radius: 6px;

          text-align: center;

          color: #777777;
        }



        @media (max-width: 991px) {

          .youtube-section {
            padding: 30px 0;
          }

          .youtube-heading h2 {
            font-size: 24px;
          }

        }



        @media (max-width: 767px) {

          .youtube-section {
            padding: 25px 0;
          }

          .youtube-heading {
            margin-bottom: 20px;
          }

          .youtube-heading h2 {
            font-size: 22px;
          }

          .youtube-content {
            padding: 13px;
          }

          .youtube-content h3 {
            font-size: 15px;
          }

        }


        @media (max-width: 575px) {

          .youtube-section {
            padding: 25px 0;
          }

          .youtube-heading h2 {
            font-size: 21px;
          }

          .youtube-play {
            width: 48px;
            height: 48px;
          }

          .youtube-content h3 {
            font-size: 15px;
          }

        }

      `}
    </style>
  );
};

export default YouTubeChannelSlider;
