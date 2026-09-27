// import React from "react";
// import tab21 from "../../assets/img/opinion-post-thumb.jpg";
// import { Link } from "react-router-dom";

// const Opinion = () => {
//   return (
//     <div className="opinion white_bg padding20 border-radious5">
//       <h3 className="widget-title">Opinion</h3>
//       <div className="single_post post_type3 post_type15">
//         <div className="post_img border-radious5">
//           <Link to="/">
//             <img src={tab21} alt="thumb" />
//           </Link>
//         </div>
//         <div className="single_post_text">
//           <h4>
//             <Link to="/post1">
//               Japan’s virus puzzled the world luck running out?
//             </Link>
//           </h4>
//           <div className="space-10" />
//           <p className="post-p">
//             The property, complete with 30-seat screening from room, a 100-seat
//             amphitheater and a swimming pond with sandy shower…
//           </p>
//           <div className="space-20" />
//           <div className="meta3">
//             <Link to="/">TECHNOLOGY</Link>
//             <Link to="/">March 26, 2020</Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Opinion;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API = "https://api.iotaclasses.in";

const OPINION_CATEGORY_ID = "OPINION_CATEGORY_ID";

const Opinion = () => {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpinionNews();
  }, []);

  const fetchOpinionNews = async () => {
    try {
      const res = await fetch(
        `${API}/api/news/category/6ab8fe40302ad805145ed925?limit=1`,
      );

      const data = await res.json();

      if (data.status && Array.isArray(data.data)) {
        const opinionNews = data.data
          .filter((item) => Number(item.type) === 1)
          .filter((item) => Number(item.videoType) === 2)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );

        setNews(opinionNews[0] || null);
      }
    } catch (error) {
      console.error("Opinion News API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="opinion white_bg padding20 border-radious5">
        <h3 className="widget-title">Opinion</h3>

        <div className="text-center py-3">Loading...</div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="opinion white_bg padding20 border-radious5">
        <h3 className="widget-title">Opinion</h3>

        <div className="text-center py-3">No opinion news available</div>
      </div>
    );
  }

  const image = news.thumbnail
    ? `${API}/uploads/images/${news.thumbnail}`
    : "/images/no-image.jpg";

  const newsUrl = `/news/${news.slug}`;

  const category = news.categories?.[0];

  return (
    <div className="opinion white_bg padding20 border-radious5">
      <h3 className="widget-title">Opinion</h3>

      <div className="single_post post_type3 post_type15">
        {/* IMAGE */}
        <div className="post_img border-radious5">
          <Link to={newsUrl}>
            <img src={image} alt={news.title || "Opinion"} />
          </Link>
        </div>

        {/* CONTENT */}
        <div className="single_post_text">
          {/* TITLE */}
          <h4>
            <Link to={newsUrl}>{news.title}</Link>
          </h4>

          <div className="space-10" />

          {/* DESCRIPTION */}
          <p className="post-p">
            {news.description
              ? news.description.length > 180
                ? `${news.description.substring(0, 180)}...`
                : news.description
              : news.shortDescription
                ? news.shortDescription.length > 180
                  ? `${news.shortDescription.substring(0, 180)}...`
                  : news.shortDescription
                : "Read the latest opinion and analysis."}
          </p>

          <div className="space-20" />

          {/* META */}
          <div className="meta3">
            <Link to={category?.slug ? `/category/${category.slug}` : "#"}>
              {category?.name || "Opinion"}
            </Link>

            <Link to={newsUrl}>{formatDate(news.createdAt)}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Opinion;
