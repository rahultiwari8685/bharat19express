// import React from "react";
// import { Link } from "react-router-dom";
// import FontAwesome from "../uiStyle/FontAwesome";

// // images
// import trends1 from "../../assets/img/gallery-post/1.png";
// import trends2 from "../../assets/img/gallery-post/2.png";
// import trends3 from "../../assets/img/gallery-post/3.png";
// import trends4 from "../../assets/img/gallery-post/4.png";
// import trends5 from "../../assets/img/gallery-post/5.png";

// import { mostViewSort } from "../../utils/commonFunctions";
// import Slider from "../Slider";

// const trends = [
//   {
//     image: trends1,
//     category: "TECHNOLOGY",
//     date: "March 26, 2020",
//     title: "Copa America: Luis Suarez from devastated US",
//   },
//   {
//     image: trends2,
//     category: "TECHNOLOGY",
//     date: "March 26, 2020",
//     title: "Copa America: Luis Suarez from devastated US",
//   },
//   {
//     image: trends3,
//     category: "TECHNOLOGY",
//     date: "March 26, 2020",
//     title: "Copa America: Luis Suarez from devastated US",
//   },
//   {
//     image: trends4,
//     category: "TECHNOLOGY",
//     date: "March 26, 2020",
//     title: "Copa America: Luis Suarez from devastated US",
//   },
//   {
//     image: trends5,
//     category: "TECHNOLOGY",
//     date: "March 26, 2020",
//     title: "Copa America: Luis Suarez from devastated US",
//   },
//   {
//     image: trends1,
//     category: "TECHNOLOGY",
//     date: "March 26, 2020",
//     title: "Copa America: Luis Suarez from devastated US",
//   },
//   {
//     image: trends2,
//     category: "TECHNOLOGY",
//     date: "March 26, 2020",
//     title: "Copa America: Luis Suarez from devastated US",
//   },
//   {
//     image: trends3,
//     category: "TECHNOLOGY",
//     date: "March 26, 2020",
//     title: "Copa America: Luis Suarez from devastated US",
//   },
//   {
//     image: trends4,
//     category: "TECHNOLOGY",
//     date: "March 26, 2020",
//     title: "Copa America: Luis Suarez from devastated US",
//   },
//   {
//     image: trends5,
//     category: "TECHNOLOGY",
//     date: "March 26, 2020",
//     title: "Copa America: Luis Suarez from devastated US",
//   },
// ];

// const TrendingCarousel = () => {
//   return (
//     <div className="popular_carousel multipleRowCarousel nav_style1">
//       <Slider
//         navigation={{
//           nextEl: ".swiper-button-next16",
//           prevEl: ".swiper-button-prev16",
//         }}
//         slidesPerView={1}
//         grid={{
//           rows: 6,
//         }}
//       >
//         {mostViewSort(trends).map((item, i) => (
//           <div
//             key={i}
//             className={`single_post type10 type16 widgets_small ${
//               i + 2 < trends.length ? "mb15" : ""
//             }`}
//           >
//             <div className="post_img">
//               <div className="img_wrap">
//                 <Link to="/">
//                   <img src={item.image} alt="thumb" />
//                 </Link>
//               </div>
//             </div>
//             <div className="single_post_text">
//               <h4>
//                 <Link to="/post1">{item.title}</Link>
//               </h4>
//               <div className="meta4">
//                 <Link to="/">{item.category}</Link>
//               </div>
//               {i + 2 < trends.length ? (
//                 <>
//                   <div className="space-10" />
//                   <div className="border_black" />
//                   <div className="space-10" />
//                 </>
//               ) : (
//                 ""
//               )}
//             </div>
//           </div>
//         ))}
//       </Slider>
//       <div className="navBtns">
//         <div className="navBtn prevtBtn swiper-button-prev16">
//           <FontAwesome name="angle-left" />
//         </div>
//         <div className="navBtn nextBtn swiper-button-next16">
//           <FontAwesome name="angle-right" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TrendingCarousel;

import React from "react";
import ProtoTypes from "prop-types";
import { Link } from "react-router-dom";
import FontAwesome from "../uiStyle/FontAwesome";
import Slider from "../Slider";

const TrendingCarousel = ({ news = [] }) => {
  if (!news.length) return null;

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
        {news.map((item, i) => {
          const newsUrl = `/news/${item.slug}`;

          const category = item.categories?.[0];

          const image = item.thumbnail
            ? `https://api.iotaclasses.in/uploads/images/${item.thumbnail}`
            : "";

          return (
            <div
              key={item._id}
              className={`single_post type10 type16 widgets_small ${
                i + 2 < news.length ? "mb15" : ""
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
                  <Link
                    to={category?.slug ? `/category/${category.slug}` : "#"}
                  >
                    {category?.name || "Uttar Pradesh"}
                  </Link>
                </div>

                {i + 2 < news.length && (
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

TrendingCarousel.propTypes = {
  news: ProtoTypes.array,
};

export default TrendingCarousel;
