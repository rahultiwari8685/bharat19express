// import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";
// import { Link } from "react-router-dom";

// const BannerSection = ({ className }) => {
//   const [banner, setBanner] = useState(null);

//   useEffect(() => {
//     getBanner();
//   }, []);

//   const getBanner = async () => {
//     try {
//       const res = await fetch("https://api.iotaclasses.in/api/advertisements");

//       const result = await res.json();

//       if (result.success) {
//         // Homepage Top Advertisement
//         const homeTop = result.data
//           .filter(
//             (item) => item.position === "homepage_top" && item.status === true,
//           )
//           .sort((a, b) => a.priority - b.priority)[0];

//         setBanner(homeTop);
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   if (!banner) return null;

//   return (
//     <div className={`${className ? className : "padding10 mb10 fourth_bg"}`}>
//       <div className="container">
//         <div className="row">
//           <div className="col-lg-8 m-auto">
//             <div className="banner1">
//               <Link
//                 to={banner.redirectUrl || "#"}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <img
//                   src={`https://api.iotaclasses.in/uploads/advertisements/${banner.image}`}
//                   alt={banner.title}
//                   className="img-fluid"
//                 />
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// BannerSection.propTypes = {
//   className: PropTypes.string,
// };

// export default BannerSection;

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const BannerSection = ({ className }) => {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    getBanner();
  }, []);

  const getBanner = async () => {
    try {
      const res = await fetch("https://api.iotaclasses.in/api/advertisements");

      const result = await res.json();

      if (result.success) {
        const homeTop = result.data
          .filter(
            (item) => item.position === "homepage_top" && item.status === true,
          )
          .sort((a, b) => a.priority - b.priority)[0];

        setBanner(homeTop);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (!banner) return null;

  return (
    <div
      className={className || "padding10 mb10 fourth_bg"}
      style={{
        width: "100%",
        padding: 0,
        margin: 0,
      }}
    >
      <div
        style={{
          width: "100%",
          margin: 0,
          padding: 0,
        }}
      >
        <Link
          to={banner.redirectUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            width: "100%",
          }}
        >
          <img
            src={`https://api.iotaclasses.in/uploads/advertisements/${banner.image}`}
            alt={banner.title}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
            }}
          />
        </Link>
      </div>
    </div>
  );
};

BannerSection.propTypes = {
  className: PropTypes.string,
};

export default BannerSection;
