// import React from "react";
// import ProtoTypes from "prop-types";
// import { Link } from "react-router-dom";
// import FontAwesome from "../uiStyle/FontAwesome";

// const FollowUs = ({ className = "", title }) => {
//   return (
//     <div className={`follow_box widget mb30 ${className}`}>
//       <h2 className="widget-title">{title}</h2>
//       <div className="social_shares">
//         <Link className="single_social social_facebook" to="#">
//           <span className="follow_icon">
//             <FontAwesome name="facebook-f" />
//           </span>
//           34,456 <span className="icon_text">Fans</span>
//         </Link>
//         <Link className="single_social social_twitter" to="#">
//           <span className="follow_icon">
//             <FontAwesome name="twitter" />
//           </span>
//           34,456 <span className="icon_text">Followers</span>
//         </Link>
//         <Link className="single_social social_youtube" to="#">
//           <span className="follow_icon">
//             <FontAwesome name="youtube" />
//           </span>
//           34,456 <span className="icon_text">Subscribers</span>
//         </Link>
//         <Link className="single_social social_instagram" to="#">
//           <span className="follow_icon">
//             <FontAwesome name="instagram" />
//           </span>
//           34,456 <span className="icon_text">Followers</span>
//         </Link>
//         <Link className="single_social social_vimeo" to="#">
//           <span className="follow_icon">
//             <FontAwesome name="vimeo" />
//           </span>
//           34,456 <span className="icon_text">Followers</span>
//         </Link>
//         <Link className="single_social social_medium" to="#">
//           <span className="follow_icon">
//             <FontAwesome name="medium" />
//           </span>
//           34,456 <span className="icon_text">Followers</span>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default FollowUs;

// FollowUs.propTypes = {
//   className: ProtoTypes.string,
//   title: ProtoTypes.string,
// };

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import FontAwesome from "../uiStyle/FontAwesome";

const API = "https://api.iotaclasses.in";

const socialPlatforms = [
  {
    key: "facebook",
    label: "Facebook",
    icon: "facebook-f",
    className: "social_facebook",
    text: "Follow us on Facebook",
  },
  {
    key: "twitter",
    label: "Twitter / X",
    icon: "twitter",
    className: "social_twitter",
    text: "Follow us on Twitter",
  },
  {
    key: "youtube",
    label: "YouTube",
    icon: "youtube",
    className: "social_youtube",
    text: "Subscribe on YouTube",
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: "instagram",
    className: "social_instagram",
    text: "Follow us on Instagram",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: "linkedin",
    className: "social_facebook",
    text: "Connect on LinkedIn",
  },
];

const FollowUs = ({ className = "", title = "Follow Us" }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API}/api/site-settings`);
        const result = await response.json();

        if (response.ok && result.success && result.data) {
          setSettings(result.data);
        }
      } catch (error) {
        console.error("Follow Us Settings Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (loading) {
    return null;
  }

  const activePlatforms = socialPlatforms.filter((platform) => {
    const url = settings?.[platform.key];
    return typeof url === "string" && url.trim() !== "";
  });

  if (activePlatforms.length === 0) {
    return null;
  }

  return (
    <div className={`follow_box widget mb30 ${className}`}>
      <h2 className="widget-title">{title}</h2>

      <div className="social_shares">
        {activePlatforms.map((platform) => (
          <a
            key={platform.key}
            className={`single_social ${platform.className}`}
            href={settings[platform.key]}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={platform.text}
            title={platform.text}
          >
            <span className="follow_icon">
              <FontAwesome name={platform.icon} />
            </span>

            <span>{platform.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

FollowUs.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
};

export default FollowUs;
