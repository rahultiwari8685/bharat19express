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

        setBanner(homeTop);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (!banner) return null;

  return (
    <div className={className || ""}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="banner1">
              <a
                href={banner.redirectUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block",
                  width: "100%",
                }}
              >
                <img
                  src={`https://api.iotaclasses.in/uploads/advertisements/${banner.image}`}
                  alt={banner.title || "Advertisement"}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    display: "block",
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
