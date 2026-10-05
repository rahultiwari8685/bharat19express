import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FontAwesome from "../uiStyle/FontAwesome";

import ModalVideo from "react-modal-video";
import "react-modal-video/css/modal-video.min.css";

import big_img from "../../assets/img/gallery-post-2.jpg";
import col26 from "../../assets/img/post-news-thumb-1.png";
import col21 from "../../assets/img/post-news/1.jpg";

const PostGalleryTwo = () => {
  const navigate = useNavigate();

  const API = "https://api.iotaclasses.in";

  const [videoNews, setVideoNews] = useState(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [videoId, setVideoId] = useState("");

  const [textNews, setTextNews] = useState([]);

  const [activePoll, setActivePoll] = useState(null);
  const [pollLoading, setPollLoading] = useState(true);
  const [pollVoting, setPollVoting] = useState(false);
  const [pollVoted, setPollVoted] = useState(false);

  const [latestNews, setLatestNews] = useState([]);
  const [latestNewsLoading, setLatestNewsLoading] = useState(false);

  useEffect(() => {
    getVideoNews();
    getTextNews();
    getActivePoll();
  }, []);

  const getYoutubeId = (url) => {
    if (!url) return "";

    try {
      const parsedUrl = new URL(url);

      if (parsedUrl.searchParams.get("v")) {
        return parsedUrl.searchParams.get("v");
      }

      if (parsedUrl.hostname.includes("youtu.be")) {
        return parsedUrl.pathname.replace("/", "");
      }

      if (parsedUrl.pathname.includes("/shorts/")) {
        return parsedUrl.pathname.split("/shorts/")[1].split("/")[0];
      }

      if (parsedUrl.pathname.includes("/embed/")) {
        return parsedUrl.pathname.split("/embed/")[1].split("/")[0];
      }

      return "";
    } catch (error) {
      return "";
    }
  };

  const getVideoNews = async () => {
    try {
      const res = await fetch(`${API}/api/news/videos?limit=10`);
      const data = await res.json();

      console.log("Video News API:", data);

      if (data.status) {
        const videos = (data.data || [])
          .filter((item) => Number(item.type) === 1)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );

        if (videos.length > 0) {
          setVideoNews(videos[0]);
        }
      }
    } catch (error) {
      console.error("Video News Error:", error);
    }
  };

  const getTextNews = async () => {
    try {
      const res = await fetch(`${API}/api/news/getAllNews?limit=15`);
      const data = await res.json();

      console.log("Text News API:", data);

      if (data.status) {
        const news = (data.data || [])
          .filter((item) => {
            if (Number(item.type) !== 1) return false;

            return Number(item.videoType) === 2;
          })
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 3);

        setTextNews(news);
      }
    } catch (error) {
      console.error("Text News Error:", error);
    }
  };
  // const getActivePoll = async () => {
  //   try {
  //     setPollLoading(true);

  //     const res = await fetch(`${API}/api/polls/active`);
  //     const data = await res.json();

  //     if (data.success && data.data) {
  //       setActivePoll(data.data);
  //     } else {
  //       setActivePoll(null);
  //     }
  //   } catch (error) {
  //     console.error("Poll Error:", error);
  //     setActivePoll(null);
  //   } finally {
  //     setPollLoading(false);
  //   }
  // };

  const getActivePoll = async () => {
    try {
      setPollLoading(true);

      const res = await fetch(`${API}/api/polls/active`);
      const data = await res.json();

      if (data.success && data.data) {
        // Active poll found
        setActivePoll(data.data);
      } else {
        // No active poll
        setActivePoll(null);

        // Show latest news instead
        getLatestNews();
      }
    } catch (error) {
      console.error("Poll Error:", error);

      setActivePoll(null);

      // If poll API fails, show latest news
      getLatestNews();
    } finally {
      setPollLoading(false);
    }
  };

  const getLatestNews = async () => {
    try {
      setLatestNewsLoading(true);

      const res = await fetch(`${API}/api/news/getAllNews?limit=5`);

      const data = await res.json();

      if (data.status && Array.isArray(data.data)) {
        const news = data.data
          .filter((item) => Number(item.type) === 1)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 3);

        setLatestNews(news);
      } else {
        setLatestNews([]);
      }
    } catch (error) {
      console.error("Latest News Error:", error);
      setLatestNews([]);
    } finally {
      setLatestNewsLoading(false);
    }
  };

  const votePoll = async (optionIndex) => {
    if (!activePoll || pollVoting || pollVoted) {
      return;
    }

    try {
      const loginInfo = JSON.parse(localStorage.getItem("logininfo") || "null");

      const token = loginInfo?.token;

      // Customer is not logged in
      if (!token) {
        alert("Please login to vote.");
        navigate("/login");
        return;
      }

      setPollVoting(true);

      const res = await fetch(`${API}/api/polls/${activePoll._id}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          option_index: optionIndex,
        }),
      });

      const data = await res.json();

      console.log("Poll Vote Response:", data);

      // Token expired / invalid
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("logininfo");

        alert(data.message || "Your login has expired. Please login again.");

        navigate("/login");
        return;
      }

      // Backend error
      if (!data.success) {
        alert(data.message || "Unable to submit vote.");
        return;
      }

      // Vote successful
      setPollVoted(true);

      // Get updated poll results
      const resultRes = await fetch(
        `${API}/api/polls/${activePoll._id}/results`,
      );

      const resultData = await resultRes.json();

      console.log("Poll Result Response:", resultData);

      if (resultData.success) {
        setActivePoll(resultData.data);
      }
    } catch (error) {
      console.error("Vote Error:", error);

      alert(error?.message || "Something went wrong while voting.");
    } finally {
      setPollVoting(false);
    }
  };

  const youtubeId = videoNews ? getYoutubeId(videoNews.youtubeUrl) : "";

  const videoImage = videoNews?.thumbnail
    ? `${API}/uploads/images/${videoNews.thumbnail}`
    : youtubeId
      ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
      : big_img;

  const videoCategory = videoNews?.categories?.[0];

  const videoCategoryUrl = videoCategory?.slug
    ? `/category/${videoCategory.slug}`
    : "#";

  const videoNewsUrl = videoNews?.slug ? `/news/${videoNews.slug}` : "#";

  const openVideo = () => {
    if (!youtubeId) return;

    setVideoId(youtubeId);
    setIsVideoOpen(true);
  };

  return (
    <>
      <ModalVideo
        channel="youtube"
        youtube={{ autoplay: 1 }}
        isOpen={isVideoOpen}
        videoId={videoId}
        onClose={() => setIsVideoOpen(false)}
      />

      <div className="post_gallary_area theme3_bg mb40 padding-top-30">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-xl-6">
              <div className="single_post post_type6 border-radious7 xs-mb30">
                <div className="post_img gradient1">
                  <div className="img_wrap">
                    {videoNews && youtubeId ? (
                      <iframe
                        width="100%"
                        height="350"
                        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&rel=0&playsinline=1`}
                        title={videoNews.title}
                        frameBorder="0"
                        allow="autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                        style={{
                          width: "100%",
                          height: "350px",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : (
                      <img
                        src={big_img}
                        alt="Video News"
                        style={{
                          width: "100%",
                          height: "350px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>
                </div>

                <div className="single_post_text">
                  <h4>
                    {videoNews ? (
                      <Link to={videoNewsUrl}></Link>
                    ) : (
                      <Link to="/video_post1">Latest Video News</Link>
                    )}
                  </h4>

                  <div className="space-5" />

                  <p className="post-p">
                    {videoNews?.description
                      ? videoNews.description.length > 180
                        ? `${videoNews.description.substring(0, 180)}...`
                        : videoNews.description
                      : ""}
                  </p>

                  <div className="space-20" />

                  <div className="meta meta_separator1">
                    <Link to={videoCategoryUrl}>
                      {videoCategory?.name || "News"}
                    </Link>

                    <Link to={videoNewsUrl}>
                      {videoNews?.createdAt
                        ? new Date(videoNews.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )
                        : "Latest"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-none d-xl-block col-xl-3">
              <div className="white_bg padding15 border-radious5 sm-mt30">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "20px",
                      fontWeight: "700",
                    }}
                  >
                    Latest News
                  </h4>
                </div>
                {textNews.length > 0 ? (
                  textNews.map((item, i) => {
                    const newsUrl = `/news/${item.slug}`;

                    const category = item.categories?.[0];

                    const categoryUrl = category?.slug
                      ? `/category/${category.slug}`
                      : "#";

                    const image = item.thumbnail
                      ? `${API}/uploads/images/${item.thumbnail}`
                      : col21;

                    return (
                      <div
                        key={item._id}
                        className="single_post type14 widgets_small"
                      >
                        {/* IMAGE */}
                        <div className="post_img">
                          <div className="img_wrap">
                            <Link to={newsUrl}>
                              <img
                                src={image}
                                alt={item.title}
                                style={{
                                  width: "100%",
                                  height: "100px",
                                  objectFit: "cover",
                                }}
                              />
                            </Link>
                          </div>
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

                          <div className="meta4">
                            <Link to={categoryUrl}>
                              {category?.name || "News"}
                            </Link>
                          </div>

                          {i + 1 < textNews.length && (
                            <>
                              <div className="space-5" />
                              <div className="border_black" />
                              <div className="space-15" />
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>Loading news...</p>
                )}
              </div>
            </div>

            <div className="d-none d-lg-block col-lg-4 col-xl-3">
              <div
                className="white_bg padding20 border-radious5 sm-mt30"
                style={{
                  border: "1px solid #e5e5e5",
                }}
              >
                {pollLoading ? (
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4
                        style={{
                          margin: 0,
                          fontSize: "20px",
                          fontWeight: "700",
                        }}
                      >
                        Poll
                      </h4>
                    </div>

                    <p className="mb-0">Loading...</p>
                  </>
                ) : activePoll ? (
                  <>
                    {/* =========================
            ACTIVE POLL
        ========================= */}

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4
                        style={{
                          margin: 0,
                          fontSize: "20px",
                          fontWeight: "700",
                        }}
                      >
                        Poll
                      </h4>

                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          padding: "4px 9px",
                          borderRadius: "20px",
                          background: "#f1f1f1",
                        }}
                      >
                        VOTE
                      </span>
                    </div>

                    {/* QUESTION */}

                    <h5
                      style={{
                        fontSize: "17px",
                        lineHeight: "1.5",
                        fontWeight: "700",
                        marginBottom: "18px",
                      }}
                    >
                      {activePoll.question}
                    </h5>

                    {/* OPTIONS */}

                    {!pollVoted ? (
                      <div>
                        {activePoll.options?.map((option, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => votePoll(index)}
                            disabled={pollVoting}
                            style={{
                              width: "100%",
                              textAlign: "left",
                              border: "1px solid #ddd",
                              background: "#fff",
                              borderRadius: "6px",
                              padding: "11px 12px",
                              marginBottom: "10px",
                              cursor: pollVoting ? "not-allowed" : "pointer",
                              fontSize: "14px",
                              fontWeight: "600",
                              transition: "0.2s",
                            }}
                          >
                            {option.text}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div>
                        {activePoll.options?.map((option, index) => (
                          <div
                            key={index}
                            style={{
                              marginBottom: "15px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "5px",
                                fontSize: "13px",
                                fontWeight: "600",
                              }}
                            >
                              <span>{option.text}</span>

                              <span>{option.percentage || 0}%</span>
                            </div>

                            <div
                              style={{
                                width: "100%",
                                height: "8px",
                                background: "#e9ecef",
                                borderRadius: "10px",
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  width: `${option.percentage || 0}%`,
                                  height: "100%",
                                  background: "#111",
                                  borderRadius: "10px",
                                  transition: "width 0.5s ease",
                                }}
                              />
                            </div>

                            <div
                              style={{
                                marginTop: "3px",
                                fontSize: "11px",
                                color: "#777",
                              }}
                            >
                              {option.votes || 0} votes
                            </div>
                          </div>
                        ))}

                        <div
                          style={{
                            borderTop: "1px solid #eee",
                            paddingTop: "10px",
                            marginTop: "10px",
                            fontSize: "12px",
                            color: "#777",
                          }}
                        >
                          Total Votes: {activePoll.totalVotes || 0}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* =========================
            LATEST NEWS
        ========================= */}

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4
                        style={{
                          margin: 0,
                          fontSize: "20px",
                          fontWeight: "700",
                        }}
                      >
                        Top News
                      </h4>
                    </div>

                    {latestNewsLoading ? (
                      <p className="mb-0">Loading latest news...</p>
                    ) : latestNews.length > 0 ? (
                      latestNews.map((item, index) => {
                        const newsUrl = `/news/${item.slug}`;

                        const image = item.thumbnail
                          ? `${API}/uploads/images/${item.thumbnail}`
                          : col21;

                        const category = item.categories?.[0];

                        return (
                          <div key={item._id || index}>
                            <div
                              style={{
                                display: "flex",
                                gap: "10px",
                                alignItems: "center",
                              }}
                            >
                              {/* IMAGE */}

                              <div
                                style={{
                                  width: "75px",
                                  height: "60px",
                                  flexShrink: 0,
                                  overflow: "hidden",
                                  borderRadius: "5px",
                                }}
                              >
                                <Link to={newsUrl}>
                                  <img
                                    src={image}
                                    alt={item.title || "Latest News"}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                  />
                                </Link>
                              </div>

                              {/* CONTENT */}

                              <div>
                                <p
                                  style={{
                                    margin: "0 0 4px",
                                    fontSize: "10px",
                                    fontWeight: "700",
                                    color: "#e31e24",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  {category?.name || "News"}
                                </p>

                                <h5
                                  style={{
                                    margin: 0,
                                    fontSize: "13px",
                                    lineHeight: "1.4",
                                    fontWeight: "700",
                                  }}
                                >
                                  <Link
                                    to={newsUrl}
                                    style={{
                                      color: "#222",
                                      textDecoration: "none",
                                    }}
                                  >
                                    {item.title?.length > 70
                                      ? `${item.title.substring(0, 70)}...`
                                      : item.title}
                                  </Link>
                                </h5>
                              </div>
                            </div>

                            {/* SEPARATOR */}

                            {index + 1 < latestNews.length && (
                              <>
                                <div className="space-10" />
                                <div className="border_black" />
                                <div className="space-10" />
                              </>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="mb-0">No latest news available.</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostGalleryTwo;
