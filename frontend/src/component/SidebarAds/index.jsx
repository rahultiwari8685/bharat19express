
import React, { useEffect, useState } from "react";

const API_URL = "https://api.bharat19express.com";
const IMAGE_BASE_URL = `${API_URL}/uploads/advertisements/`;

const SidebarAds = () => {
    const [sidebarAd, setSidebarAd] = useState(null);

    useEffect(() => {
        const fetchSidebarAds = async () => {
            try {
                const response = await fetch(`${API_URL}/api/advertisements`, {
                    cache: "no-store",
                });

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
                                Number(a.priority || 0) - Number(b.priority || 0)
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

    const AdContent = () =>
        sidebarAd.redirectUrl ? (
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
        );

    return (
        <>
            <style>{`
        
.b19-sidebar-ad {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 140px;
  height: 100vh;
  z-index: 5;
  background: #fff;
  overflow: hidden;
  box-sizing: border-box;
  text-align: center;
}

/* Website width: 1180px, gap: 12px */
.b19-sidebar-left {
  left: calc(50% - 590px - 152px);
}

.b19-sidebar-right {
  right: calc(50% - 590px - 152px);
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
  object-fit: fill;
  object-position: center;
}

.b19-sidebar-ad-link .b19-sidebar-ad-image {
  height: 100%;
}

/* Show only when enough side space is available */
@media (max-width: 1599px) {
  .b19-sidebar-ad {
    display: none;
  }
}

      `}</style>

            {/* Left Advertisement */}
            <div className="b19-sidebar-ad b19-sidebar-left">
                <div className="b19-sidebar-label">ADVERTISEMENT</div>
                <AdContent />
            </div>

            {/* Right Advertisement */}
            <div className="b19-sidebar-ad b19-sidebar-right">
                <div className="b19-sidebar-label">ADVERTISEMENT</div>
                <AdContent />
            </div>
        </>
    );
};

export default SidebarAds;
