import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const LogoArea = ({ className, dark }) => {
  const [banner, setBanner] = useState(null);
  const [siteSetting, setSiteSetting] = useState(null);

  useEffect(() => {
    getBanner();
    getSiteSetting();
  }, []);

  const getSiteSetting = async () => {
    try {
      const res = await fetch("https://api.iotaclasses.in/api/site-settings");

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
      const res = await fetch("https://api.iotaclasses.in/api/advertisements");

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
    <div className={`logo_area ${className || ""}`}>
      <div className="container">
        <div className="row">
          <div className="col-lg-4 align-self-center">
            <div className="logo">
              <Link to="/">
                {siteSetting?.headerLogo ? (
                  <img
                    src={`https://api.iotaclasses.in/uploads/images/${siteSetting.headerLogo}`}
                    alt={siteSetting.siteName}
                    style={{
                      width: "220px",
                      height: "120px",
                      objectFit: "contain",
                    }}
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
                    src={`https://api.iotaclasses.in/uploads/advertisements/${banner.image}`}
                    alt={banner.title}
                    style={{
                      width: "728px",
                      height: "180px",
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
  );
};

LogoArea.propTypes = {
  className: PropTypes.string,
  dark: PropTypes.bool,
};

export default LogoArea;
