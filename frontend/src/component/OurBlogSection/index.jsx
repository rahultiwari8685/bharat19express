import React, { useEffect, useState } from "react";
import ProtoTypes from "prop-types";

import { Link } from "react-router-dom";

const OurBlogSection = ({ dark }) => {
  const API = "https://api.iotaclasses.in";

  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    getLatestNews();
  }, []);

  const getLatestNews = async () => {
    try {
      const res = await fetch(`${API}/api/news/getAllNews?limit=3`);
      const data = await res.json();

      // if (data.status) {
      //   setBlogs(data.data);
      // }

      if (data.status) {
        const videoPosts = data.data.filter((item) => item.videoType === 2);

        setBlogs(videoPosts);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getYoutubeId = (url) => {
    if (!url) return "";

    const regExp =
      /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

    const match = url.match(regExp);

    return match && match[1].length === 11 ? match[1] : "";
  };

  return (
    <div className={`${dark ? "primay_bg" : "fourth_bg"} padding6030`}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="heading">
              <h2 className="widget-title">Our Latest News</h2>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          {blogs.slice(0, 6).map((item) => (
            <div className="col-md-6 col-lg-4">
              <div className="single_post post_type3 mb30">
                <div className="post_img">
                  <Link to={`/${item.categories?.[0]?.slug}/${item.slug}`}>
                    <img
                      src={
                        item.thumbnail
                          ? `${API}/uploads/images/${item.thumbnail}`
                          : item.youtubeUrl
                            ? `https://img.youtube.com/vi/${getYoutubeId(
                                item.youtubeUrl,
                              )}/hqdefault.jpg`
                            : "/images/no-image.jpg"
                      }
                      alt={item.title}
                    />
                  </Link>
                </div>
                <div className="single_post_text">
                  <div className="meta3">
                    <Link to={`/${item.categories?.[0]?.slug}/${item.slug}`}>
                      {item.categories?.[0]?.name}
                    </Link>
                    <Link to={`/${item.categories?.[0]?.slug}/${item.slug}`}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Link>
                  </div>
                  <h4>
                    <Link to={`/${item.categories?.[0]?.slug}/${item.slug}`}>
                      {item.title}
                    </Link>
                  </h4>
                  <div className="space-10" />
                  <p className="post-p">{item.subtitle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurBlogSection;

OurBlogSection.propTypes = {
  dark: ProtoTypes.bool,
};
