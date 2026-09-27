// import React from "react";
// import ProtoTypes from "prop-types";
// import { Link } from "react-router-dom";
// import FontAwesome from "../uiStyle/FontAwesome";
// import { mostViewSort } from "../../utils/commonFunctions";

// // images
// import whats21 from "../../assets/img/gallery-post/1.png";
// import whats22 from "../../assets/img/gallery-post/2.png";
// import whats23 from "../../assets/img/gallery-post/3.png";
// import whats24 from "../../assets/img/gallery-post/4.png";
// import whats25 from "../../assets/img/gallery-post/5.png";
// import Slider from "../Slider";

// const posts = [
//   {
//     image: whats21,
//     category: "TECHNOLOGY",
//     title: "Copa: Luis Suarez from devastated US",
//   },
//   {
//     image: whats22,
//     category: "TECHNOLOGY",
//     title: "Copa: Luis Suarez from devastated US",
//   },
//   {
//     image: whats23,
//     category: "TECHNOLOGY",
//     title: "Copa: Luis Suarez from devastated US",
//   },
//   {
//     image: whats24,
//     category: "TECHNOLOGY",
//     title: "Copa: Luis Suarez from devastated US",
//   },
//   {
//     image: whats25,
//     category: "TECHNOLOGY",
//     title: "Copa: Luis Suarez from devastated US",
//   },
//   {
//     image: whats21,
//     category: "TECHNOLOGY",
//     title: "Copa: Luis Suarez from devastated US",
//   },
//   {
//     image: whats22,
//     category: "TECHNOLOGY",
//     title: "Copa: Luis Suarez from devastated US",
//   },
//   {
//     image: whats23,
//     category: "TECHNOLOGY",
//     title: "Copa: Luis Suarez from devastated US",
//   },
//   {
//     image: whats24,
//     category: "TECHNOLOGY",
//     title: "Copa: Luis Suarez from devastated US",
//   },
//   {
//     image: whats25,
//     category: "TECHNOLOGY",
//     title: "Copa: Luis Suarez from devastated US",
//   },
//   {
//     image: whats21,
//     category: "TECHNOLOGY",
//     title: "Copa: Luis Suarez from devastated US",
//   },
//   {
//     image: whats22,
//     category: "TECHNOLOGY",
//     title: "Copa: Luis Suarez from devastated US",
//   },
//   {
//     image: whats23,
//     category: "TECHNOLOGY",
//     title: "Copa: Luis Suarez from devastated US",
//   },
//   {
//     image: whats24,
//     category: "TECHNOLOGY",
//     title: "Copa: Luis Suarez from devastated US",
//   },
//   {
//     image: whats25,
//     category: "TECHNOLOGY",
//     title: "Copa: Luis Suarez from devastated US",
//   },
// ];

// const Whatsnew = ({ className, title }) => {
//   return (
//     <div
//       className={`${
//         className ? className : "white_bg padding20 border-radious5 sm-mt30"
//       }`}
//     >
//       <h2 className="widget-title">{title}</h2>
//       <div className="popular_carousel multipleRowCarousel nav_style1">
//         {/*CAROUSEL START*/}
//         <Slider
//           navigation={{
//             nextEl: ".swiper-button-next18",
//             prevEl: ".swiper-button-prev18",
//           }}
//           autoplay={{
//             delay: 2500,
//             disableOnInteraction: false,
//           }}
//           slidesPerView={1}
//           grid={{
//             rows: 6,
//           }}
//           loop={true}
//         >
//           {mostViewSort(posts).map((item, i) => (
//             <div key={i} className="single_post type10 type16 widgets_small">
//               <div className="post_img">
//                 <div className="img_wrap">
//                   <Link to="/">
//                     <img src={item.image} alt="thubm" />
//                   </Link>
//                 </div>
//               </div>
//               <div className="single_post_text">
//                 <h4>
//                   <Link to="/post1">{item.title}</Link>
//                 </h4>
//                 <div className="meta4">
//                   <Link to="/">{item.category}</Link>
//                 </div>
//                 {i + 1 < posts.length ? (
//                   <>
//                     <div className="space-5" />
//                     <div className="border_black" />
//                     <div className="space-15" />
//                   </>
//                 ) : null}
//               </div>
//             </div>
//           ))}
//         </Slider>
//         <div className="navBtns">
//           <div className="navBtn prevtBtn swiper-button-prev18">
//             <FontAwesome name="angle-left" />
//           </div>
//           <div className="navBtn nextBtn swiper-button-next18">
//             <FontAwesome name="angle-right" />
//           </div>
//         </div>
//         {/*CAROUSEL END*/}
//       </div>
//     </div>
//   );
// };

// export default Whatsnew;

// Whatsnew.propTypes = {
//   className: ProtoTypes.string,
//   title: ProtoTypes.string,
// };

import React, { useEffect, useState } from "react";
import ProtoTypes from "prop-types";
import { Link } from "react-router-dom";
import FontAwesome from "../uiStyle/FontAwesome";
import Slider from "../Slider";

const API = "https://api.iotaclasses.in";

const Whatsnew = ({ className, title }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWhatsNew();
  }, []);

  const getWhatsNew = async () => {
    try {
      const res = await fetch(`${API}/api/news/getAllNews?limit=15`);
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
          .slice(0, 15);

        setPosts(news);
      }
    } catch (error) {
      console.error("WhatsNew API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${
        className ? className : "white_bg padding20 border-radious5 sm-mt30"
      }`}
    >
      <h2 className="widget-title">{title || "What's New"}</h2>

      <div className="popular_carousel multipleRowCarousel nav_style1">
        {/* CAROUSEL START */}

        {loading ? (
          <div className="text-center py-3">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-3">No news available</div>
        ) : (
          <Slider
            navigation={{
              nextEl: ".swiper-button-next18",
              prevEl: ".swiper-button-prev18",
            }}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            slidesPerView={1}
            grid={{
              rows: 6,
            }}
            loop={posts.length > 6}
          >
            {posts.map((item, i) => {
              const image = item.thumbnail
                ? `${API}/uploads/images/${item.thumbnail}`
                : "";

              const newsUrl = `/news/${item.slug}`;

              const category = item.categories?.[0];

              const categoryUrl = category?.slug
                ? `/category/${category.slug}`
                : "#";

              return (
                <div
                  key={item._id || i}
                  className="single_post type10 type16 widgets_small"
                >
                  {/* IMAGE */}
                  <div className="post_img">
                    <div className="img_wrap">
                      <Link to={newsUrl}>
                        {image && (
                          <img
                            src={image}
                            alt={item.title || "News"}
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
                      <Link to={categoryUrl}>{category?.name || "News"}</Link>
                    </div>

                    {/* SEPARATOR */}
                    {i + 1 < posts.length && (
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
          </Slider>
        )}

        {/* NAVIGATION */}
        {posts.length > 0 && (
          <div className="navBtns">
            <div className="navBtn prevtBtn swiper-button-prev18">
              <FontAwesome name="angle-left" />
            </div>

            <div className="navBtn nextBtn swiper-button-next18">
              <FontAwesome name="angle-right" />
            </div>
          </div>
        )}

        {/* CAROUSEL END */}
      </div>
    </div>
  );
};

Whatsnew.propTypes = {
  className: ProtoTypes.string,
  title: ProtoTypes.string,
};

export default Whatsnew;
