// import React from "react";

// import sports21 from "../../assets/img/post-sports-1.jpg";
// import sports22 from "../../assets/img/gallery-post/1.png";
// import sports23 from "../../assets/img/gallery-post/2.png";
// import sports24 from "../../assets/img/gallery-post/3.png";
// import sports25 from "../../assets/img/gallery-post/4.png";
// import sports26 from "../../assets/img/gallery-post/5.png";
// import FontAwesome from "../uiStyle/FontAwesome";
// import { Link } from "react-router-dom";

// const sports = [
//   {
//     photo: sports22,
//     category: "Technology",
//     title: "Copa America: Luis Suarez from devastated US",
//   },
//   {
//     photo: sports23,
//     category: "Technology",
//     title: "Copa America: Luis Suarez from devastated US",
//   },
//   {
//     photo: sports24,
//     category: "Technology",
//     title: "Copa America: Luis Suarez from devastated US",
//   },
//   {
//     photo: sports25,
//     category: "Technology",
//     title: "Copa America: Luis Suarez from devastated US",
//   },
//   {
//     photo: sports26,
//     category: "Technology",
//     title: "Copa America: Luis Suarez from devastated US",
//   },
// ];
// const Sports = () => {
//   return (
//     <div className="sport_side3 white_bg padding20 border-radious5">
//       <h3 className="widget-title">Sports</h3>
//       <div className="single_post mb30 type18">
//         <div className="post_img">
//           <div className="img_wrap">
//             <Link to="/">
//               <img src={sports21} alt="thumb" />
//             </Link>
//           </div>
//           <span className="batch3 date">April 26, 2020</span>
//         </div>
//         <div className="single_post_text">
//           <h4>
//             <Link to="/post1">
//               Copa America: Luis Suarez from devastated US
//             </Link>
//           </h4>
//           <div className="space-10" />
//           <p className="post-p">
//             The property, complete with 30-seat screening from room, a 100-seat
//             amphitheater and a swimming pond with sandy shower…
//           </p>
//           <ul className="mt20 like_cm">
//             <li>
//               <Link to="/">
//                 <FontAwesome name="eye" /> 6745
//               </Link>
//             </li>
//             <li>
//               <Link to="/">
//                 <FontAwesome name="heart" /> 6745
//               </Link>
//             </li>
//           </ul>
//         </div>
//       </div>
//       {sports.map((item, i) => (
//         <div key={i} className="single_post type10 type16 widgets_small mb15">
//           <div className="post_img">
//             <div className="img_wrap">
//               <Link to="/">
//                 <img src={item.photo} alt="thumb" />
//               </Link>
//             </div>
//           </div>
//           <div className="single_post_text">
//             <h4>
//               <Link to="/post1">{item.title}</Link>
//             </h4>
//             <p className="meta meta2">{item.category}</p>
//             {i + 1 < sports.length ? (
//               <>
//                 <div className="space-5" />
//                 <div className="border_black" />
//                 <div className="space-15" />
//               </>
//             ) : null}
//           </div>
//         </div>
//       ))}
//       <div className="space-20" />
//       <Link to="/" className="showmore">
//         Show more
//       </Link>
//     </div>
//   );
// };

// export default Sports;

import React, { useEffect, useState } from "react";
import FontAwesome from "../uiStyle/FontAwesome";
import { Link } from "react-router-dom";

const API = "https://api.iotaclasses.in";

const SPORTS_CATEGORY_ID = "6ab8fe27302ad805145ed91f";

const Sports = () => {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSportsNews();
  }, []);

  const fetchSportsNews = async () => {
    try {
      const res = await fetch(
        `${API}/api/news/category/${SPORTS_CATEGORY_ID}?limit=10`,
      );

      const data = await res.json();

      if (data.status && Array.isArray(data.data)) {
        const news = data.data
          // Published news
          .filter((item) => Number(item.type) === 1)
          // Video news
          .filter((item) => Number(item.videoType) === 2)
          // Latest first
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 6);

        setSports(news);
      }
    } catch (error) {
      console.error("Sports News API Error:", error);
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
      <div className="sport_side3 white_bg padding20 border-radious5">
        <h3 className="widget-title">Sports</h3>

        <div className="text-center py-3">Loading...</div>
      </div>
    );
  }

  if (sports.length === 0) {
    return (
      <div className="sport_side3 white_bg padding20 border-radious5">
        <h3 className="widget-title">Sports</h3>

        <div className="text-center py-3">No sports news available</div>
      </div>
    );
  }

  const featured = sports[0];

  const remainingNews = sports.slice(1);

  const featuredImage = featured.thumbnail
    ? `${API}/uploads/images/${featured.thumbnail}`
    : "/images/no-image.jpg";

  const featuredUrl = `/news/${featured.slug}`;

  return (
    <div className="sport_side3 white_bg padding20 border-radious5">
      <h3 className="widget-title">Sports</h3>

      <div className="single_post mb30 type18">
        <div className="post_img">
          <div className="img_wrap">
            <Link to={featuredUrl}>
              <img src={featuredImage} alt={featured.title || "Sports News"} />
            </Link>
          </div>

          {/* DATE */}
          <span className="batch3 date">{formatDate(featured.createdAt)}</span>
        </div>

        <div className="single_post_text">
          <h4>
            <Link to={featuredUrl}>{featured.title}</Link>
          </h4>

          <div className="space-10" />

          <p className="post-p">
            {featured.description
              ? featured.description.length > 180
                ? `${featured.description.substring(0, 180)}...`
                : featured.description
              : featured.shortDescription
                ? featured.shortDescription.length > 180
                  ? `${featured.shortDescription.substring(0, 180)}...`
                  : featured.shortDescription
                : "Read the latest sports news and updates."}
          </p>

          <ul className="mt20 like_cm">
            <li>
              <Link to={featuredUrl}>
                <FontAwesome name="eye" /> {featured.views || 0}
              </Link>
            </li>

            <li>
              <Link to={featuredUrl}>
                <FontAwesome name="heart" /> {featured.likes || 0}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {remainingNews.map((item, i) => {
        const image = item.thumbnail
          ? `${API}/uploads/images/${item.thumbnail}`
          : "/images/no-image.jpg";

        const newsUrl = `/news/${item.slug}`;

        const category = item.categories?.[0];

        return (
          <div
            key={item._id || i}
            className="single_post type10 type16 widgets_small mb15"
          >
            {/* IMAGE */}
            <div className="post_img">
              <div className="img_wrap">
                <Link to={newsUrl}>
                  <img src={image} alt={item.title || "Sports News"} />
                </Link>
              </div>
            </div>

            {/* CONTENT */}
            <div className="single_post_text">
              {/* TITLE */}
              <h4>
                <Link to={newsUrl}>
                  {item.title?.length > 75
                    ? `${item.title.substring(0, 75)}...`
                    : item.title}
                </Link>
              </h4>

              {/* CATEGORY */}
              <p className="meta meta2">
                <Link to={category?.slug ? `/category/${category.slug}` : "#"}>
                  {category?.name || "Sports"}
                </Link>
              </p>

              {/* SEPARATOR */}
              {i + 1 < remainingNews.length && (
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

      <div className="space-20" />

      {/* SHOW MORE */}
      <Link to="/category/sports" className="showmore">
        Show more
      </Link>
    </div>
  );
};

export default Sports;
