
import React, { useEffect, useState } from "react";

const API_URL = "https://api.bharat19express.com";
const IMAGE_BASE_URL = `${API_URL}/uploads/advertisements/`;

const SidebarAds = () => {
  const [sidebarAd, setSidebarAd] = useState(null);

  useEffect(() => {
    const fetchSidebarAds = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/advertisements`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch advertisements");
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          const ads = result.data
            .filter(
              (ad) =>
                ad.status === true &&
                ad.position === "sidebar" &&
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
        console.error("Sidebar Advertisement Error:", error);
      }
    };

    fetchSidebarAds();
  }, []);

  if (!sidebarAd) return null;

  const imageUrl = sidebarAd.image.startsWith("http")
    ? sidebarAd.image
    : `${IMAGE_BASE_URL}${sidebarAd.image}`;

  const AdImage = () => (
    <img
      src={imageUrl}
      alt={sidebarAd.title || "Advertisement"}
      className="b19-sidebar-ad-image"
    />
  );

  return (
    <>
      <style>{`
        .b19-sidebar-ad {
          position: fixed;
          top: 150px;
          width: 160px;
          height: calc(100vh - 170px);
          max-height: 850px;
          min-height: 400px;
          z-index: 20;
          background: #fff;
          overflow: hidden;
          text-align: center;
          box-sizing: border-box;
        }

        /* Keep ads outside the central website content */
        .b19-sidebar-left {
          left: max(12px, calc((100vw - 1840px) / 2));
        }

        .b19-sidebar-right {
          right: max(12px, calc((100vw - 1840px) / 2));
        }

        .b19-sidebar-label {
          height: 20px;
          line-height: 20px;
          font-size: 10px;
          color: #999;
          background: #fff;
        }

        .b19-sidebar-ad-link {
          display: block;
          width: 100%;
          height: calc(100% - 20px);
        }

        .b19-sidebar-ad-image {
          display: block;
          width: 100%;
          height: calc(100% - 20px);
          object-fit: cover;
          object-position: center;
        }

        .b19-sidebar-ad-link .b19-sidebar-ad-image {
          height: 100%;
        }

        @media (max-width: 1365px) {
          .b19-sidebar-ad {
            display: none;
          }
        }

        @media (max-height: 550px) {
          .b19-sidebar-ad {
            top: 90px;
            height: calc(100vh - 100px);
            min-height: 0;
          }
        }
      `}</style>

      {/* LEFT SIDEBAR */}
      <div className="b19-sidebar-ad b19-sidebar-left">
        <div className="b19-sidebar-label">ADVERTISEMENT</div>

        {sidebarAd.redirectUrl ? (
          <a
            href={sidebarAd.redirectUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="b19-sidebar-ad-link"
          >
            <AdImage />
          </a>
        ) : (
          <AdImage />
        )}
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="b19-sidebar-ad b19-sidebar-right">
        <div className="b19-sidebar-label">ADVERTISEMENT</div>

        {sidebarAd.redirectUrl ? (
          <a
            href={sidebarAd.redirectUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="b19-sidebar-ad-link"
          >
            <AdImage />
          </a>
        ) : (
          <AdImage />
        )}
      </div>
    </>
  );
};

export default SidebarAds;
