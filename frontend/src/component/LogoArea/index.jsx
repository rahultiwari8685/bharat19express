// import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";
// import { Link } from "react-router-dom";


// const logoAreaResponsiveCSS = `
//   .logo_area .logo img {
//     max-width: 100%;
//     height: auto;
//     object-fit: contain;
//   }

//   .logo_area .banner1 img {
//     max-width: 100%;
//     height: auto;
//     object-fit: contain;
//   }

//   .logo_area,
// .logo_area .container-fluid {
//   width: 100%;
//   max-width: 100%;
// }

// .logo_area .row {
//   width: 100%;
// }

// .logo_area .container {
//   width: 100%;
//   max-width: 1080px;
//   margin: 0 auto;
//   padding-left: 0;
//   padding-right: 0;
// }

// .logo_area .row {
//   margin-left: 0;
//   margin-right: 0;
// }

// .logo_area .row > [class*="col-"] {
//   padding-left: 10px;
//   padding-right: 10px;
//   min-width: 0;
// }

// .logo_area .banner1,
// .logo_area .banner1 a {
//   width: 100%;
//   display: block;
// }

// .logo_area .banner1 img {
//   width: 100%;
//   max-width: 100%;
//   height: 85px;
//   display: block;
//   object-fit: fill;
// }

// .logo_area .banner1,
// .logo_area .banner1 a {
//   display: block;
//   width: 100%;
// }

// .logo_area .banner1 img {
//   width: 100% !important;
//   height: 85px !important;
//   object-fit: fill !important;
//   display: block;
// }

// .logo_area .banner1,
// .logo_area .banner1 a {
//   display: block;
//   width: 100%;
// }

// .logo_area .banner1 img {
//   width: 100% !important;
//   max-width: none !important;
//   height: 85px !important;
//   object-fit: fill !important;
// }

//   @media (max-width: 767px) {
//     .logo_area {
//       padding: 15px 0 !important;
//     }

//    .logo_area .container-fluid > .row {
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//     }

//     .logo_area .banner1 {
//   width: 100%;
// }

// .logo_area .banner1 a {
//   display: block;
//   width: 100%;
// }

// .logo_area .banner1 img {
//   width: 100% !important;
// }

//     .logo_area .col-lg-4,
//     .logo_area .col-lg-8 {
//       width: 100%;
//       max-width: 100%;
//       text-align: center;
//     }

//     .logo_area .logo {
//       text-align: center;
//       margin: 0 auto;
//     }

//     .logo_area .logo img {
//       width: 220px !important;
//       max-width: 90%;
//       height: 100px !important;
//     }

//     .logo_area .banner1 {
//       margin-top: 10px;
//       text-align: center;
//     }

//     .logo_area .banner1 img {
//       width: 100% !important;
//       max-width: 100%;
//       height: auto !important;
//     }
//   }
// `;

// const LogoArea = ({ className, dark }) => {
//   const [banner, setBanner] = useState(null);
//   const [siteSetting, setSiteSetting] = useState(null);

//   useEffect(() => {
//     getBanner();
//     getSiteSetting();
//   }, []);

//   const getSiteSetting = async () => {
//     try {
//       const res = await fetch(
//         "https://api.bharat19express.com/api/site-settings",
//       );

//       const result = await res.json();

//       if (result.success) {
//         setSiteSetting(result.data);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const getBanner = async () => {
//     try {
//       const res = await fetch(
//         "https://api.bharat19express.com/api/advertisements",
//       );

//       const result = await res.json();

//       if (result.success) {
//         const ad = result.data
//           .filter(
//             (item) => item.position === "homepage_top" && item.status === true,
//           )
//           .sort((a, b) => a.priority - b.priority)[0];

//         setBanner(ad);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <>
//       <style>{logoAreaResponsiveCSS}</style>

//       <div className={`logo_area ${className || ""}`}>
//         <div className="container">
//           <div className="row mx-0 align-items-center">
//             <div className="col-lg-3 col-md-4">
//               <div className="logo">
//                 <Link to="/">
//                   {siteSetting?.headerLogo ? (
//                     <img
//                       src={`https://api.bharat19express.com/uploads/images/${siteSetting.headerLogo}`}
//                       alt={siteSetting.siteName}
//                       style={{
//                         width: "100%",
//                         height: "85px",
//                         objectFit: "contain",
//                         objectPosition: "left center",
//                         display: "block",
//                       }}
//                     />
//                   ) : (
//                     <h3>Bharat 19 Express</h3>
//                   )}
//                 </Link>
//               </div>
//             </div>
//             <div className="col-lg-9 col-md-8">
//               <div className="banner1" style={{ width: "100%" }}>
//                 {banner && (
//                   <a
//                     href={banner.redirectUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     <img
//                       src={`https://api.bharat19express.com/uploads/advertisements/${banner.image}`}
//                       alt={banner.title}
//                       // style={{
//                       //   width: "728px",
//                       //   height: "85px",
//                       //   objectFit: "cover",
//                       // }}

//                       style={{
//                         width: "100%",
//                         maxWidth: "none",
//                         height: "85px",
//                         objectFit: "fill",
//                         display: "block",
//                       }}
//                     />
//                   </a>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// LogoArea.propTypes = {
//   className: PropTypes.string,
//   dark: PropTypes.bool,
// };

// export default LogoArea;



// import React, { useEffect, useState } from "react";
// import PropTypes from "prop-types";
// import { Link } from "react-router-dom";

// const API = "https://api.bharat19express.com";

// const logoAreaResponsiveCSS = `
//   .logo_area {
//     width: 100%;
//     padding: 10px 0;
//   }

//   .logo_area .container {
//     width: 100%;
//     max-width: 1200px;
//     padding-left: 0;
//     padding-right: 0;
//     margin: 0 auto;
//   }

//   .logo_area .row {
//     display: grid;
//     grid-template-columns: 28% 72%;
//     width: 100%;
//     margin: 0;
//     align-items: center;
//   }

//   .logo_area .logo-column,
//   .logo_area .banner-column {
//     width: 100%;
//     max-width: 100%;
//     padding: 0;
//     min-width: 0;
//   }

//   .logo_area .logo {
//     width: 100%;
//     margin: 0;
//   }

//   .logo_area .logo img {
//     width: 100%;
//     max-width: 100%;
//     height: 85px;
//     object-fit: contain;
//     object-position: left center;
//     display: block;
//   }

//   .logo_area .banner1,
//   .logo_area .banner1 a {
//     display: block;
//     width: 100%;
//     margin: 0;
//     padding: 0;
//   }

//   .logo_area .banner1 img {
//     display: block;
//     width: 100% !important;
//     max-width: 100% !important;
//     height: 85px !important;
//     object-fit: fill;
//   }

//   @media (max-width: 767px) {
//     .logo_area {
//       padding: 15px 0 !important;
//     }

//     .logo_area .container {
//       padding-left: 12px;
//       padding-right: 12px;
//     }

//     .logo_area .row {
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//     }

//     .logo_area .logo-column,
//     .logo_area .banner-column {
//       width: 100%;
//       max-width: 100%;
//       text-align: center;
//     }

//     .logo_area .logo {
//       text-align: center;
//       margin: 0 auto;
//     }

//     .logo_area .logo img {
//       width: 220px;
//       max-width: 90%;
//       height: 100px;
//       margin: 0 auto;
//       object-position: center;
//     }

//     .logo_area .banner1 {
//       width: 100%;
//       margin-top: 10px;
//     }

//     .logo_area .banner1 img {
//       width: 100% !important;
//       max-width: 100% !important;
//       height: auto !important;
//     }
//   }
// `;

// const LogoArea = ({ className, dark }) => {
//   const [banner, setBanner] = useState(null);
//   const [siteSetting, setSiteSetting] = useState(null);

//   useEffect(() => {
//     getBanner();
//     getSiteSetting();
//   }, []);

//   const getSiteSetting = async () => {
//     try {
//       const res = await fetch(`${API}/api/site-settings`);
//       const result = await res.json();

//       if (result.success) {
//         setSiteSetting(result.data);
//       }
//     } catch (err) {
//       console.error("Site Settings Error:", err);
//     }
//   };

//   const getBanner = async () => {
//     try {
//       const res = await fetch(`${API}/api/advertisements`);
//       const result = await res.json();

//       if (result.success && Array.isArray(result.data)) {
//         const ad = result.data
//           .filter(
//             (item) =>
//               item.position === "homepage_top" && item.status === true
//           )
//           .sort((a, b) => a.priority - b.priority)[0];

//         setBanner(ad || null);
//       }
//     } catch (err) {
//       console.error("Advertisement Error:", err);
//     }
//   };

//   return (
//     <>
//       <style>{logoAreaResponsiveCSS}</style>

//       <div className={`logo_area ${className || ""}`}>
//         <div className="container">
//           <div className="row">
//             {/* WEBSITE LOGO */}
//             <div className="logo-column">
//               <div className="logo">
//                 <Link to="/">
//                   {siteSetting?.headerLogo ? (
//                     <img
//                       src={`${API}/uploads/images/${siteSetting.headerLogo}`}
//                       alt={siteSetting.siteName || "Bharat 19 Express"}
//                     />
//                   ) : (
//                     <h3>Bharat 19 Express</h3>
//                   )}
//                 </Link>
//               </div>
//             </div>

//             {/* TOP ADVERTISEMENT */}
//             <div className="banner-column">
//               <div className="banner1">
//                 {banner && (
//                   <a
//                     href={banner.redirectUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                   >
//                     <img
//                       src={`${API}/uploads/advertisements/${banner.image}`}
//                       alt={banner.title || "Advertisement"}
//                     />
//                   </a>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// LogoArea.propTypes = {
//   className: PropTypes.string,
//   dark: PropTypes.bool,
// };

// export default LogoArea;



import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const logoAreaResponsiveCSS = `
  .logo_area {
    width: 100%;
    padding: 10px 0;
  }

  .logo_area .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding-left: 12px;
    padding-right: 12px;
  }

  .logo_area .row {
    display: flex;
    align-items: center;
    margin-left: 0;
    margin-right: 0;
  }

  .logo_area .row > [class*="col-"] {
    padding-left: 8px;
    padding-right: 8px;
  }

  .logo_area .logo {
    width: 100%;
  }

  .logo_area .logo a {
    display: block;
    width: 100%;
  }

  .logo_area .logo img {
    display: block;
    width: 100% !important;
    max-width: 100%;
    height: 110px !important;
    object-fit: contain;
    object-position: center;
  }

  .logo_area .banner1,
  .logo_area .banner1 a {
    display: block;
    width: 100%;
  }

  .logo_area .banner1 img {
    display: block;
    width: 100% !important;
    max-width: 100%;
    height: 110px !important;
    object-fit: fill;
  }

  @media (max-width: 767px) {
    .logo_area {
      padding: 12px 0 !important;
    }

    .logo_area .row {
      flex-direction: column;
      gap: 12px;
    }

    .logo_area .col-lg-4,
    .logo_area .col-lg-8 {
      width: 100%;
      max-width: 100%;
      flex: 0 0 100%;
    }

    .logo_area .logo {
      text-align: center;
    }

    .logo_area .logo img {
      width: 260px !important;
      max-width: 90%;
      height: 90px !important;
      margin: 0 auto;
    }

    .logo_area .banner1 img {
      width: 100% !important;
      height: auto !important;
      object-fit: contain;
    }
  }
`;

const LogoArea = ({ className, dark }) => {
  const [banner, setBanner] = useState(null);
  const [siteSetting, setSiteSetting] = useState(null);

  useEffect(() => {
    getBanner();
    getSiteSetting();
  }, []);

  const getSiteSetting = async () => {
    try {
      const res = await fetch(
        "https://api.bharat19express.com/api/site-settings"
      );

      const result = await res.json();

      if (result.success) {
        setSiteSetting(result.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getBanner = async () => {
    try {
      const res = await fetch(
        "https://api.bharat19express.com/api/advertisements"
      );

      const result = await res.json();

      if (result.success) {
        const ad = result.data
          .filter(
            (item) =>
              item.position === "homepage_top" &&
              item.status === true
          )
          .sort((a, b) => a.priority - b.priority)[0];

        setBanner(ad || null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <style>{logoAreaResponsiveCSS}</style>

      <div className={`logo_area ${className || ""}`}>
        <div className="container">
          <div className="row align-items-center">

            {/* LOGO - 4 COLUMNS */}
            <div className="col-lg-4 col-md-4">
              <div className="logo">
                <Link to="/">
                  {siteSetting?.headerLogo ? (
                    <img
                      src={`https://api.bharat19express.com/uploads/images/${siteSetting.headerLogo}`}
                      alt={siteSetting.siteName || "Bharat 19 Express"}
                    />
                  ) : (
                    <h3>Bharat 19 Express</h3>
                  )}
                </Link>
              </div>
            </div>

            {/* ADVERTISEMENT - 8 COLUMNS */}
            <div className="col-lg-8 col-md-8">
              <div className="banner1">
                {banner && (
                  <a
                    href={banner.redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={`https://api.bharat19express.com/uploads/advertisements/${banner.image}`}
                      alt={banner.title || "Advertisement"}
                    />
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

LogoArea.propTypes = {
  className: PropTypes.string,
  dark: PropTypes.bool,
};

export default LogoArea;

