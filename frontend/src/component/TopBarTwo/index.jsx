// import React from "react";
// import { Link } from "react-router-dom";
// import FontAwesome from "../uiStyle/FontAwesome";
// import Slider from "../Slider";

// const TopBarTwo = () => {
//   return (
//     <div className="topbar white_bg" id="top">
//       <div className="container">
//         <div className="row">
//           <div className="col-md-8 align-self-center">
//             <div className="trancarousel_area" style={{ display: "flex" }}>
//               <p className="trand">Tranding</p>
//               <div className="trancarousel nav_style1" style={{ width: "80%" }}>
//                 <Slider
//                   navigation={{
//                     nextEl: ".swiper-button-next15",
//                     prevEl: ".swiper-button-prev15",
//                   }}
//                   className="trancarousel"
//                   slidesPerView={1}
//                   loop={true}
//                   autoplay={{
//                     delay: 2500,
//                     disableOnInteraction: false,
//                   }}
//                 >
//                   <div className="trancarousel_item">
//                     <p>
//                       <Link to="/">
//                         Top 10 Best Movies of 2018 So Far: Great Movies To Watch
//                         Now
//                       </Link>
//                     </p>
//                   </div>
//                   <div className="trancarousel_item">
//                     <p>
//                       <Link to="/">
//                         Top 10 Best Movies of 2018 So Far: Great Movies To Watch
//                         Now
//                       </Link>
//                     </p>
//                   </div>
//                   <div className="trancarousel_item">
//                     <p>
//                       <Link to="/">
//                         Top 10 Best Movies of 2018 So Far: Great Movies To Watch
//                         Now
//                       </Link>
//                     </p>
//                   </div>
//                 </Slider>
//                 <div className="navBtns">
//                   <button className="navBtn prevBtn swiper-button-prev15">
//                     <FontAwesome name="angle-left" />
//                   </button>
//                   <button className="navBtn nextBtn swiper-button-next15">
//                     <FontAwesome name="angle-right" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="col-md-4 align-self-center">
//             <div className="top_date_social text-right">
//               <div className="social1">
//                 <ul className="inline">
//                   <li>
//                     <Link to="/">
//                       <FontAwesome name="twitter" />
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="/">
//                       <FontAwesome name="facebook-f" />
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="/">
//                       <FontAwesome name="youtube-play" />
//                     </Link>
//                   </li>
//                   <li>
//                     <Link to="/">
//                       <FontAwesome name="instagram" />
//                     </Link>
//                   </li>
//                 </ul>
//               </div>
//               <div className="user3">
//                 <FontAwesome name="user-circle" />
//               </div>
//               <div className="lang-3">
//                 <Link to="#">
//                   English <FontAwesome name="angle-down" />
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TopBarTwo;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FontAwesome from "../uiStyle/FontAwesome";
import Slider from "../Slider";

const TopBarTwo = () => {
  const API = "https://api.iotaclasses.in";

  const [trendingNews, setTrendingNews] = useState([]);

  useEffect(() => {
    getTrendingNews();
  }, []);

  const getTrendingNews = async () => {
    try {
      const res = await fetch(`${API}/api/news/trending?limit=10`);

      const data = await res.json();

      if (data.status) {
        setTrendingNews(data.data || []);
      }
    } catch (error) {
      console.error("Trending News Error:", error);
    }
  };

  return (
    <div className="topbar white_bg" id="top">
      <div className="container">
        <div className="row">
          {/* TRENDING NEWS */}
          <div className="col-md-8 align-self-center">
            <div className="trancarousel_area" style={{ display: "flex" }}>
              <p className="trand">Trending</p>

              <div className="trancarousel nav_style1" style={{ width: "80%" }}>
                <Slider
                  navigation={{
                    nextEl: ".swiper-button-next15",
                    prevEl: ".swiper-button-prev15",
                  }}
                  className="trancarousel"
                  slidesPerView={1}
                  loop={trendingNews.length > 1}
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                >
                  {trendingNews.map((news) => (
                    <div className="trancarousel_item" key={news._id}>
                      <p>
                        <Link
                          to={`/${news.categories?.[0]?.slug}/${news.slug}`}
                        >
                          {news.title}
                        </Link>
                      </p>
                    </div>
                  ))}
                </Slider>

                <div className="navBtns">
                  <button className="navBtn prevBtn swiper-button-prev15">
                    <FontAwesome name="angle-left" />
                  </button>

                  <button className="navBtn nextBtn swiper-button-next15">
                    <FontAwesome name="angle-right" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="col-md-4 align-self-center">
            <div className="top_date_social text-right">
              {/* SOCIAL */}
              <div className="social1">
                <ul className="inline">
                  <li>
                    <a
                      href="https://twitter.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesome name="twitter" />
                    </a>
                  </li>

                  <li>
                    <a
                      href="https://facebook.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesome name="facebook-f" />
                    </a>
                  </li>

                  <li>
                    <a
                      href="https://youtube.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesome name="youtube-play" />
                    </a>
                  </li>

                  <li>
                    <a
                      href="https://instagram.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesome name="instagram" />
                    </a>
                  </li>
                </ul>
              </div>

              {/* USER */}
              <div className="user3">
                <FontAwesome name="user-circle" />
              </div>

              {/* LANGUAGE */}
              <div className="lang-3">
                <Link to="#">
                  English <FontAwesome name="angle-down" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBarTwo;
