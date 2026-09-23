import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BreadCrumb from "../../../component/BreadCrumb";
import FontAwesome from "../../../component/uiStyle/FontAwesome";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  LinkedinShareButton,
  RedditShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  TelegramIcon,
  LinkedinIcon,
  RedditIcon,
  EmailIcon,
} from "react-share";
import WidgetTab from "../../../component/WidgetTab";
import WidgetTrendingNews from "../../../component/WidgetTrendingNews";
import NewsLetter from "../../../component/NewsLetter";
import MostShareWidget from "../../../component/MostShareWidget";
import FollowUs from "../../../component/FollowUs";
import BannerSection from "../../../component/BannerSection";
import PostOnePagination from "../../../component/PostOnePagination";

// images
import banner2 from "../../../assets/img/ad/ad-2.jpg";
import big2 from "../../../assets/img/post-thumb-4.png";
import author2 from "../../../assets/img/comments-1.png";
import quote from "../../../assets/img/icon/q.png";
import quote_1 from "../../../assets/img/post-quote.jpg";
import big1 from "../../../assets/img/post-thumb-3.jpg";
import smail1 from "../../../assets/img/post-thumb-2.png";
import single_post1 from "../../../assets/img/post-thumb-5.png";
import OurBlogSection from "../../../component/OurBlogSection";
import BlogComment from "../../../component/BlogComment";

function Post1() {
  const API = "https://api.hindustantvlive.com";

  // const { slug } = useParams();
  const { categorySlug, slug } = useParams();
  const [news, setNews] = useState(null);

  const [banners, setBanners] = useState({});

  useEffect(() => {
    const loadNews = async () => {
      try {
        const res = await fetch(`${API}/api/news/slug/${slug}`);
        const data = await res.json();

        if (data.status) {
          setNews(data.data);

          // Increase View
          increaseView(data.data._id);
        }
      } catch (err) {
        console.log(err);
      }
    };

    loadNews();
  }, [slug]);

  const getAdvertisements = async () => {
    try {
      const res = await fetch(
        "https://api.hindustantvlive.com/api/advertisements",
      );

      const data = await res.json();

      if (data.success) {
        const ads = {};

        data.data.forEach((item) => {
          if (item.status) {
            ads[item.position] = item;
          }
        });

        setBanners(ads);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAdvertisements();
  }, []);

  if (!news) {
    return <h2 className="text-center mt-5">Loading...</h2>;
  }

  const shareUrl = `https://api.hindustantvlive.com/api/news/share/${news?.slug || ""}`;

  const shareTitle = news?.title || "";

  const shareImage = news?.thumbnail
    ? `${API}/uploads/images/${news.thumbnail}`
    : "";

  const cleanContent = news?.content
    ?.replace(/style="[^"]*"/g, "")
    ?.replace(/<p><br><\/p>/g, "");

  const getYoutubeId = (url) => {
    if (!url) return "";

    const regExp =
      /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

    const match = url.match(regExp);

    return match && match[1].length === 11 ? match[1] : "";
  };

  const increaseShare = async () => {
    try {
      await fetch(`${API}/api/news/share/${news._id}`, {
        method: "POST",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const increaseView = async (id) => {
    try {
      await fetch(`${API}/api/news/view/${id}`, {
        method: "POST",
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="archives post post1">
        <BreadCrumb
          className="shadow5 padding-top-10"
          title={`${news.categories?.[0]?.name || "News"} / ${news.title}`}
        />
        <span className="space-10" />
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-lg-8">
              <div className="row">
                <div className="col-11">
                  <div className="page_category">
                    {/* <h4>{news.categories?.[0]?.name}</h4> */}
                    <div className="share-section mt-1">
                      {/* <h5>Share this article</h5> */}
                    </div>
                  </div>
                </div>
                {/* <div className="col-6 text-right">
                  <div className="page_comments">
                    <ul className="inline">
                      <li>
                        <FontAwesome name="comment" />
                        {news.views}
                      </li>
                      <li>
                        <FontAwesome name="fire" />
                        {news.views}
                      </li>
                    </ul>
                  </div>
                </div> */}
              </div>

              <div className="single_post_heading">
                <h1>{news.title}</h1>
                <div className="space-10" />
                {/* <p>{news.subtitle}</p> */}
              </div>

              <div className="row">
                <div className="col-lg-4 align-self-center">
                  <div className="author">
                    <div className="author_img">
                      <div className="author_img_wrap">
                        <img
                          src={
                            news.author?.profileImage
                              ? `${API}/uploads/images/${news.author.profileImage}`
                              : author2
                          }
                          alt={news.author?.name || "Author"}
                        />
                      </div>
                    </div>

                    <Link to="#">{news.author?.name || "Admin"}</Link>

                    {/* <ul>
                      <li>
                        <Link to="#">
                          {new Date(news.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </Link>
                      </li>

                      <li>
                        Updated{" "}
                        {new Date(news.updatedAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </li>
                    </ul> */}
                  </div>
                </div>
                <div className="col-lg-8 ">
                  <div className="d-flex gap-2 flex-right">
                    <FacebookShareButton
                      url={shareUrl}
                      quote={shareTitle}
                      onClick={increaseShare}
                      hashtag="#hindustantvlive"
                    >
                      <FacebookIcon size={42} round />
                    </FacebookShareButton>

                    <TwitterShareButton
                      url={shareUrl}
                      title={shareTitle}
                      onClick={increaseShare}
                    >
                      <TwitterIcon size={42} round />
                    </TwitterShareButton>

                    <WhatsappShareButton
                      url={shareUrl}
                      title={shareTitle}
                      onClick={increaseShare}
                    >
                      <WhatsappIcon size={42} round />
                    </WhatsappShareButton>

                    <TelegramShareButton
                      url={shareUrl}
                      title={shareTitle}
                      onClick={increaseShare}
                    >
                      <TelegramIcon size={42} round />
                    </TelegramShareButton>

                    <LinkedinShareButton
                      url={shareUrl}
                      title={shareTitle}
                      onClick={increaseShare}
                      summary={news.subtitle}
                    >
                      <LinkedinIcon size={42} round />
                    </LinkedinShareButton>

                    <RedditShareButton
                      url={shareUrl}
                      title={shareTitle}
                      onClick={increaseShare}
                    >
                      <RedditIcon size={42} round />
                    </RedditShareButton>

                    <EmailShareButton
                      url={shareUrl}
                      subject={shareTitle}
                      body={shareTitle}
                      onClick={increaseShare}
                    >
                      <EmailIcon size={42} round />
                    </EmailShareButton>

                    {/* <button
                          className="btn btn-dark btn-sm"
                          style={{ display: "inline-block", zIndex: 9999 }}
                          onClick={() => {
                            navigator.clipboard.writeText(shareUrl);
                            alert("Link copied!");
                          }}
                        >
                          Copy
                        </button> */}
                  </div>
                </div>
              </div>
              <div className="space-40" />
              <img
                src={
                  news.thumbnail
                    ? `${API}/uploads/images/${news.thumbnail}`
                    : `https://img.youtube.com/vi/${getYoutubeId(
                        news.youtubeUrl,
                      )}/hqdefault.jpg`
                }
                alt={news.title}
              />

              <div
                className="article-content mt-4"
                dangerouslySetInnerHTML={{
                  __html: cleanContent,
                }}
              />

              <div className="tags">
                <ul className="inline">
                  <li className="tag_list">
                    <FontAwesome name="tag" /> tags
                  </li>
                  {news.categories?.map((cat) => (
                    <li key={cat._id}>
                      <Link to={`/category/${cat._id}`}>{cat.name}</Link>
                    </li>
                  ))}
                  <li>
                    <Link to="/">World</Link>
                  </li>
                  <li>
                    <Link to="/">Corona</Link>
                  </li>
                </ul>
              </div>
              <div className="space-40" />
              <div className="border_black" />
              <div className="space-40" />
              <PostOnePagination newsId={news._id} />
            </div>
            <div className="col-md-6 col-lg-4">
              {/* <WidgetTab /> */}
              <WidgetTab categoryId={news.categories?.[0]?._id} />

              <FollowUs title="Follow Us" />
              <WidgetTrendingNews />
              <div className="banner2 mb30">
                {banners.sidebar && (
                  <a
                    href={banners.sidebar.redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={`https://api.hindustantvlive.com/uploads/advertisements/${banners.sidebar.image}`}
                      alt={banners.sidebar.title}
                      className="img-fluid"
                    />
                  </a>
                )}
              </div>
              {/* <MostShareWidget title="Most Share" /> */}
              {/* <NewsLetter /> */}
            </div>
          </div>
        </div>
      </div>
      {/* <div className="space-10" /> */}
      <OurBlogSection />
      {/* <div className="space-10" /> */}
      {/* <BlogComment /> */}
      {/* <div className="space-10" /> */}
      <BannerSection />

      <style>{`

.share-section {
  margin: 35px 0;
}

.share-section .d-flex {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: nowrap !important;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  padding-bottom: 8px;
}

.share-section .d-flex::-webkit-scrollbar {
  height: 4px;
}

.share-section .d-flex::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}

.share-section .d-flex > * {
  flex: 0 0 auto;
}

.share-section button {
  flex: 0 0 auto;
}

.share-section button{
    border:none;
    background:transparent;
    cursor:pointer;
    transition:.3s;
}

.share-section button:hover{
    transform:scale(1.1);
}

.article-content{
    font-size:20px;
    line-height:1.9;
    color:#222;
}

.article-content p{
    font-size:20px;
    line-height:1.9;
    margin-bottom:20px;
}

.article-content h1{
    font-size:40px;
    font-weight:700;
    margin:30px 0 20px;
}

.article-content h2{
    font-size:34px;
    font-weight:700;
    margin:30px 0 20px;
}

.article-content h3{
    font-size:28px;
    font-weight:700;
    margin:25px 0 15px;
}

.article-content h4{
    font-size:24px;
    font-weight:700;
    margin:20px 0 15px;
}

.article-content strong{
    font-weight:700;
}

.article-content img{
    width:100%;
    height:auto;
    margin:20px 0;
    border-radius:6px;
}

.article-content iframe{
    width:100%;
    min-height:500px;
}

.article-content ul{
    padding-left:25px;
}

.article-content li{
    margin-bottom:10px;
}
`}</style>
    </>
  );
}

export default Post1;
