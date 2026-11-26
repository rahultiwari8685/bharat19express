
// import React, { useEffect, useState } from "react";

// const API_URL = "https://api.bharat19express.com";
// const IMAGE_BASE_URL = `${API_URL}/uploads/advertisements/`;

// const SidebarAds = () => {
//     const [sidebarAd, setSidebarAd] = useState(null);

//     useEffect(() => {
//         const fetchSidebarAds = async () => {
//             try {
//                 const response = await fetch(
//                     `${API_URL}/api/advertisements`,
//                     { cache: "no-store" }
//                 );

//                 if (!response.ok) {
//                     throw new Error("Failed to fetch advertisements");
//                 }

//                 const result = await response.json();

//                 if (result.success && Array.isArray(result.data)) {
//                     const ads = result.data
//                         .filter(
//                             (ad) =>
//                                 ad.status === true &&
//                                 ad.position === "sidebar" &&
//                                 ad.type === "image" &&
//                                 ad.image
//                         )
//                         .sort(
//                             (a, b) =>
//                                 Number(a.priority || 0) -
//                                 Number(b.priority || 0)
//                         );

//                     setSidebarAd(ads[0] || null);
//                 }
//             } catch (error) {
//                 console.error("Sidebar Advertisement Error:", error);
//             }
//         };

//         fetchSidebarAds();
//     }, []);

//     if (!sidebarAd) return null;

//     const imageUrl = sidebarAd.image.startsWith("http")
//         ? sidebarAd.image
//         : `${IMAGE_BASE_URL}${sidebarAd.image}`;

//     const AdImage = () => (
//         <img
//             src={imageUrl}
//             alt={sidebarAd.title || "Advertisement"}
//             className="b19-sidebar-ad-image"
//         />
//     );

//     return (
//         <>



//             <style>{`
//   .b19-sidebar-ad {
//     position: fixed;
//     top: 0;
//     bottom: 0;
//     width: 140px;
//     height: 100vh;
//     z-index: 5;
//     background: #fff;
//     overflow: hidden;
//     box-sizing: border-box;
//     text-align: center;
//   }

//   .b19-sidebar-left {
//     left: calc(50% - 590px - 165px);
//   }

//   .b19-sidebar-right {
//     right: calc(50% - 590px - 165px);
//   }

//   .b19-sidebar-label {
//     height: 20px;
//     line-height: 20px;
//     font-size: 10px;
//     color: #999;
//   }

//   .b19-sidebar-ad-link {
//     display: block;
//     width: 100%;
//     height: calc(100% - 20px);
//   }

//   .b19-sidebar-ad-image {
//     display: block;
//     width: 100%;
//     height: calc(100% - 20px);
//     object-fit: fill;
//   }

//   .b19-sidebar-ad-link .b19-sidebar-ad-image {
//     height: 100%;
//   }

//   /* Hide below 1000px */
//   @media screen and (max-width: 999px) {
//     .b19-sidebar-ad {
//       display: none !important;
//     }
//   }

//   /* 1000px to 1599px */
//   @media screen and (min-width: 1000px) and (max-width: 1599px) {
//     .b19-sidebar-ad {
//       width: 55px;
//     }

//     .b19-sidebar-left {
//       left: 5px;
//     }

//     .b19-sidebar-right {
//       right: 5px;
//     }
//   }

//   /* 1600px to 1799px */
//   @media screen and (min-width: 1600px) and (max-width: 1799px) {
//     .b19-sidebar-ad {
//       width: 140px;
//     }

//     .b19-sidebar-left {
//       left: calc(50% - 590px - 165px);
//     }

//     .b19-sidebar-right {
//       right: calc(50% - 590px - 165px);
//     }
//   }

//   /* 1800px and above */
//   @media screen and (min-width: 1800px) {
//     .b19-sidebar-ad {
//       width: 160px;
//     }

//     .b19-sidebar-left {
//       left: calc(50% - 590px - 185px);
//     }

//     .b19-sidebar-right {
//       right: calc(50% - 590px - 185px);
//     }
//   }

//   /* 2200px and above */
//   @media screen and (min-width: 2200px) {
//     .b19-sidebar-ad {
//       width: 180px;
//     }

//     .b19-sidebar-left {
//       left: calc(50% - 590px - 205px);
//     }

//     .b19-sidebar-right {
//       right: calc(50% - 590px - 205px);
//     }
//   }
// `}</style>


//             {/* LEFT SIDEBAR */}
//             <div className="b19-sidebar-ad b19-sidebar-left">
//                 <div className="b19-sidebar-label">ADVERTISEMENT</div>

//                 {sidebarAd.redirectUrl ? (
//                     <a
//                         href={sidebarAd.redirectUrl}
//                         target="_blank"
//                         rel="noopener noreferrer sponsored"
//                         className="b19-sidebar-ad-link"
//                     >
//                         <AdImage />
//                     </a>
//                 ) : (
//                     <AdImage />
//                 )}
//             </div>

//             {/* RIGHT SIDEBAR */}
//             <div className="b19-sidebar-ad b19-sidebar-right">
//                 <div className="b19-sidebar-label">ADVERTISEMENT</div>

//                 {sidebarAd.redirectUrl ? (
//                     <a
//                         href={sidebarAd.redirectUrl}
//                         target="_blank"
//                         rel="noopener noreferrer sponsored"
//                         className="b19-sidebar-ad-link"
//                     >
//                         <AdImage />
//                     </a>
//                 ) : (
//                     <AdImage />
//                 )}
//             </div>
//         </>
//     );
// };

// export default SidebarAds;


// import React, { useEffect, useState } from "react";

// const API_URL = "https://api.bharat19express.com";
// const IMAGE_BASE_URL = `${API_URL}/uploads/advertisements/`;

// const SidebarAds = () => {
//     const [leftSidebarAd, setLeftSidebarAd] = useState(null);
//     const [rightSidebarAd, setRightSidebarAd] = useState(null);

//     // Fetch sidebar advertisement
//     useEffect(() => {
//         const fetchSidebarAds = async () => {
//             try {
//                 const response = await fetch(
//                     `${API_URL}/api/advertisements`,
//                     { cache: "no-store" }
//                 );

//                 if (!response.ok) {
//                     throw new Error("Failed to fetch advertisements");
//                 }

//                 const result = await response.json();

//                 if (result.success && Array.isArray(result.data)) {
//                     const ads = result.data.filter(
//                         (ad) =>
//                             ad.status === true &&
//                             ad.type === "image" &&
//                             ad.image
//                     );

//                     const sortByPriority = (a, b) =>
//                         Number(a.priority || 0) - Number(b.priority || 0);

//                     const leftAd = ads
//                         .filter((ad) => ad.position === "sidebar_left")
//                         .sort(sortByPriority)[0] || null;

//                     const rightAd = ads
//                         .filter((ad) => ad.position === "sidebar_right")
//                         .sort(sortByPriority)[0] || null;

//                     setLeftSidebarAd(leftAd);
//                     setRightSidebarAd(rightAd);
//                 }
//             } catch (error) {
//                 console.error("Sidebar Advertisement Error:", error);
//             }
//         };

//         fetchSidebarAds();
//     }, []);


//     useEffect(() => {
//         const updateSidebarAds = () => {
//             const ads = document.querySelectorAll(".b19-sidebar-ad");

//             // Exact footer wrapper
//             const footer = document.getElementById("b19-footer-boundary");

//             if (!footer) return;

//             const footerTop = footer.getBoundingClientRect().top;

//             // Available space above footer
//             const availableHeight = Math.max(
//                 0,
//                 Math.min(window.innerHeight, footerTop)
//             );

//             ads.forEach((ad) => {
//                 ad.style.height = `${availableHeight}px`;
//             });
//         };

//         updateSidebarAds();

//         window.addEventListener("scroll", updateSidebarAds, {
//             passive: true,
//         });

//         window.addEventListener("resize", updateSidebarAds);

//         return () => {
//             window.removeEventListener("scroll", updateSidebarAds);
//             window.removeEventListener("resize", updateSidebarAds);
//         };
//     }, [sidebarAd]);


//     if (!sidebarAd) return null;

//     const imageUrl = sidebarAd.image.startsWith("http")
//         ? sidebarAd.image
//         : `${IMAGE_BASE_URL}${sidebarAd.image}`;

//     const AdImage = () => (
//         <img
//             src={imageUrl}
//             alt={sidebarAd.title || "Advertisement"}
//             className="b19-sidebar-ad-image"
//         />
//     );

//     return (
//         <>
//             <style>{`
//                 .b19-sidebar-ad {
//                     position: fixed;
//                     top: 0;
//                     bottom: auto;
//                     width: 140px;
//                     height: 100vh;
//                     z-index: 5;
//                     background: #fff;
//                     overflow: hidden;
//                     box-sizing: border-box;
//                     text-align: center;
//                 }

//                 .b19-sidebar-left {
//                     left: calc(50% - 590px - 165px);
//                 }

//                 .b19-sidebar-right {
//                     right: calc(50% - 590px - 165px);
//                 }

//                 .b19-sidebar-label {
//                     height: 20px;
//                     line-height: 20px;
//                     font-size: 10px;
//                     color: #999;
//                 }

//                 .b19-sidebar-ad-link {
//                     display: block;
//                     width: 100%;
//                     height: calc(100% - 20px);
//                 }

//                 .b19-sidebar-ad-image {
//                     display: block;
//                     width: 100%;
//                     height: calc(100% - 20px);
//                     object-fit: fill;
//                 }

//                 .b19-sidebar-ad-link .b19-sidebar-ad-image {
//                     height: 100%;
//                 }

//                 /* Hide below 1000px */
//                 @media screen and (max-width: 999px) {
//                     .b19-sidebar-ad {
//                         display: none !important;
//                     }
//                 }

//                 /* 1000px to 1599px */
//                 @media screen and (min-width: 1000px) and (max-width: 1599px) {
//                     .b19-sidebar-ad {
//                         width: 55px;
//                     }

//                     .b19-sidebar-left {
//                         left: 5px;
//                     }

//                     .b19-sidebar-right {
//                         right: 5px;
//                     }
//                 }

//                 /* 1600px to 1799px */
//                 @media screen and (min-width: 1600px) and (max-width: 1799px) {
//                     .b19-sidebar-ad {
//                         width: 140px;
//                     }

//                     .b19-sidebar-left {
//                         left: calc(50% - 590px - 165px);
//                     }

//                     .b19-sidebar-right {
//                         right: calc(50% - 590px - 165px);
//                     }
//                 }

//                 /* 1800px and above */
//                 @media screen and (min-width: 1800px) {
//                     .b19-sidebar-ad {
//                         width: 160px;
//                     }

//                     .b19-sidebar-left {
//                         left: calc(50% - 590px - 185px);
//                     }

//                     .b19-sidebar-right {
//                         right: calc(50% - 590px - 185px);
//                     }
//                 }

//                 /* 2200px and above */
//                 @media screen and (min-width: 2200px) {
//                     .b19-sidebar-ad {
//                         width: 180px;
//                     }

//                     .b19-sidebar-left {
//                         left: calc(50% - 590px - 205px);
//                     }

//                     .b19-sidebar-right {
//                         right: calc(50% - 590px - 205px);
//                     }
//                 }
//             `}</style>

//             {/* LEFT SIDEBAR */}
//             <div className="b19-sidebar-ad b19-sidebar-left">
//                 <div className="b19-sidebar-label">
//                     ADVERTISEMENT
//                 </div>

//                 {sidebarAd.redirectUrl ? (
//                     <a
//                         href={sidebarAd.redirectUrl}
//                         target="_blank"
//                         rel="noopener noreferrer sponsored"
//                         className="b19-sidebar-ad-link"
//                     >
//                         <AdImage />
//                     </a>
//                 ) : (
//                     <AdImage />
//                 )}
//             </div>

//             {/* RIGHT SIDEBAR */}
//             <div className="b19-sidebar-ad b19-sidebar-right">
//                 <div className="b19-sidebar-label">
//                     ADVERTISEMENT
//                 </div>

//                 {sidebarAd.redirectUrl ? (
//                     <a
//                         href={sidebarAd.redirectUrl}
//                         target="_blank"
//                         rel="noopener noreferrer sponsored"
//                         className="b19-sidebar-ad-link"
//                     >
//                         <AdImage />
//                     </a>
//                 ) : (
//                     <AdImage />
//                 )}
//             </div>
//         </>
//     );
// };

// export default SidebarAds;


import React, { useEffect, useState } from "react";

const API_URL = "https://api.bharat19express.com";
const IMAGE_BASE_URL = `${API_URL}/uploads/advertisements/`;

const SidebarAds = () => {
    const [leftSidebarAd, setLeftSidebarAd] = useState(null);
    const [rightSidebarAd, setRightSidebarAd] = useState(null);

    // Fetch separate left and right sidebar advertisements
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
                    const ads = result.data.filter(
                        (ad) =>
                            ad.status === true &&
                            ad.type === "image" &&
                            ad.image
                    );

                    const sortByPriority = (a, b) =>
                        Number(a.priority || 0) -
                        Number(b.priority || 0);

                    const leftAd =
                        ads
                            .filter(
                                (ad) => ad.position === "sidebar_left"
                            )
                            .sort(sortByPriority)[0] || null;

                    const rightAd =
                        ads
                            .filter(
                                (ad) => ad.position === "sidebar_right"
                            )
                            .sort(sortByPriority)[0] || null;

                    setLeftSidebarAd(leftAd);
                    setRightSidebarAd(rightAd);
                } else {
                    setLeftSidebarAd(null);
                    setRightSidebarAd(null);
                }
            } catch (error) {
                console.error(
                    "Sidebar Advertisement Error:",
                    error
                );
            }
        };

        fetchSidebarAds();
    }, []);

    // Adjust sidebar height according to footer position
    useEffect(() => {
        const updateSidebarAds = () => {
            const sidebarAds = document.querySelectorAll(
                ".b19-sidebar-ad"
            );

            const footer = document.getElementById(
                "b19-footer-boundary"
            );

            if (!footer) return;

            const footerTop = footer.getBoundingClientRect().top;

            const availableHeight = Math.max(
                0,
                Math.min(window.innerHeight, footerTop)
            );

            sidebarAds.forEach((ad) => {
                ad.style.height = `${availableHeight}px`;
            });
        };

        updateSidebarAds();

        window.addEventListener("scroll", updateSidebarAds, {
            passive: true,
        });

        window.addEventListener("resize", updateSidebarAds);

        return () => {
            window.removeEventListener(
                "scroll",
                updateSidebarAds
            );

            window.removeEventListener(
                "resize",
                updateSidebarAds
            );
        };
    }, [leftSidebarAd, rightSidebarAd]);

    // Generate full image URL
    const getImageUrl = (ad) => {
        if (!ad?.image) return "";

        return ad.image.startsWith("http")
            ? ad.image
            : `${IMAGE_BASE_URL}${ad.image.replace(/^\/+/, "")}`;
    };

    // Reusable advertisement renderer
    const renderSidebarAd = (ad, positionClass) => {
        if (!ad) return null;

        const imageUrl = getImageUrl(ad);

        const image = (
            <img
                src={imageUrl}
                alt={ad.title || "Advertisement"}
                className="b19-sidebar-ad-image"
                loading="eager"
            />
        );

        return (
            <div
                className={`b19-sidebar-ad ${positionClass}`}
                key={ad._id || positionClass}
            >
                <div className="b19-sidebar-label">
                    ADVERTISEMENT
                </div>

                {ad.redirectUrl ? (
                    <a
                        href={ad.redirectUrl}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="b19-sidebar-ad-link"
                        aria-label={ad.title || "Advertisement"}
                    >
                        {image}
                    </a>
                ) : (
                    <div className="b19-sidebar-ad-link">
                        {image}
                    </div>
                )}
            </div>
        );
    };

    // Don't render empty sidebar containers
    if (!leftSidebarAd && !rightSidebarAd) {
        return null;
    }

    return (
        <>
            <style>{`
                .b19-sidebar-ad {
                    position: fixed;
                    top: 0;
                    bottom: auto;
                    width: 140px;
                    height: 100vh;
                    z-index: 5;
                    background: #fff;
                    overflow: hidden;
                    box-sizing: border-box;
                    text-align: center;
                }

                .b19-sidebar-left {
                    left: calc(50% - 590px - 165px);
                }

                .b19-sidebar-right {
                    right: calc(50% - 590px - 165px);
                }

                .b19-sidebar-label {
                    height: 20px;
                    line-height: 20px;
                    font-size: 10px;
                    color: #999;
                }

                .b19-sidebar-ad-link {
                    display: block;
                    width: 100%;
                    height: calc(100% - 20px);
                    overflow: hidden;
                }

                .b19-sidebar-ad-image {
                    display: block;
                    width: 100%;
                    height: 100%;
                    object-fit: fill;
                }

                /* Hide below 1000px */
                @media screen and (max-width: 999px) {
                    .b19-sidebar-ad {
                        display: none !important;
                    }
                }

                /* 1000px to 1599px */
                @media screen and (min-width: 1000px) and (max-width: 1599px) {
                    .b19-sidebar-ad {
                        width: 55px;
                    }

                    .b19-sidebar-left {
                        left: 5px;
                    }

                    .b19-sidebar-right {
                        right: 5px;
                    }
                }

                /* 1600px to 1799px */
                @media screen and (min-width: 1600px) and (max-width: 1799px) {
                    .b19-sidebar-ad {
                        width: 140px;
                    }

                    .b19-sidebar-left {
                        left: calc(50% - 590px - 165px);
                    }

                    .b19-sidebar-right {
                        right: calc(50% - 590px - 165px);
                    }
                }

                /* 1800px to 2199px */
                @media screen and (min-width: 1800px) and (max-width: 2199px) {
                    .b19-sidebar-ad {
                        width: 160px;
                    }

                    .b19-sidebar-left {
                        left: calc(50% - 590px - 185px);
                    }

                    .b19-sidebar-right {
                        right: calc(50% - 590px - 185px);
                    }
                }

                /* 2200px and above */
                @media screen and (min-width: 2200px) {
                    .b19-sidebar-ad {
                        width: 180px;
                    }

                    .b19-sidebar-left {
                        left: calc(50% - 590px - 205px);
                    }

                    .b19-sidebar-right {
                        right: calc(50% - 590px - 205px);
                    }
                }
            `}</style>

            {/* LEFT SIDEBAR ADVERTISEMENT */}
            {renderSidebarAd(
                leftSidebarAd,
                "b19-sidebar-left"
            )}

            {/* RIGHT SIDEBAR ADVERTISEMENT */}
            {renderSidebarAd(
                rightSidebarAd,
                "b19-sidebar-right"
            )}
        </>
    );
};

export default SidebarAds;


