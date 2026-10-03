import React, { useEffect, useState } from "react";
import FontAwesome from "../uiStyle/FontAwesome";
import { NavLink } from "react-router-dom";
import SidebarMenu from "../SidebarMenu";
import { useTranslation } from "react-i18next";

const MainMenuTwo = () => {
  const API = "https://api.iotaclasses.in";

  const { t, i18n } = useTranslation();

  const [menuItems, setMenuItems] = useState([]);
  const [sideShow, setSideShow] = useState(false);

  const getCategoryName = (category) => {
    const lang = i18n.resolvedLanguage || "en";

    return (
      category?.translations?.[lang]?.name ||
      category?.translations?.en?.name ||
      category?.name ||
      ""
    );
  };

  useEffect(() => {
    getMenu();
  }, [i18n.resolvedLanguage]);

  const getMenu = async () => {
    try {
      const language = i18n.resolvedLanguage || "en";

      const res = await fetch(`${API}/api/categories/menu?lang=${language}`);
      const data = await res.json();

      if (data.success) {
        setMenuItems(data.data || []);
      }
    } catch (error) {
      console.error("Menu Error:", error);
    }
  };

  const parentMenus = menuItems.filter((item) => item.parentCategory === null);

  const getChildren = (parentId) => {
    return menuItems.filter((item) => item.parentCategory?._id === parentId);
  };

  const visibleMenus = parentMenus.slice(0, 7);
  const moreMenus = parentMenus.slice(7);

  return (
    <div className="container">
      <div className="main-menu">
        <div className="main-nav clearfix is-ts-sticky">
          <div className="row justify-content-between">
            <nav className="navbar navbar-expand-lg col-lg-8 align-self-center">
              <div className="site-nav-inner">
                <button
                  className="navbar-toggler"
                  onClick={() => setSideShow(true)}
                >
                  <FontAwesome name="bars" />
                </button>

                <div
                  id="navbarSupportedContent"
                  className="collapse navbar-collapse navbar-responsive-collapse"
                >
                  <ul className="nav navbar-nav" id="scroll">
                    {/* HOME */}
                    <li className="nav-item">
                      {/* <NavLink to="/">Home</NavLink> */}
                      <NavLink to="/">{t("home")}</NavLink>
                    </li>

                    {/* DYNAMIC CATEGORIES */}
                    {visibleMenus.map((parent) => {
                      const children = getChildren(parent._id);

                      return (
                        <li
                          key={parent._id}
                          className={`nav-item ${
                            children.length > 0 ? "dropdown" : ""
                          }`}
                        >
                          {children.length > 0 ? (
                            <>
                              <NavLink
                                to={`/category/${parent._id}`}
                                className="menu-dropdown"
                              >
                                {/* {parent.name} */}
                                {getCategoryName(parent)}
                                <FontAwesome name="angle-down" />
                              </NavLink>

                              {/* Child Categories */}
                              <ul className="dropdown-menu" role="menu">
                                {children.map((child) => (
                                  <li key={child._id}>
                                    <NavLink to={`/category/${child._id}`}>
                                      {/* {child.name} */}
                                      {getCategoryName(child)}
                                    </NavLink>
                                  </li>
                                ))}
                              </ul>
                            </>
                          ) : (
                            <NavLink
                              to={`/category/${parent._id}`}
                              className="menu-dropdown"
                            >
                              {/* {parent.name} */}
                              {getCategoryName(parent)}
                            </NavLink>
                          )}
                        </li>
                      );
                    })}

                    {/* MORE */}
                    {moreMenus.length > 0 && (
                      <li className="nav-item dropdown">
                        <NavLink
                          to="#"
                          onClick={(e) => e.preventDefault()}
                          className="menu-dropdown"
                        >
                          {t("more")}
                          <FontAwesome name="angle-down" />
                        </NavLink>

                        <ul className="dropdown-menu" role="menu">
                          {moreMenus.map((parent) => {
                            const children = getChildren(parent._id);

                            return (
                              <li
                                key={parent._id}
                                className={
                                  children.length > 0 ? "dropdown-submenu" : ""
                                }
                              >
                                <NavLink to={`/category/${parent._id}`}>
                                  {parent.name}
                                </NavLink>

                                {/* Children inside More */}
                                {children.length > 0 && (
                                  <ul className="dropdown-menu">
                                    {children.map((child) => (
                                      <li key={child._id}>
                                        <NavLink to={`/category/${child._id}`}>
                                          {/* {child.name} */}
                                          {getCategoryName(child)}
                                        </NavLink>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    )}
                    <li
                      className="nav-item"
                      style={{
                        marginLeft: "10px",
                      }}
                    >
                      <NavLink
                        to="/epaper"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "7px",
                          minHeight: "36px",
                          padding: "0 14px",
                          borderRadius: "5px",
                          background: "#e31e24",
                          color: "#fff",
                          fontSize: "12px",
                          fontWeight: "800",
                          textDecoration: "none",
                        }}
                      >
                        <FontAwesome name="newspaper-o" />
                        <span>Epaper</span>
                      </NavLink>
                    </li>
                  </ul>
                </div>

                <SidebarMenu
                  className="themeBlue"
                  sideShow={sideShow}
                  setSideShow={setSideShow}
                  menus={menuItems}
                />
              </div>
            </nav>

            <div className="col-lg-3 text-right align-self-center">
              <div className="date3">
                <p>
                  {new Date().toLocaleDateString("en-IN", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainMenuTwo;
