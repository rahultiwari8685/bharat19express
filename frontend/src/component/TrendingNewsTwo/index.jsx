// import React from "react";
// import { Link } from "react-router-dom";
// import TrendingCarousel from "../TrendingCarousel";
// import FontAwesome from "../uiStyle/FontAwesome";

// import big_img from "../../assets/img/post-news-thumb-2.png";

// const TrendingNewsTwo = () => {
//   return (
//     <div className="white_bg tranding3 padding20 border-radious5 mb30">
//       <div className="row">
//         <div className="col-12">
//           <div className="heading">
//             <h2 className="widget-title">Trending News</h2>
//           </div>
//         </div>
//       </div>
//       <div className="row">
//         <div className="col-md-6">
//           <div className="single_post post_type3 xs-mb90 post_type15">
//             <div className="post_img border-radious5">
//               <Link to="/">
//                 <img src={big_img} alt="big_img" />
//               </Link>
//               <span className="tranding border_tranding">
//                 <FontAwesome name="bolt" />
//               </span>
//             </div>
//             <div className="single_post_text">
//               <h4>
//                 <Link to="/post1">
//                   Japan’s virus puzzled the world luck running out?
//                 </Link>
//               </h4>
//               <div className="space-10" />
//               <p className="post-p">
//                 The property, complete with 30-seat screening from room, a
//                 100-seat amphitheater and a swimming pond with sandy shower…
//               </p>
//               <div className="space-20" />
//               <div className="meta3">
//                 <Link to="/">TECHNOLOGY</Link>
//                 <Link to="/">March 26, 2020</Link>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="col-md-6">
//           <TrendingCarousel />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TrendingNewsTwo;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FontAwesome from "../uiStyle/FontAwesome";
import Slider from "../Slider";

const TrendingCarousel = () => {
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    getUPNews();
  }, []);

  const getUPNews = async () => {
    try {
      const res = await fetch(
        "https://api.iotaclasses.in/api/news/category/6ab5133ae0146bb0a4a80e48?limit=10",
      );

      const data = await res.json();

      console.log("Uttar Pradesh News API:", data);

      if (data.status && Array.isArray(data.data)) {
        const upNews = data.data
          .filter((item) => Number(item.videoType) === 2)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10);

        setTrends(upNews);
      }
    } catch (error) {
      console.error("Uttar Pradesh News Error:", error);
    }
  };

  if (!trends.length) return null;

  return (
    <div className="popular_carousel multipleRowCarousel nav_style1">
      <Slider
        navigation={{
          nextEl: ".swiper-button-next16",
          prevEl: ".swiper-button-prev16",
        }}
        slidesPerView={1}
        grid={{
          rows: 6,
        }}
      >
        {trends.map((item, i) => {
          const newsUrl = `/news/${item.slug}`;

          const category = item.categories?.[0];

          const categoryUrl = category?.slug
            ? `/category/${category.slug}`
            : "#";

          const image = item.thumbnail
            ? `https://api.iotaclasses.in/uploads/images/${item.thumbnail}`
            : "";

          return (
            <div
              key={item._id}
              className={`single_post type10 type16 widgets_small ${
                i + 2 < trends.length ? "mb15" : ""
              }`}
            >
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
                          height: "80px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </Link>
                </div>
              </div>

              {/* CONTENT */}
              <div className="single_post_text">
                <h4>
                  <Link to={newsUrl}>
                    {item.title?.length > 70
                      ? `${item.title.substring(0, 70)}...`
                      : item.title}
                  </Link>
                </h4>

                <div className="meta4">
                  <Link to={categoryUrl}>
                    {category?.name || "Uttar Pradesh"}
                  </Link>
                </div>

                {i + 2 < trends.length && (
                  <>
                    <div className="space-10" />
                    <div className="border_black" />
                    <div className="space-10" />
                  </>
                )}
              </div>
            </div>
          );
        })}
      </Slider>

      {/* NAVIGATION */}
      <div className="navBtns">
        <div className="navBtn prevtBtn swiper-button-prev16">
          <FontAwesome name="angle-left" />
        </div>

        <div className="navBtn nextBtn swiper-button-next16">
          <FontAwesome name="angle-right" />
        </div>
      </div>
    </div>
  );
};

export default TrendingCarousel;
