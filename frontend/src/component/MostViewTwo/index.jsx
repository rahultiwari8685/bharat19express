// import React from "react";
// import ProtoTypes from "prop-types";
// import { Link } from "react-router-dom";
// import FontAwesome from "../uiStyle/FontAwesome";

// // images
// import mostsm1 from "../../assets/img/most-post/most-1.jpg";
// import mostsm2 from "../../assets/img/most-post/most-2.jpg";
// import mostsm3 from "../../assets/img/most-post/most-3.jpg";
// import mostsm4 from "../../assets/img/most-post/most-4.jpg";
// import mostsm5 from "../../assets/img/most-post/most-5.jpg";
// import { mostViewSort } from "../../utils/commonFunctions";
// import Slider from "../Slider";

// const mostView = [
//   {
//     image: mostsm1,
//     category: "TECHNOLOGY",
//     date: "March 26, 2020",
//     title: "Nancy zhang a chinese busy woman and dhaka",
//   },
//   {
//     image: mostsm2,
//     category: "TECHNOLOGY",
//     date: "March 26, 2020",
//     title: "The billionaire Philan thropist read to learn",
//   },
//   {
//     image: mostsm3,
//     category: "TECHNOLOGY",
//     date: "March 26, 2020",
//     title: "Cheap smartphone sensor could help you",
//   },
//   {
//     image: mostsm4,
//     category: "TECHNOLOGY",
//     date: "March 26, 2020",
//     title: "Ratiffe to be Director of nation talent Trump",
//   },
//   {
//     image: mostsm5,
//     category: "TECHNOLOGY",
//     date: "March 26, 2020",
//     title: "Nancy zhang a chinese busy woman and dhaka",
//   },
//   {
//     image: mostsm1,
//     category: "TECHNOLOGY",
//     date: "March 26, 2020",
//     title: "The billionaire Philan thropist read to learn",
//   },
//   {
//     image: mostsm1,
//     category: "TECHNOLOGY",
//     date: "March 26, 2020",
//     title: "Nancy zhang a chinese busy woman and dhaka",
//   },
//   {
//     image: mostsm2,
//     category: "TECHNOLOGY",
//     date: "March 26, 2020",
//     title: "The billionaire Philan thropist read to learn",
//   },
//   {
//     image: mostsm3,
//     category: "TECHNOLOGY",
//     date: "March 26, 2020",
//     title: "Cheap smartphone sensor could help you",
//   },
//   {
//     image: mostsm4,
//     category: "TECHNOLOGY",
//     date: "March 26, 2020",
//     title: "Ratiffe to be Director of nation talent Trump",
//   },
// ];

// const MostViewTwo = ({ title }) => {
//   return (
//     <div className="most_widget3 padding20 white_bg border-radious5 mb30 sm-mt30">
//       <div className="heading">
//         <h2 className="widget-title">{title ? title : "Most View"}</h2>
//       </div>
//       <div className="post_type2_carousel multipleRowCarousel pt12_wrapper nav_style1">
//         {/*CAROUSEL START*/}
//         <Slider
//           navigation={{
//             nextEl: ".swiper-button-next9",
//             prevEl: ".swiper-button-prev9",
//           }}
//           slidesPerView={1}
//           grid={{
//             rows: 6,
//           }}
//         >
//           {mostViewSort(mostView).map((item, i) => (
//             <div key={i} className="single_post widgets_small type8 type17">
//               <div className="post_img">
//                 <div className="img_wrap">
//                   <Link to="/">
//                     <img src={item.image} alt="thumb" />
//                   </Link>
//                 </div>
//                 <span className="tranding tranding_border">{item.id}</span>
//               </div>
//               <div className="single_post_text">
//                 <h4>
//                   <Link to="/post1">{item.title}</Link>
//                 </h4>
//                 <div className="meta2">
//                   <Link to="/">{item.category}</Link>
//                   <Link to="/">{item.date}</Link>
//                 </div>
//                 {i + 2 < mostView.length ? (
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
//           <div className="navBtn prevtBtn swiper-button-prev9">
//             <FontAwesome name="angle-left" />
//           </div>
//           <div className="navBtn nextBtn swiper-button-next9">
//             <FontAwesome name="angle-right" />
//           </div>
//         </div>
//         {/*CAROUSEL END*/}
//       </div>
//     </div>
//   );
// };

// export default MostViewTwo;

// MostViewTwo.propTypes = {
//   title: ProtoTypes.string,
// };

import React, { useEffect, useState } from "react";
import ProtoTypes from "prop-types";
import { Link } from "react-router-dom";
import FontAwesome from "../uiStyle/FontAwesome";
import Slider from "../Slider";

const MostViewTwo = ({ title }) => {
  const [mostView, setMostView] = useState([]);

  useEffect(() => {
    getPopularNews();
  }, []);

  const getPopularNews = async () => {
    try {
      const res = await fetch(
        "https://api.iotaclasses.in/api/news/popular?limit=10",
      );

      const data = await res.json();

      console.log("Most View API:", data);

      if (data.status && Array.isArray(data.data)) {
        const videoPosts = data.data
          .filter((item) => Number(item.videoType) === 2)
          .slice(0, 10);

        setMostView(videoPosts);
      }
    } catch (error) {
      console.error("Most View Error:", error);
    }
  };

  if (!mostView.length) return null;

  return (
    <div className="most_widget3 padding20 white_bg border-radious5 mb30 sm-mt30">
      {/* HEADING */}
      <div className="heading">
        <h2 className="widget-title">{title ? title : "Most View"}</h2>
      </div>

      <div className="post_type2_carousel multipleRowCarousel pt12_wrapper nav_style1">
        {/* CAROUSEL */}
        <Slider
          navigation={{
            nextEl: ".swiper-button-next9",
            prevEl: ".swiper-button-prev9",
          }}
          slidesPerView={1}
          grid={{
            rows: 6,
          }}
        >
          {mostView.map((item, index) => {
            const category = item.categories?.[0];

            const newsUrl = `/news/${item.slug}`;

            const image = item.thumbnail
              ? `https://api.iotaclasses.in/uploads/images/${item.thumbnail}`
              : "";

            return (
              <div
                key={item._id}
                className="single_post widgets_small type8 type17"
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
                            width: "90px",
                            height: "70px",
                            objectFit: "cover",
                          }}
                        />
                      )}
                    </Link>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="single_post_text">
                  {/* CATEGORY + DATE */}
                  <div className="meta2">
                    <Link
                      to={category?.slug ? `/category/${category.slug}` : "#"}
                    >
                      {category?.name || "News"}
                    </Link>

                    <Link to={newsUrl}>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : ""}
                    </Link>
                  </div>

                  {/* TITLE */}
                  <h4>
                    <Link to={newsUrl}>
                      {item.title?.length > 70
                        ? `${item.title.substring(0, 70)}...`
                        : item.title}
                    </Link>
                  </h4>
                </div>

                {/* NUMBER */}
                <div className="type8_count">
                  <h2>{index + 1}</h2>
                </div>

                {/* SEPARATOR */}
                {index + 1 < mostView.length && (
                  <>
                    <div className="space-15" />
                    <div className="border_black" />
                    <div className="space-15" />
                  </>
                )}
              </div>
            );
          })}
        </Slider>

        {/* NAVIGATION */}
        <div className="navBtns">
          <div className="navBtn prevtBtn swiper-button-prev9">
            <FontAwesome name="angle-left" />
          </div>

          <div className="navBtn nextBtn swiper-button-next9">
            <FontAwesome name="angle-right" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MostViewTwo;

MostViewTwo.propTypes = {
  title: ProtoTypes.string,
};
