import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const API = "https://api.hindustantvlive.com";

const PostOnePagination = ({ newsId, className }) => {
  const [previous, setPrevious] = useState(null);
  const [next, setNext] = useState(null);

  useEffect(() => {
    if (newsId) {
      getNews();
    }
  }, [newsId]);

  const getNews = async () => {
    try {
      const res = await fetch(`${API}/api/news/previous-next/${newsId}`);

      const data = await res.json();

      // if (data.success) {
      //   setPrevious(data.previous);
      //   setNext(data.next);
      // }
      if (data.status) {
        const videoPosts = data.data.filter((item) => item.videoType === 2);

        setPrevious(videoPosts.previous);
        setNext(videoPosts.next);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="next_prev">
      <div className="row">
        <div className="col-lg-6">
          {previous && (
            <div className={className || "next_prv_single border_left3"}>
              <p>PREVIOUS NEWS</p>

              <h3>
                <Link to={`/news/${previous.slug || previous._id}`}>
                  {previous.title}
                </Link>
              </h3>
            </div>
          )}
        </div>

        <div className="col-lg-6">
          {next && (
            <div className={className || "next_prv_single border_left3"}>
              <p>NEXT NEWS</p>

              <h3>
                <Link to={`/news/${next.slug || next._id}`}>{next.title}</Link>
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostOnePagination;

PostOnePagination.propTypes = {
  newsId: PropTypes.string.isRequired,
  className: PropTypes.string,
};
