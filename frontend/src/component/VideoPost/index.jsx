// import React, { useEffect, useState } from "react";
// import ProtoTypes from "prop-types";
// import { Link } from "react-router-dom";
// import FontAwesome from "../uiStyle/FontAwesome";
// import ModalVideo from "react-modal-video";
// import PopularPosts from "../PopularPosts";

// const API = "https://api.iotaclasses.in";

// const VideoPost = ({ className, dark }) => {
//   const [vModal, setvModal] = useState(false);
//   const [videoId, setVideoId] = useState("");
//   const [videoNews, setVideoNews] = useState(null);

//   useEffect(() => {
//     getVideoNews();
//   }, []);

//   const getVideoNews = async () => {
//     try {
//       const res = await fetch(`${API}/api/news/videos?limit=1`);
//       const data = await res.json();

//       if (data.status && data.data.length > 0) {
//         setVideoNews(data.data[0]);

//         setVideoId(getYoutubeId(data.data[0].youtubeUrl));
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const getThumbnail = (news) => {
//     // Uploaded thumbnail exists
//     if (news.thumbnail && news.thumbnail.trim() !== "") {
//       return `${API}/uploads/images/${news.thumbnail}`;
//     }

//     // Otherwise use YouTube thumbnail
//     const id = getYoutubeId(news.youtubeUrl);

//     if (!id) {
//       return "/images/no-image.jpg"; // optional fallback image
//     }

//     return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
//   };

//   const getYoutubeId = (url) => {
//     if (!url) return "";

//     const regExp =
//       /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([^?&/]+)/;

//     const match = url.match(regExp);

//     return match ? match[1] : "";
//   };

//   const getYoutubeThumbnail = (url) => {
//     const id = getYoutubeId(url);

//     if (!id) {
//       return "https://via.placeholder.com/800x450?text=No+Video";
//     }

//     return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
//   };

//   if (!videoNews) return null;

//   return (
//     <div className={`video_posts ${className || ""}`}>
//       <div className="container">
//         <div className="row">
//           <div className="col-12">
//             <div className="heading white">
//               <h2 className="widget-title">Video News</h2>
//             </div>
//           </div>
//         </div>

//         <div className="space-50" />

//         <div className={`viceo_posts_wrap ${dark ? "primay_bg" : ""}`}>
//           <div className="row">
//             <div className="col-lg-8">
//               <div className="single_post post_type3 post_type11 margintop-60- xs-mb30">
//                 <div className="post_img">
//                   <div className="img_wrap">
//                     <Link to={`/news/${videoNews.slug}`}>
//                       <img
//                         src={getYoutubeThumbnail(videoNews.youtubeUrl)}
//                         alt={videoNews.title}
//                         style={{
//                           width: "100%",
//                           height: "420px",
//                           objectFit: "cover",
//                         }}
//                       />
//                     </Link>
//                   </div>

//                   <p className="youtube_middle" onClick={() => setvModal(true)}>
//                     <FontAwesome name="youtube-play" />
//                   </p>
//                 </div>

//                 <div
//                   className={`single_post_text padding30 ${
//                     dark ? "dark-2" : "fourth_bg"
//                   }`}
//                 >
//                   <div className="meta3">
//                     <Link to="#">{videoNews.categories?.[0]?.name}</Link>

//                     <Link to="#">
//                       {new Date(videoNews.createdAt).toLocaleDateString()}
//                     </Link>
//                   </div>

//                   <h4>
//                     <Link to={`/news/${videoNews.slug}`}>
//                       {videoNews.title}
//                     </Link>
//                   </h4>
//                 </div>
//               </div>
//             </div>

//             <div className="col-lg-4">
//               <PopularPosts />
//             </div>
//           </div>
//         </div>
//       </div>

//       <ModalVideo
//         channel="youtube"
//         isOpen={vModal}
//         videoId={videoId}
//         onClose={() => setvModal(false)}
//       />
//     </div>
//   );
// };

// export default VideoPost;

// VideoPost.propTypes = {
//   className: ProtoTypes.string,
//   dark: ProtoTypes.bool,
// };

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
  // GET YOUTUBE VIDEO ID
  // =========================
  const getYoutubeId = (url) => {
    if (!url) return "";

    const regExp =
      /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([^?&/]+)/;

    const match = url.match(regExp);

    return match ? match[1] : "";
  };

  // =========================
  // GET VIDEO THUMBNAIL
  // =========================
  const getThumbnail = (news) => {
    // Uploaded thumbnail
    if (news?.thumbnail && news.thumbnail.trim() !== "") {
      return `${API}/uploads/images/${news.thumbnail}`;
    }

    // YouTube thumbnail
    const id = getYoutubeId(news?.youtubeUrl);

    if (id) {
      return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    }

    return "/images/no-image.jpg";
  };

  // =========================
  // FETCH VIDEO NEWS
  // =========================
  const getVideoNews = async () => {
    try {
      const res = await fetch(`${API}/api/news/videos?limit=10`);

      const data = await res.json();

      if (data.status && Array.isArray(data.data)) {
        const videos = data.data
          .filter((item) => Number(item.type) === 1)
          .filter((item) => Number(item.videoType) === 2)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );

        if (videos.length > 0) {
          const featured = videos[0];

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
  // DATE FORMAT
  // =========================
  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // =========================
  // LOADING
  // =========================
  if (!videoNews) {
    return null;
  }

  const featuredUrl = `/news/${videoNews.slug}`;

  return (
    <>
      <div className="mb30">
        <div className="container">
          <div className="video_posts padding20 white_bg border-radious5">
            {/* ================= HEADING ================= */}
            <div className="row">
              <div className="col-12">
                <div className="heading">
                  <h2 className="widget-title">Video News</h2>
                </div>
              </div>
            </div>

            {/* ================= CONTENT ================= */}
            <div className="row">
              {/* ================= FEATURED VIDEO ================= */}
              <div className="col-lg-8">
                <div className="single_post post_type3 post_type11 post_type21 xs-mb30">
                  {/* IMAGE */}
                  <div className="post_img border-radious7">
                    <div className="img_wrap">
                      <Link to={featuredUrl} className="play_btn">
                        <img
                          src={getThumbnail(videoNews)}
                          alt={videoNews.title || "Video News"}
                          style={{
                            width: "100%",
                            height: "420px",
                            objectFit: "cover",
                          }}
                        />
                      </Link>
                    </div>

                    {/* YOUTUBE PLAY */}
                    {videoId && (
                      <p
                        onClick={() => setVModal(true)}
                        className="youtube_middle"
                        style={{ cursor: "pointer" }}
                      >
                        <FontAwesome name="youtube-play" />
                      </p>
                    )}

                    {/* META */}
                    <div className="sport_meta_ab inline">
                      <ul>
                        <li>{videoNews.categories?.[0]?.name || "VIDEO"}</li>

                        <li>{formatDate(videoNews.createdAt)}</li>

                        {videoNews.duration && <li>{videoNews.duration}</li>}
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

                  {/* TITLE + STATS */}
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

              {/* ================= RIGHT SIDE VIDEOS ================= */}
              <div className="col-lg-4">
                {sideNews.map((item, i) => {
                  const newsUrl = `/news/${item.slug}`;

                  const category = item.categories?.[0];

                  const youtubeId = getYoutubeId(item.youtubeUrl);

                  return (
                    <div
                      key={item._id || i}
                      className="single_post type14 type22 widgets_small sm-mt30"
                    >
                      {/* IMAGE */}
                      <div className="post_img">
                        <div className="img_wrap">
                          <Link to={newsUrl} className="play_btn">
                            <img
                              src={getThumbnail(item)}
                              alt={item.title || "Video News"}
                              style={{
                                width: "100%",
                                height: "80px",
                                objectFit: "cover",
                              }}
                            />
                          </Link>
                        </div>

                        {/* PLAY ICON */}
                        {youtubeId && (
                          <span
                            className="youtube_small"
                            onClick={() => {
                              setVideoId(youtubeId);
                              setVModal(true);
                            }}
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            <FontAwesome name="youtube-play" />
                          </span>
                        )}
                      </div>

                      {/* CONTENT */}
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

                        {/* SEPARATOR */}
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

      {/* ================= YOUTUBE MODAL ================= */}
      <ModalVideo
        channel="youtube"
        isOpen={vModal}
        videoId={videoId}
        onClose={() => setVModal(false)}
      />
    </>
  );
};

export default VideoNews;
