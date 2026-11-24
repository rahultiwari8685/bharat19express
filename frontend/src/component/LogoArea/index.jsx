import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";


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

//   @media (max-width: 767px) {
//     .logo_area {
//       padding: 15px 0 !important;
//     }

//     .logo_area .container > .row {
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//     }

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


const logoAreaResponsiveCSS = `
  .logo_area {
    width: 100%;
    padding: 10px 0 !important;
  }

  .logo_area .container {
    width: 100%;
    max-width: 100%;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .logo_area .row {
    margin-left: 0 !important;
    margin-right: 0 !important;
    --bs-gutter-x: 0 !important;
    align-items: center;
  }

  .logo_area .col-lg-4,
  .logo_area .col-lg-8 {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .logo_area .logo {
    width: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  .logo_area .logo a {
    display: block;
    width: 100%;
  }

  .logo_area .logo img {
    display: block;
    width: 100% !important;
    max-width: 100% !important;
    height: 100px !important;
    object-fit: cover !important;
    object-position: center;
  }

  .logo_area .banner1 {
    width: 100%;
    margin: 0;
    padding: 0;
  }

  .logo_area .banner1 a {
    display: block;
    width: 100%;
  }

  .logo_area .banner1 img {
    display: block;
    width: 100% !important;
    max-width: 100% !important;
    height: 100px !important;
    object-fit: fill;
  }

  @media (max-width: 767px) {
    .logo_area {
      padding: 10px 0 !important;
    }

    .logo_area .container > .row {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .logo_area .col-lg-4,
    .logo_area .col-lg-8 {
      width: 100%;
      max-width: 100%;
    }

    .logo_area .logo {
      text-align: center;
    }

    .logo_area .logo img {
      width: 100% !important;
      height: auto !important;
      max-height: 110px;
      object-fit: contain !important;
    }

    .logo_area .banner1 {
      margin-top: 10px;
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
        "https://api.bharat19express.com/api/site-settings",
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
        "https://api.bharat19express.com/api/advertisements",
      );

      const result = await res.json();

      if (result.success) {
        const ad = result.data
          .filter(
            (item) => item.position === "homepage_top" && item.status === true,
          )
          .sort((a, b) => a.priority - b.priority)[0];

        setBanner(ad);
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
          <div className="row">
           <div className="col-lg-4 align-self-center">
  <div className="logo" style={{ width: "100%" }}>
             
                <Link to="/">
                  {siteSetting?.headerLogo ? (
                    // <img
                    //   src={`https://api.bharat19express.com/uploads/images/${siteSetting.headerLogo}`}
                    //   alt={siteSetting.siteName}
                    //   style={{
                    //     width: "400px",
                    //     height: "85px",
                    //     objectFit: "contain",
                    //   }}
                    // />

                    // <img
                    //   src={`https://api.bharat19express.com/uploads/images/${siteSetting.headerLogo}`}
                    //   alt={siteSetting.siteName}
                    //   style={{
                    //     width: "100%",
                    //     height: "85px",
                    //     objectFit: "contain",
                    //     objectPosition: "left center",
                    //     display: "block",
                    //   }}
                    // />

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

            <div className="col-lg-8 align-self-center">
              <div className="banner1">
                {banner && (
                  <a
                    href={banner.redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={`https://api.bharat19express.com/uploads/advertisements/${banner.image}`}
                      alt={banner.title}
                      style={{
                        width: "728px",
                        height: "85px",
                        objectFit: "cover",
                      }}
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
