// import React from "react";
// import { Link } from "react-router-dom";
// // images
// import business21 from "../../assets/img/business-post/business-post-1.jpg";
// import arrow3 from "../../assets/img/icon/arrow3.png";
// import business22 from "../../assets/img/business-post/business-post-2.jpg";
// import business23 from "../../assets/img/business-post/business-post-3.jpg";
// import business24 from "../../assets/img/business-post/business-post-4.jpg";
// import business25 from "../../assets/img/business-post/business-post-5.jpg";
// import business26 from "../../assets/img/business-post/business-post-6.jpg";
// import FontAwesome from "../uiStyle/FontAwesome";

// const business = [
//   {
//     photo: business21,
//     date: "April 26, 2020",
//     title: "She tried for many years pregnant & happy and thing going..",
//     description:
//       "She tried for so many years and now she finally pregnant happy and things are going well & it just happens that this pregnancy takes place with this epidemic…",
//   },
//   {
//     photo: business22,
//     date: "April 26, 2020",
//     title: "She tried for many years pregnant & happy and thing going..",
//     description:
//       "She tried for so many years and now she finally pregnant happy and things are going well & it just happens that this pregnancy takes place with this epidemic…",
//   },
//   {
//     photo: business23,
//     date: "April 26, 2020",
//     title: "She tried for many years pregnant & happy and thing going..",
//     description:
//       "She tried for so many years and now she finally pregnant happy and things are going well & it just happens that this pregnancy takes place with this epidemic…",
//   },
//   {
//     photo: business24,
//     date: "April 26, 2020",
//     title: "She tried for many years pregnant & happy and thing going..",
//     description:
//       "She tried for so many years and now she finally pregnant happy and things are going well & it just happens that this pregnancy takes place with this epidemic…",
//   },
//   {
//     photo: business25,
//     date: "April 26, 2020",
//     title: "She tried for many years pregnant & happy and thing going..",
//     description:
//       "She tried for so many years and now she finally pregnant happy and things are going well & it just happens that this pregnancy takes place with this epidemic…",
//   },
//   {
//     photo: business26,
//     date: "April 26, 2020",
//     title: "She tried for many years pregnant & happy and thing going..",
//     description:
//       "She tried for so many years and now she finally pregnant happy and things are going well & it just happens that this pregnancy takes place with this epidemic…",
//   },
// ];
// const BusinessNewsTwo = () => {
//   return (
//     <div className="business3 padding20 white_bg border-radious5">
//       <h4 className="widget-title">Trending News</h4>
//       {business.map((item, i) => (
//         <div key={i} className="single_post post_type12 type20">
//           <div className="post_img border-radious5">
//             <div className="img_wrap">
//               <Link to="/business">
//                 <img src={item.photo} alt="thumb" />
//               </Link>
//             </div>
//             <span className="tranding border_tranding">
//               <FontAwesome name="bolt" />
//             </span>
//           </div>
//           <div className="single_post_text">
//             <h4>
//               <Link to="/post1">{item.title}</Link>
//             </h4>
//             <div className="row">
//               <div className="col-6 align-self-center">
//                 <div className="meta_col">
//                   <p>{item.date}</p>
//                 </div>
//               </div>
//               <div className="col-6 text-right align-self-center">
//                 <ul className="meta_share inline">
//                   <li>
//                     <Link to="/">
//                       <FontAwesome name="bookmark" />
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="/">
//                       <FontAwesome name="share" />
//                     </Link>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//             <p className="post-p">{item.description}</p>
//             <div className="space-10" />
//             <Link to="/business" className="readmore3">
//               Read more <img src={arrow3} alt="arrow3" />
//             </Link>
//             {i + 1 < business.length ? (
//               <>
//                 <div className="space-10" />
//                 <div className="border_black" />
//                 <div className="space-15" />
//               </>
//             ) : null}
//           </div>
//         </div>
//       ))}
//       <Link to="/" className="showmore">
//         Show more
//       </Link>
//     </div>
//   );
// };

// export default BusinessNewsTwo;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import arrow3 from "../../assets/img/icon/arrow3.png";
import FontAwesome from "../uiStyle/FontAwesome";

const BusinessNewsTwo = () => {
  const [businessNews, setBusinessNews] = useState([]);

  useEffect(() => {
    getTrendingNews();
  }, []);

  const getTrendingNews = async () => {
    try {
      const res = await fetch(
        "https://api.iotaclasses.in/api/news/popular?limit=6",
      );

      const data = await res.json();

      console.log("Trending News API:", data);

      if (data.status && Array.isArray(data.data)) {
        const news = data.data
          .filter((item) => Number(item.videoType) === 2)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6);

        setBusinessNews(news);
      }
    } catch (error) {
      console.error("Trending News Error:", error);
    }
  };

  if (!businessNews.length) return null;

  return (
    <div className="business3 padding20 white_bg border-radious5">
      {/* HEADING */}
      <h4 className="widget-title">Trending News</h4>

      {/* NEWS LIST */}
      {businessNews.map((item, i) => {
        const newsUrl = `/news/${item.slug}`;

        const image = item.thumbnail
          ? `https://api.iotaclasses.in/uploads/images/${item.thumbnail}`
          : "";

        const category = item.categories?.[0];

        return (
          <div key={item._id} className="single_post post_type12 type20">
            {/* IMAGE */}
            <div className="post_img border-radious5">
              <div className="img_wrap">
                <Link to={newsUrl}>
                  {image && (
                    <img
                      src={image}
                      alt={item.title}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </Link>
              </div>

              {/* TRENDING ICON */}
              <span className="tranding border_tranding">
                <FontAwesome name="bolt" />
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

              {/* DATE + SHARE */}
              <div className="row">
                <div className="col-6 align-self-center">
                  <div className="meta_col">
                    <p>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="col-6 text-right align-self-center">
                  <ul className="meta_share inline">
                    {/* BOOKMARK */}
                    <li>
                      <Link to={newsUrl}>
                        <FontAwesome name="bookmark" />
                      </Link>
                    </li>

                    {/* SHARE */}
                    <li>
                      <Link to={newsUrl}>
                        <FontAwesome name="share" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* DESCRIPTION */}
              <p className="post-p">
                {item.subtitle
                  ? item.subtitle.length > 160
                    ? `${item.subtitle.substring(0, 160)}...`
                    : item.subtitle
                  : ""}
              </p>

              <div className="space-10" />

              {/* CATEGORY */}
              {category && (
                <div className="meta_col">
                  <p>{category.name}</p>
                </div>
              )}

              {/* READ MORE */}
              <Link to={newsUrl} className="readmore3">
                Read more <img src={arrow3} alt="arrow3" />
              </Link>

              {/* SEPARATOR */}
              {i + 1 < businessNews.length && (
                <>
                  <div className="space-10" />
                  <div className="border_black" />
                  <div className="space-15" />
                </>
              )}
            </div>
          </div>
        );
      })}

      {/* SHOW MORE */}
      <Link to="/category/trending" className="showmore">
        Show more
      </Link>
    </div>
  );
};

export default BusinessNewsTwo;
