
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
        console.error("Sidebar Advertisement Error:", error);
      }
    };

    fetchSidebarAds();
  }, []);

  if (!sidebarAd) return null;

  const imageUrl = sidebarAd.image.startsWith("http")
    ? sidebarAd.image
    : `${IMAGE_BASE_URL}${sidebarAd.image}`;

  const AdContent = () => (
    <img
      src={imageUrl}
      alt={sidebarAd.title || "Advertisement"}
      className="sidebar-ad-image"
    />
  );

  return (
    <>
      <style>{`
        .sticky-sidebar-ad {
          position: fixed;
          top: 150px;
          width: 160px;
          height: 600px;
          z-index: 999;
          background: #fff;
          overflow: hidden;
          text-align: center;
        }

        .sticky-sidebar-left {
          left: calc(50% - 540px - 170px);
        }

        .sticky-sidebar-right {
          right: calc(50% - 540px - 170px);
        }

        .sidebar-ad-label {
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

        .sticky-sidebar-ad a {
          display: block;
          width: 100%;
          height: 580px;
        }

        @media (max-width: 1439px) {
          .sticky-sidebar-ad {
            display: none;
          }
        }

        @media (max-height: 750px) and (min-width: 1440px) {
          .sticky-sidebar-ad {
            top: 100px;
            height: 500px;
          }

          .sidebar-ad-image {
            height: 480px;
          }

          .sticky-sidebar-ad a {
            height: 480px;
          }
        }
      `}</style>

     
      <div className="sticky-sidebar-ad sticky-sidebar-left">
        <div className="sidebar-ad-label">ADVERTISEMENT</div>

        {sidebarAd.redirectUrl ? (
          <a
            href={sidebarAd.redirectUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
          >
            <AdContent />
          </a>
        ) : (
          <AdContent />
        )}
      </div>

     
      <div className="sticky-sidebar-ad sticky-sidebar-right">
        <div className="sidebar-ad-label">ADVERTISEMENT</div>

        {sidebarAd.redirectUrl ? (
          <a
            href={sidebarAd.redirectUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
          >
            <AdContent />
          </a>
        ) : (
          <AdContent />
        )}
      </div>
    </>
  );
};

export default SidebarAds;
