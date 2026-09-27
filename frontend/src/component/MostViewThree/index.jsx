// import React from "react";
// import FontAwesome from "../uiStyle/FontAwesome";
// import { Link } from "react-router-dom";

// // images
// import most26 from "../../assets/img/finance/finance-1.jpg";
// import most27 from "../../assets/img/finance/finance-2.jpg";
// import most28 from "../../assets/img/finance/finance-3.jpg";

// const posts = [
//   {
//     photo: most26,
//     date: "April 26, 2020",
//     author: "QuomodoSoft",
//     title: "Copa America: Luis Suarez from devastated US",
//     description:
//       "The property, complete with 30-seat screening from room, a 100-seat amphitheater and a swimming pond with sandy shower…",
//   },
//   {
//     photo: most27,
//     date: "April 26, 2020",
//     author: "QuomodoSoft",
//     title: "Copa America: Luis Suarez from devastated US",
//     description:
//       "The property, complete with 30-seat screening from room, a 100-seat amphitheater and a swimming pond with sandy shower…",
//   },
//   {
//     photo: most28,
//     date: "April 26, 2020",
//     author: "QuomodoSoft",
//     title: "Copa America: Luis Suarez from devastated US",
//     description:
//       "The property, complete with 30-seat screening from room, a 100-seat amphitheater and a swimming pond with sandy shower…",
//   },
// ];
// const MostViewThree = () => {
//   return (
//     <div className="most_view3 white_bg padding20 border-radiuos5">
//       <h3 className="widget-title">Most Share</h3>
//       {posts.map((item, i) => (
//         <div key={i}>
//           <div key={i} className="single_post type18">
//             <div className="post_img">
//               <div className="img_wrap">
//                 <Link to="/">
//                   <img src={item.photo} alt="thumb" />
//                 </Link>
//               </div>
//               <span className="batch3 date">{item.date}</span>
//             </div>
//             <div className="single_post_text">
//               <h4>
//                 <Link to="/post1">{item.title}</Link>
//               </h4>
//               <div className="space-10" />
//               <p className="post-p">{item.description}</p>
//               <div className="view_author_details">
//                 <div className="space-10" />
//                 <div className="row">
//                   <div className="col-6">
//                     <div className="view_author align-self-center">
//                       <FontAwesome name="user-circle mr-1" />
//                       <Link to="/">{item.author}</Link>
//                     </div>
//                   </div>
//                   <div className="col-6 text-right align-self-center">
//                     <p>{item.date}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {i + 1 < posts.length ? (
//             <>
//               <div className="space-20" />
//               <div className="border_black" />
//               <div className="space-20" />
//             </>
//           ) : null}
//         </div>
//       ))}
//       <div className="space-20" />
//       <Link to="/" className="showmore">
//         Show more
//       </Link>
//     </div>
//   );
// };

// export default MostViewThree;

import React, { useEffect, useState } from "react";
import FontAwesome from "../uiStyle/FontAwesome";
import { Link } from "react-router-dom";

const API = "https://api.iotaclasses.in";

const MostViewThree = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMostView();
  }, []);

  // const fetchMostView = async () => {
  //   try {
  //     const res = await fetch(`${API}/api/news/most-shared?limit=10`);
  //     const data = await res.json();

  //     if (data.status && Array.isArray(data.data)) {
  //       const news = data.data
  //         // Published news
  //         .filter((item) => Number(item.type) === 1)
  //         // Latest first
  //         .sort(
  //           (a, b) =>
  //             new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  //         )
  //         .slice(0, 3);

  //       setPosts(news);
  //     }
  //   } catch (error) {
  //     console.error("MostViewThree API Error:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchMostView = async () => {
    try {
      const res = await fetch(`${API}/api/news/most-shared?limit=10`);
      const data = await res.json();

      if (data.status && Array.isArray(data.data)) {
        const news = data.data
          // Published news + only text news
          .filter(
            (item) => Number(item.type) === 1 && Number(item.videoType) === 2,
          )
          // Latest first
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          .slice(0, 3);

        setPosts(news);
      }
    } catch (error) {
      console.error("MostViewThree API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Date formatter
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
      <div className="most_view3 white_bg padding20 border-radiuos5">
        <h3 className="widget-title">Most Share</h3>

        <div className="text-center py-3">Loading...</div>
      </div>
    );
  }

  return (
    <div className="most_view3 white_bg padding20 border-radiuos5">
      <h3 className="widget-title">Most Share</h3>

      {posts.length === 0 ? (
        <div className="text-center py-3">No news available</div>
      ) : (
        posts.map((item, i) => {
          const image = item.thumbnail
            ? `${API}/uploads/images/${item.thumbnail}`
            : "";

          const newsUrl = `/news/${item.slug}`;

          const category = item.categories?.[0];

          return (
            <div key={item._id || i}>
              <div className="single_post type18">
                {/* IMAGE */}
                <div className="post_img">
                  <div className="img_wrap">
                    <Link to={newsUrl}>
                      {image && <img src={image} alt={item.title || "News"} />}
                    </Link>
                  </div>

                  {/* DATE */}
                  <span className="batch3 date">
                    {formatDate(item.createdAt)}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="single_post_text">
                  {/* TITLE */}
                  <h4>
                    <Link to={newsUrl}>{item.title}</Link>
                  </h4>

                  <div className="space-10" />

                  {/* DESCRIPTION */}
                  <p className="post-p">
                    {item.description
                      ? item.description.length > 150
                        ? `${item.description.substring(0, 150)}...`
                        : item.description
                      : item.shortDescription
                        ? item.shortDescription.length > 150
                          ? `${item.shortDescription.substring(0, 150)}...`
                          : item.shortDescription
                        : "Read the latest news and updates."}
                  </p>

                  {/* AUTHOR / DATE */}
                  <div className="view_author_details">
                    <div className="space-10" />

                    <div className="row">
                      {/* AUTHOR */}
                      <div className="col-6">
                        <div className="view_author align-self-center">
                          <FontAwesome name="user-circle mr-1" />

                          <Link to={newsUrl}>
                            {item.author?.name ||
                              item.authorName ||
                              item.createdBy?.name ||
                              "Bharat TV Media"}
                          </Link>
                        </div>
                      </div>

                      {/* DATE */}
                      <div className="col-6 text-right align-self-center">
                        <p>{formatDate(item.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SEPARATOR */}
              {i + 1 < posts.length && (
                <>
                  <div className="space-20" />
                  <div className="border_black" />
                  <div className="space-20" />
                </>
              )}
            </div>
          );
        })
      )}

      <div className="space-20" />

      {/* SHOW MORE */}
      <Link to="/news" className="showmore">
        Show more
      </Link>
    </div>
  );
};

export default MostViewThree;
