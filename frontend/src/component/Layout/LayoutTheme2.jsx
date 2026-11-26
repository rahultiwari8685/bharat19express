// import React from "react";
// import ProtoTypes from "prop-types";
// import { Outlet } from "react-router-dom";
// import TopBarTwo from "../../component/TopBarTwo";
// import LogoAreaTwo from "../../component/LogoAreaTwo";
// import MainMenuTwo from "../../component/MainMenuTwo";
// import FooterAreaTwo from "../../component/FooterAreaTwo";
// import ScrollTopButton from "../ScrollTopButton";
// import LogoArea from "../LogoArea";
// import BreakingNews from "../BreakingNews";

// const LayoutTheme2 = ({ children }) => {
//   return (
//     <div className="theme-3 theme3_bg">
//       <ScrollTopButton />
//       <TopBarTwo />
//       <div className="border_black" />
//       <LogoArea />
//       <MainMenuTwo />
//       <BreakingNews />
//       <Outlet />
//       {children}
//       <FooterAreaTwo />
//     </div>
//   );
// };
// export default LayoutTheme2;

// LayoutTheme2.propTypes = {
//   children: ProtoTypes.node,
// };




import React, { useEffect, useState } from "react";
import ProtoTypes from "prop-types";
import { Outlet } from "react-router-dom";
import SidebarAds from "../../component/SidebarAds";
import TopBarTwo from "../../component/TopBarTwo";
import LogoAreaTwo from "../../component/LogoAreaTwo";
import MainMenuTwo from "../../component/MainMenuTwo";
import FooterAreaTwo from "../../component/FooterAreaTwo";
import ScrollTopButton from "../ScrollTopButton";
import LogoArea from "../LogoArea";
import BreakingNews from "../BreakingNews";

const API_URL = "https://api.bharat19express.com";

// Update this path if your backend uses a different image folder.
const IMAGE_BASE_URL = `${API_URL}/uploads/advertisements/`;

const LayoutTheme2 = ({ children }) => {
  const [sidebarAd, setSidebarAd] = useState(null);


  useEffect(() => {
    const fetchSidebarAd = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/advertisements`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch advertisements");
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          const ads = result.data
            .filter(
              (ad) =>
                ad.status === true &&
                ad.position === "homepage_top" &&
                ad.type === "image" &&
                ad.image
            )
            .sort(
              (a, b) =>
                Number(a.priority || 0) -
                Number(b.priority || 0)
            );

          setSidebarAd(ads[0] || null);
        }
      } catch (error) {
        console.error("Sidebar Ad Error:", error);
        setSidebarAd(null);
      }
    };

    fetchSidebarAd();
  }, []);

  // Advertisement Image URL
  const getAdImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `${IMAGE_BASE_URL}${image}`;
  };

  // Sidebar Ad Component
  const SidebarAd = ({ position }) => {
    if (!sidebarAd) return null;

    const image = (
      <img
        src={getAdImageUrl(sidebarAd.image)}
        alt={sidebarAd.title || "Advertisement"}
        className="sidebar-ad-image"
      />
    );

    return (
      <div className={`sticky-side-ad ${position}`}>
        <div className="side-ad-label">ADVERTISEMENT</div>

        {sidebarAd.redirectUrl ? (
          <a
            href={sidebarAd.redirectUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            title={sidebarAd.title}
          >
            {image}
          </a>
        ) : (
          image
        )}
      </div>
    );
  };

  return (
    <div className="theme-3 theme3_bg">
<SidebarAds />
      <style>{`
        /* Sticky Sidebar Advertisement */
        .sticky-side-ad {
          position: fixed;
          top: 150px;
          width: 160px;
          height: 600px;
          z-index: 999;
          background: #ffffff;
          overflow: hidden;
          text-align: center;
        }

        .sticky-left-ad {
          left: calc(50% - 540px - 170px);
        }

        .sticky-right-ad {
          right: calc(50% - 540px - 170px);
        }

        .side-ad-label {
          height: 20px;
          font-size: 10px;
          color: #999;
          text-align: center;
          padding: 3px;
        }

        .sidebar-ad-image {
          width: 160px;
          height: 580px;
          object-fit: contain;
          display: block;
        }

        .sticky-side-ad a {
          display: block;
          width: 100%;
          height: 580px;
        }

        /* Hide on tablet and mobile */
        @media (max-width: 1439px) {
          .sticky-side-ad {
            display: none;
          }
        }

        /* Short screen adjustment */
        @media (max-height: 750px) and (min-width: 1440px) {
          .sticky-side-ad {
            top: 100px;
            height: 500px;
          }

          .sidebar-ad-image {
            height: 480px;
          }

          .sticky-side-ad a {
            height: 480px;
          }
        }
      `}</style>

      {/* LEFT SIDEBAR AD */}
      <SidebarAd position="sticky-left-ad" />

      {/* RIGHT SIDEBAR AD */}
      <SidebarAd position="sticky-right-ad" />

      <ScrollTopButton />

      <TopBarTwo />

      <div className="border_black" />

      <LogoArea />

      <MainMenuTwo />

      <BreakingNews />

      <Outlet />

      {children}

      <FooterAreaTwo />

    </div>
  );
};

export default LayoutTheme2;

LayoutTheme2.propTypes = {
  children: ProtoTypes.node,
};
