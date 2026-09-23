import React, { useState, useEffect } from "react";
import BreadCrumb from "../../../component/BreadCrumb";
import FontAwesome from "../../../component/uiStyle/FontAwesome";
import { Link } from "react-router-dom";
import WidgetTab from "../../../component/WidgetTab";
import WidgetTrendingNews from "../../../component/WidgetTrendingNews";
import NewsLetter from "../../../component/NewsLetter";
import EntertainmentNews from "../../../component/EntertainmentNews";
import { Fade, Nav, NavItem, TabContent, TabPane } from "reactstrap";
import MostShareWidget from "../../../component/MostShareWidget";
import BannerSection from "../../../component/BannerSection";

// images
import banner2 from "../../../assets/img/ad/ad-2.jpg";
import author1 from "../../../assets/img/author.png";
import calendar from "../../../assets/img/icon/calendar.png";
import { entertainments2 } from "../../../data/entertainments";

function About() {
  const [activeTab, setActiveTab] = useState("1");

  const API = "https://api.iotaclasses.in";

  const [latestNews, setLatestNews] = useState([]);
  const [popularNews, setPopularNews] = useState([]);

  useEffect(() => {
    getLatestNews();
    getPopularNews();
  }, []);

  const getLatestNews = async () => {
    try {
      const res = await fetch(`${API}/api/news/getAllNews?limit=6`);
      const data = await res.json();

      if (data.status) {
        setLatestNews(data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getPopularNews = async () => {
    try {
      const res = await fetch(`${API}/api/news/popular?limit=6`);
      const data = await res.json();

      if (data.status) {
        setPopularNews(data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };
  return (
    <>
      <BreadCrumb className="shadow5" title="About Bharat TV Media">
        <>
          <div className="space-50" />
          <div className="row">
            <div className="col-12">
              <div className="about_company">
                <h2>Bharat TV Media</h2>

                <p>
                  Bharat TV Media is a digital Hindi news platform committed to
                  delivering accurate, fast and unbiased news from India and
                  around the world.
                </p>

                <div className="space-20" />

                <h4>Our Mission</h4>

                <p>
                  Our mission is to provide trustworthy journalism, factual
                  reporting and real-time updates covering Politics, National,
                  International, Sports, Entertainment, Business, Technology and
                  Local News.
                </p>

                <div className="space-20" />

                <h4>Our Vision</h4>

                <p>
                  To become one of India's most trusted digital news
                  organizations by delivering quality journalism with speed,
                  transparency and credibility.
                </p>

                <div className="space-20" />

                <h4>What We Cover</h4>

                <ul className="about-list">
                  <li>Politics</li>
                  <li>National News</li>
                  <li>State News</li>
                  <li>Business</li>
                  <li>Sports</li>
                  <li>Entertainment</li>
                  <li>Technology</li>
                  <li>Health</li>
                  <li>World News</li>
                </ul>
              </div>

              <div className="space-50" />
            </div>
          </div>
          <div className="space-50" />
        </>
      </BreadCrumb>
      <div className="archives padding-top-30">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-lg-8">
              <div className="row">
                <div className="col-10 align-self-center">
                  <div className="about_post_list">
                    <Nav tabs>
                      <NavItem>
                        <div
                          className={activeTab === "1" ? "active" : ""}
                          onClick={() => {
                            toggle("1");
                          }}
                        >
                          Latest news
                        </div>
                      </NavItem>
                      <NavItem>
                        <div
                          className={activeTab === "2" ? "active" : ""}
                          onClick={() => {
                            toggle("2");
                          }}
                        >
                          Popular news
                        </div>
                      </NavItem>
                    </Nav>
                  </div>
                </div>
                <div className="col-2 text-right align-self-center">
                  <div className="calender mb20">
                    <img src={calendar} alt="calendar" />
                  </div>
                </div>
              </div>
              <div className="about_posts_tab">
                <TabContent activeTab={activeTab}>
                  <TabPane tabId="1">
                    <Fade in={activeTab === "1"}>
                      <div className="row justify-content-center">
                        <EntertainmentNews
                          headerHide={true}
                          entertainments={latestNews}
                        />
                      </div>
                    </Fade>
                  </TabPane>
                  <TabPane tabId="2">
                    <Fade in={activeTab === "2"}>
                      <div className="row justify-content-center">
                        <EntertainmentNews
                          headerHide={true}
                          entertainments={popularNews}
                        />
                      </div>
                    </Fade>
                  </TabPane>
                </TabContent>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="cpagination">
                    <nav aria-label="Page navigation example">
                      <ul className="pagination">
                        <li className="page-item">
                          <Link
                            className="page-link"
                            to="/"
                            aria-label="Previous"
                          >
                            <span aria-hidden="true">
                              <FontAwesome name="caret-left" />
                            </span>
                          </Link>
                        </li>
                        <li className="page-item">
                          <Link className="page-link" to="/">
                            1
                          </Link>
                        </li>
                        <li className="page-item">
                          <Link className="page-link" to="/">
                            ..
                          </Link>
                        </li>
                        <li className="page-item">
                          <Link className="page-link" to="/">
                            5
                          </Link>
                        </li>
                        <li className="page-item">
                          <Link className="page-link" to="/" aria-label="Next">
                            <span aria-hidden="true">
                              <FontAwesome name="caret-right" />
                            </span>
                          </Link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <WidgetTab />
              <WidgetTrendingNews />
              <div className="banner2 mb30">
                <Link to="/">
                  <img src={banner2} alt="thumb" />
                </Link>
              </div>
              {/* <MostShareWidget title="Most Share" /> */}
              {/* <NewsLetter /> */}
            </div>
          </div>
        </div>
      </div>
      <div className="space-70" />
      <BannerSection />

      {/* <style>{`
    .about_company{
      background:#fff;
      padding:40px;
      border-radius:10px;
      box-shadow:0 10px 25px rgba(0,0,0,.08);
      margin-bottom:40px;
    }

    .about_company h2{
      font-size:36px;
      font-weight:700;
      color:#111;
      margin-bottom:20px;
    }

    .about_company h4{
      font-size:22px;
      font-weight:600;
      margin-top:25px;
      margin-bottom:15px;
      color:#d10000;
    }

    .about_company p{
      font-size:16px;
      line-height:32px;
      color:#555;
      margin-bottom:15px;
      text-align:justify;
    }

    .about-list{
      margin:20px 0;
      padding-left:20px;
    }

    .about-list li{
      font-size:16px;
      line-height:32px;
      color:#444;
      list-style:disc;
    }

    .about_company .highlight{
      color:#d10000;
      font-weight:600;
    }

    @media(max-width:768px){
      .about_company{
        padding:25px;
      }

      .about_company h2{
        font-size:28px;
      }

      .about_company h4{
        font-size:20px;
      }

      .about_company p,
      .about-list li{
        font-size:15px;
        line-height:28px;
      }
    }
  `}</style> */}

      {/* Rest of your JSX */}
    </>
  );
}

export default About;
