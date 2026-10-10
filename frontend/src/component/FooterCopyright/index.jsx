// import React from "react";
// import { Link } from "react-router-dom";

// const quick_links = [
//   {
//     name: "About",
//     link: "/about",
//   },
//   // {
//   //   name: "Advertise",
//   //   link: "/",
//   // },
//   {
//     name: "Privacy & Policy",
//     link: "/",
//   },
//   {
//     name: "Contact Us",
//     link: "/contact",
//   },
// ];

// const FooterCopyright = () => {
//   return (
//     <div className="copyright">
//       <div className="container">
//         <div className="row">
//           <div className="col-lg-6 align-self-center">
//             <p>&copy; Copyright 2026, All Rights Reserved</p>
//           </div>
//           <div className="col-lg-6 align-self-center">
//             <div className="copyright_menus text-right">
//               <div className="language" />
//               <div className="copyright_menu inline">
//                 <ul>
//                   {quick_links.map((item, i) => (
//                     <li key={i}>
//                       <Link to={item.link}>{item.name}</Link>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FooterCopyright;

import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FooterCopyright = () => {
  const { t } = useTranslation();

  const quick_links = [
    {
      name: t("about.title", "About"),
      link: "/about",
    },
    {
      name: t("privacy", "Privacy Policy"),
      link: "/privacy",
    },
    {
      name: t("contact", "Contact Us"),
      link: "/contact",
    },
  ];

  return (
    <div className="copyright">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 align-self-center">
            <p>
              &copy; {new Date().getFullYear()} {t("copyright", "Copyright")},{" "}
              {t("allRightsReserved", "All Rights Reserved")}
            </p>
          </div>

          <div className="col-lg-6 align-self-center">
            <div className="copyright_menus text-right">
              <div className="language" />

              <div className="copyright_menu inline">
                <ul>
                  {quick_links.map((item) => (
                    <li key={item.link}>
                      <Link to={item.link}>{item.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterCopyright;
