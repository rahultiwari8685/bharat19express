// import React from "react";
// import finance21 from "../../assets/img/finance/finance-1.jpg";
// import finance22 from "../../assets/img/finance/finance-2.jpg";
// import finance23 from "../../assets/img/finance/finance-3.jpg";
// import finance24 from "../../assets/img/finance/finance-4.jpg";
// import FontAwesome from "../uiStyle/FontAwesome";
// import { Link } from "react-router-dom";

// const finance = [
//   {
//     image: finance21,
//     date: "April 26, 2020",
//     title: "Copa America: Luis Suarez from devastated US",
//     body: "The property, complete with seates screening from room amphitheater pond with sandy shower…",
//   },
//   {
//     image: finance22,
//     date: "April 26, 2020",
//     title: "Copa America: Luis Suarez from devastated US",
//     body: "The property, complete with seates screening from room amphitheater pond with sandy shower…",
//   },
//   {
//     image: finance23,
//     date: "April 26, 2020",
//     title: "Copa America: Luis Suarez from devastated US",
//     body: "The property, complete with seates screening from room amphitheater pond with sandy shower…",
//   },
//   {
//     image: finance24,
//     date: "April 26, 2020",
//     title: "Copa America: Luis Suarez from devastated US",
//     body: "The property, complete with seates screening from room amphitheater pond with sandy shower…",
//   },
// ];
// const WidgetFinance = () => {
//   return (
//     <div className="finance mb30 white_bg border-radious5 padding20 sm-mt30">
//       <div className="heading">
//         <h3 className="widget-title">World</h3>
//       </div>
//       {finance.map((item, i) => (
//         <div key={i} className="single_post mb30 type18">
//           <div className="post_img">
//             <div className="img_wrap">
//               <Link to="/">
//                 <img src={item.image} alt="thumb" />
//               </Link>
//             </div>
//             <span className="batch3 date">{item.date}</span>
//           </div>
//           <div className="single_post_text">
//             <h4>
//               <Link to="/post1">{item.title}</Link>
//             </h4>
//             <div className="space-10" />
//             <p className="post-p">{item.body}</p>
//             <ul className="mt20 like_cm">
//               <li>
//                 <Link to="/">
//                   <FontAwesome name="eye" /> 6745
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/">
//                   <FontAwesome name="heart" /> 6745
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/">
//                   <FontAwesome name="share" /> 6745
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </div>
//       ))}
//       <Link to="/" className="showmore">
//         Show more
//       </Link>
//     </div>
//   );
// };

// export default WidgetFinance;

import React, { useEffect, useState } from "react";
import FontAwesome from "../uiStyle/FontAwesome";
import { Link } from "react-router-dom";

const WidgetFinance = () => {
  const [worldNews, setWorldNews] = useState([]);

  useEffect(() => {
    getWorldNews();
  }, []);

  const getWorldNews = async () => {
    try {
      const res = await fetch(
        "https://api.iotaclasses.in/api/news/category/6ab51bfc302ad805145eb3ad?limit=10",
      );

      const data = await res.json();

      console.log("World News API:", data);

      if (data.status && Array.isArray(data.data)) {
        const news = data.data
          .filter((item) => Number(item.videoType) === 2)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);

        setWorldNews(news);
      }
    } catch (error) {
      console.error("World News Error:", error);
    }
  };

  if (!worldNews.length) return null;

  return (
    <div className="finance mb30 white_bg border-radious5 padding20 sm-mt30">
      {/* HEADING */}
      <div className="heading">
        <h3 className="widget-title">World</h3>
      </div>

      {/* WORLD NEWS */}
      {worldNews.map((item) => {
        const newsUrl = `/news/${item.slug}`;

        const image = item.thumbnail
          ? `https://api.iotaclasses.in/uploads/images/${item.thumbnail}`
          : "";

        return (
          <div key={item._id} className="single_post mb30 type18">
            {/* IMAGE */}
            <div className="post_img">
              <div className="img_wrap">
                <Link to={newsUrl}>
                  {image && (
                    <img
                      src={image}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "220px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </Link>
              </div>

              {/* DATE */}
              <span className="batch3 date">
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : ""}
              </span>
            </div>

            {/* CONTENT */}
            <div className="single_post_text">
              {/* TITLE */}
              <h4>
                <Link to={newsUrl}>
                  {item.title?.length > 100
                    ? `${item.title.substring(0, 100)}...`
                    : item.title}
                </Link>
              </h4>

              <div className="space-10" />

              {/* DESCRIPTION */}
              <p className="post-p">
                {item.subtitle
                  ? item.subtitle.length > 150
                    ? `${item.subtitle.substring(0, 150)}...`
                    : item.subtitle
                  : ""}
              </p>

              {/* META */}
              <ul className="mt20 like_cm">
                {/* VIEWS */}
                <li>
                  <Link to={newsUrl}>
                    <FontAwesome name="eye" /> {item.views || 0}
                  </Link>
                </li>

                {/* SHARES */}
                <li>
                  <Link to={newsUrl}>
                    <FontAwesome name="heart" /> {item.shares || 0}
                  </Link>
                </li>

                {/* SHARE */}
                <li>
                  <Link to={newsUrl}>
                    <FontAwesome name="share" /> {item.shares || 0}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        );
      })}

      {/* SHOW MORE */}
      <Link to="/category/world" className="showmore">
        Show more
      </Link>
    </div>
  );
};

export default WidgetFinance;
