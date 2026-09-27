// import React, { useState } from "react";
// import FontAwesome from "../uiStyle/FontAwesome";
// import { Link } from "react-router-dom";
// import ModalVideo from "react-modal-video";

// // images
// import video21 from "../../assets/img/video-play-thumb.jpg";
// import video22 from "../../assets/img/video-items/1.png";
// import video23 from "../../assets/img/video-items/2.png";
// import video24 from "../../assets/img/video-items/3.png";
// import video25 from "../../assets/img/video-items/4.png";
// import video26 from "../../assets/img/video-items/5.png";
// import video27 from "../../assets/img/video-items/6.png";

// const posts = [
//   {
//     photo: video22,
//     category: "TECHNOLOGY",
//     date: "March 26, 2020",
//     title: "The property complete with a 30 seat screen room.",
//   },
//   {
//     photo: video23,
//     category: "TECHNOLOGY",
//     date: "March 26, 2020",
//     title: "The property complete with a 30 seat screen room.",
//   },
//   {
//     photo: video24,
//     category: "TECHNOLOGY",
//     date: "March 26, 2020",
//     title: "The property complete with a 30 seat screen room.",
//   },
//   {
//     photo: video25,
//     category: "TECHNOLOGY",
//     date: "March 26, 2020",
//     title: "The property complete with a 30 seat screen room.",
//   },
//   {
//     photo: video26,
//     category: "TECHNOLOGY",
//     date: "March 26, 2020",
//     title: "The property complete with a 30 seat screen room.",
//   },
//   {
//     photo: video27,
//     category: "TECHNOLOGY",
//     date: "March 26, 2020",
//     title: "The property complete with a 30 seat screen room.",
//   },
// ];

// const VideoNews = () => {
//   const [vModal, setvModal] = useState(false);
//   return (
//     <>
//       <div className="mb30">
//         <div className="container">
//           <div className="video_posts padding20 white_bg border-radious5">
//             <div className="row">
//               <div className="col-12">
//                 <div className="heading">
//                   <h2 className="widget-title">Video News</h2>
//                 </div>
//               </div>
//             </div>
//             <div className="row">
//               <div className="col-lg-8">
//                 <div className="single_post post_type3 post_type11 post_type21 xs-mb30">
//                   <div className="post_img border-radious7">
//                     <div className="img_wrap">
//                       <Link to="/" className="play_btn">
//                         <img src={video21} alt="video21" />
//                       </Link>
//                     </div>
//                     <p
//                       onClick={() => setvModal(true)}
//                       className="youtube_middle"
//                     >
//                       <FontAwesome name="youtube-play" />
//                     </p>
//                     <div className="sport_meta_ab inline">
//                       <ul>
//                         <li>SPORTS</li>
//                         <li>April 26, 2020</li>
//                         <li>8:36mm</li>
//                       </ul>
//                     </div>
//                     <div className="social_share">
//                       <ul className="meta_share inline">
//                         <li>
//                           <Link to="/">
//                             <FontAwesome name="bookmark" />
//                           </Link>
//                         </li>
//                         <li>
//                           <Link to="/">
//                             <FontAwesome name="share" />
//                           </Link>
//                         </li>
//                       </ul>
//                     </div>
//                   </div>
//                   <div className="single_post_text">
//                     <h4>
//                       <Link to="/post1">
//                         ICC Men’s Cricket World Cup digital content delivers
//                         record-breaking numbers
//                       </Link>
//                     </h4>
//                     <div className="space-10" />
//                     <ul className=" like_cm">
//                       <li>
//                         <Link to="/">
//                           <FontAwesome name="eye" />
//                           6745
//                         </Link>
//                       </li>
//                       <li>
//                         <Link to="/">
//                           <FontAwesome name="heart" />
//                           6745
//                         </Link>
//                       </li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//               <div className="col-lg-4">
//                 {posts.map((item, i) => (
//                   <div
//                     key={i}
//                     className="single_post type14 type22 widgets_small sm-mt30"
//                   >
//                     <div className="post_img">
//                       <div className="img_wrap">
//                         <div className="img_wrap">
//                           <Link to="/" className="play_btn">
//                             <img src={item.photo} alt="thumb" />
//                           </Link>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="single_post_text">
//                       <h4>
//                         <Link to="/post1">{item.title}</Link>
//                       </h4>
//                       <div className="meta2">
//                         <Link to="/">{item.category}</Link>
//                         <Link to="/">{item.date}</Link>
//                       </div>
//                       {i + 1 < posts.length ? (
//                         <>
//                           <div className="space-5" />
//                           <div className="border_black" />
//                           <div className="space-15" />
//                         </>
//                       ) : null}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <ModalVideo
//         channel="youtube"
//         isOpen={vModal}
//         videoId="Fkd9TWUtFm0"
//         onClose={() => setvModal(false)}
//       />
//     </>
//   );
// };

// export default VideoNews;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FontAwesome from "../uiStyle/FontAwesome";
import ModalVideo from "react-modal-video";

const API = "https://api.iotaclasses.in";

const VideoNews = () => {
  const [vModal, setVModal] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [videoNews, setVideoNews] = useState(null);
  const [sideNews, setSideNews] = useState([]);

  useEffect(() => {
    getVideoNews();
  }, []);

  // =========================
  // YOUTUBE ID
  // =========================
  const getYoutubeId = (url) => {
    if (!url) return "";

    try {
      const urlObj = new URL(url);

      // youtube.com/watch?v=xxxx
      if (urlObj.hostname.includes("youtube.com")) {
        if (urlObj.pathname === "/watch") {
          return urlObj.searchParams.get("v") || "";
        }

        // youtube.com/shorts/xxxx
        if (urlObj.pathname.startsWith("/shorts/")) {
          return urlObj.pathname.split("/shorts/")[1];
        }

        // youtube.com/embed/xxxx
        if (urlObj.pathname.startsWith("/embed/")) {
          return urlObj.pathname.split("/embed/")[1];
        }
      }

      // youtu.be/xxxx
      if (urlObj.hostname === "youtu.be") {
        return urlObj.pathname.substring(1);
      }
    } catch (error) {
      console.log("Invalid YouTube URL:", url);
    }

    return "";
  };

  // =========================
  // THUMBNAIL
  // =========================
  const getThumbnail = (news) => {
    if (news?.thumbnail) {
      return `${API}/uploads/images/${news.thumbnail}`;
    }

    const id = getYoutubeId(news?.youtubeUrl);

    if (id) {
      return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    }

    return "/images/no-image.jpg";
  };

  // =========================
  // FETCH VIDEOS
  // =========================
  const getVideoNews = async () => {
    try {
      const res = await fetch(`${API}/api/news/videos?limit=10`);

      const data = await res.json();

      console.log("VIDEO API RESPONSE:", data);

      if (data.status && Array.isArray(data.data)) {
        const videos = data.data
          .filter((item) => Number(item.type) === 1)
          .filter((item) => Number(item.videoType) === 2)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );

        console.log("FILTERED VIDEOS:", videos);

        if (videos.length > 0) {
          const featured = videos[0];

          console.log("FEATURED VIDEO:", featured);
          console.log("YOUTUBE URL:", featured.youtubeUrl);
          console.log("YOUTUBE ID:", getYoutubeId(featured.youtubeUrl));

          setVideoNews(featured);
          setVideoId(getYoutubeId(featured.youtubeUrl));

          setSideNews(videos.slice(1, 7));
        }
      }
    } catch (error) {
      console.error("Video News API Error:", error);
    }
  };

  // =========================
  // DATE
  // =========================
  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (!videoNews) {
    return null;
  }

  const featuredUrl = `/news/${videoNews.slug}`;

  return (
    <>
      <div className="mb30">
        <div className="container">
          <div className="video_posts padding20 white_bg border-radious5">
            {/* HEADING */}
            <div className="row">
              <div className="col-12">
                <div className="heading">
                  <h2 className="widget-title">Video News</h2>
                </div>
              </div>
            </div>

            <div className="row">
              {/* ================= FEATURED ================= */}
              <div className="col-lg-8">
                <div className="single_post post_type3 post_type11 post_type21 xs-mb30">
                  <div className="post_img border-radious7">
                    <div
                      className="img_wrap"
                      style={{
                        position: "relative",
                        cursor: videoId ? "pointer" : "default",
                      }}
                      onClick={() => {
                        if (videoId) {
                          setVModal(true);
                        }
                      }}
                    >
                      <img
                        src={getThumbnail(videoNews)}
                        alt={videoNews.title || "Video News"}
                        style={{
                          width: "100%",
                          height: "420px",
                          objectFit: "cover",
                        }}
                      />

                      {/* PLAY BUTTON */}
                      {videoId && (
                        <div
                          className="youtube_middle"
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          <FontAwesome name="youtube-play" />
                        </div>
                      )}
                    </div>

                    {/* META */}
                    <div className="sport_meta_ab inline">
                      <ul>
                        <li>{videoNews.categories?.[0]?.name || "VIDEO"}</li>

                        <li>{formatDate(videoNews.createdAt)}</li>
                      </ul>
                    </div>

                    {/* SOCIAL */}
                    <div className="social_share">
                      <ul className="meta_share inline">
                        <li>
                          <Link to={featuredUrl}>
                            <FontAwesome name="bookmark" />
                          </Link>
                        </li>

                        <li>
                          <Link to={featuredUrl}>
                            <FontAwesome name="share" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* TITLE */}
                  <div className="single_post_text">
                    <h4>
                      <Link to={featuredUrl}>{videoNews.title}</Link>
                    </h4>

                    <div className="space-10" />

                    <ul className="like_cm">
                      <li>
                        <Link to={featuredUrl}>
                          <FontAwesome name="eye" /> {videoNews.views || 0}
                        </Link>
                      </li>

                      <li>
                        <Link to={featuredUrl}>
                          <FontAwesome name="heart" /> {videoNews.likes || 0}
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* ================= RIGHT VIDEOS ================= */}
              <div className="col-lg-4">
                {sideNews.map((item, i) => {
                  const newsUrl = `/news/${item.slug}`;

                  const category = item.categories?.[0];

                  const itemVideoId = getYoutubeId(item.youtubeUrl);

                  return (
                    <div
                      key={item._id || i}
                      className="single_post type14 type22 widgets_small sm-mt30"
                    >
                      <div className="post_img">
                        <div
                          className="img_wrap"
                          style={{
                            position: "relative",
                            cursor: itemVideoId ? "pointer" : "default",
                          }}
                          onClick={() => {
                            if (itemVideoId) {
                              setVideoId(itemVideoId);
                              setVModal(true);
                            }
                          }}
                        >
                          <img
                            src={getThumbnail(item)}
                            alt={item.title || "Video News"}
                            style={{
                              width: "100%",
                              height: "80px",
                              objectFit: "cover",
                            }}
                          />

                          {itemVideoId && (
                            <span
                              className="youtube_small"
                              style={{
                                cursor: "pointer",
                              }}
                            >
                              <FontAwesome name="youtube-play" />
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="single_post_text">
                        <h4>
                          <Link to={newsUrl}>
                            {item.title?.length > 65
                              ? `${item.title.substring(0, 65)}...`
                              : item.title}
                          </Link>
                        </h4>

                        <div className="meta2">
                          <Link
                            to={
                              category?.slug
                                ? `/category/${category.slug}`
                                : "#"
                            }
                          >
                            {category?.name || "Video"}
                          </Link>

                          <Link to={newsUrl}>{formatDate(item.createdAt)}</Link>
                        </div>

                        {i + 1 < sideNews.length && (
                          <>
                            <div className="space-5" />
                            <div className="border_black" />
                            <div className="space-15" />
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {videoId && (
        <ModalVideo
          channel="youtube"
          isOpen={vModal}
          videoId={videoId}
          onClose={() => {
            setVModal(false);
          }}
        />
      )}
    </>
  );
};

export default VideoNews;
