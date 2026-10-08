import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

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
          .sort((a, b) => (a.priority || 0) - (b.priority || 0))[0];

        setBanner(homeTop || null);
      }
    } catch (err) {
      console.error("Advertisement Error:", err);
      setBanner(null);
    }
  };

  if (!banner) return null;

  return (
    <div className={className || ""}>
      <div className="container">
        <div
          className="row"
          style={{
            marginLeft: 0,
            marginRight: 0,
          }}
        >
          <div
            className="col-12"
            style={{
              paddingLeft: 0,
              paddingRight: 0,
            }}
          >
            <div
              className="banner1"
              style={{
                width: "100%",
                maxWidth: "100%",
                margin: "0 0 30px 0",
                padding: 0,
              }}
            >
              <a
                href={banner.redirectUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  width: "100%",
                  margin: 0,
                  padding: 0,
                }}
              >
                <img
                  src={`https://api.iotaclasses.in/uploads/advertisements/${banner.image}`}
                  alt={banner.title || "Advertisement"}
                  style={{
                    width: "100%",
                    maxWidth: "100%",
                    height: "100px",
                    objectFit: "cover",
                    display: "block",
                    margin: 0,
                    padding: 0,
                  }}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

BannerSection.propTypes = {
  className: PropTypes.string,
};

export default BannerSection;
