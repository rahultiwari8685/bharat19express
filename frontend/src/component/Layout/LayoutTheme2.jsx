
// import React from "react";
// import PropTypes from "prop-types";
// import { Outlet } from "react-router-dom";

// import SidebarAds from "../../component/SidebarAds";
// import TopBarTwo from "../../component/TopBarTwo";
// import MainMenuTwo from "../../component/MainMenuTwo";
// import FooterAreaTwo from "../../component/FooterAreaTwo";
// import ScrollTopButton from "../ScrollTopButton";
// import LogoArea from "../LogoArea";
// import BreakingNews from "../BreakingNews";

// const LayoutTheme2 = ({ children }) => {
//   return (
//     <div className="theme-3 theme3_bg">

//       {/* Sticky Sidebar Advertisements */}
//       <SidebarAds />

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

// LayoutTheme2.propTypes = {
//   children: PropTypes.node,
// };

// export default LayoutTheme2;




import React from "react";
import PropTypes from "prop-types";
import { Outlet } from "react-router-dom";

import SidebarAds from "../../component/SidebarAds";
import TopBarTwo from "../../component/TopBarTwo";
import MainMenuTwo from "../../component/MainMenuTwo";
import FooterAreaTwo from "../../component/FooterAreaTwo";
import ScrollTopButton from "../ScrollTopButton";
import LogoArea from "../LogoArea";
import BreakingNews from "../BreakingNews";

const LayoutTheme2 = ({ children }) => {
  return (
    <div className="theme-3 theme3_bg">

      {/* Sticky Left and Right Sidebar Advertisements */}
      <SidebarAds />

      {/* Scroll to Top */}
      <ScrollTopButton />

      {/* Header */}
      <TopBarTwo />

      <div className="border_black" />

      <LogoArea />

      {/* Navigation */}
      <MainMenuTwo />

      {/* Breaking News */}
      <BreakingNews />

      {/* Page Content */}
      <Outlet />

      {children}

      {/* Footer */}
      <FooterAreaTwo />

    </div>
  );
};

LayoutTheme2.propTypes = {
  children: PropTypes.node,
};

export default LayoutTheme2;
