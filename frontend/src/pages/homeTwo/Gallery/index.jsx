// frontend/src/pages/Gallery.jsx
import React, { useEffect, useRef, useState } from "react";

const API = "https://api.bharat19express.com";

export default function Gallery() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const videoRefs = useRef([]);

  useEffect(() => {
    let cancelled = false;

    async function fetchGallery() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API}/api/gallery`);
        if (!response.ok) {
          throw new Error(`Request failed (${response.status})`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Unable to load gallery");
        }

        if (!cancelled) {
          setVideos(result.data || []);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchGallery();

    return () => {
      cancelled = true;
    };
  }, []);

  // Autoplay only while a video is visible.
  useEffect(() => {
    if (!videos.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;

          if (entry.isIntersecting) {
            video.muted = true;
            video.play().catch(() => {
              // Browser autoplay policies can block playback.
            });
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.6 },
    );

    videoRefs.current.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => observer.disconnect();
  }, [videos]);

  return (
    <main className="gallery-page">
      <style>{`
        .gallery-page {
          max-width: 1280px;
          margin: 0 auto;
          padding: 28px 18px 50px;
          color: #202124;
        }

        .gallery-heading {
          margin-bottom: 24px;
          border-bottom: 2px solid #e31e24;
          padding-bottom: 12px;
        }

        .gallery-heading h1 {
          margin: 0 0 7px;
          font-size: clamp(25px, 4vw, 36px);
          font-weight: 800;
        }

        .gallery-heading p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        .gallery-card {
          overflow: hidden;
          border: 1px solid #e7e7e7;
          border-radius: 10px;
          background: #fff;
          box-shadow: 0 3px 12px rgba(0,0,0,.06);
        }

        .gallery-video {
          display: block;
          width: 100%;
          aspect-ratio: 16 / 9;
          object-fit: contain;
          background: #111;
        }

        .gallery-title {
          margin: 0;
          padding: 13px 14px 15px;
          font-size: 17px;
          line-height: 1.45;
          font-weight: 700;
          overflow-wrap: anywhere;
        }

        .gallery-message {
          padding: 35px 12px;
          text-align: center;
          color: #666;
        }

        .gallery-error {
          color: #b42318;
        }

        @media (max-width: 900px) {
          .gallery-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
          }
        }

        @media (max-width: 560px) {
          .gallery-page {
            padding: 20px 12px 35px;
          }

          .gallery-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .gallery-title {
            font-size: 16px;
          }
        }
      `}</style>

      <header className="gallery-heading">
        <h1>Video Gallery</h1>
        <p>Latest videos, stories and updates</p>
      </header>

      {loading && <div className="gallery-message">Loading videos...</div>}

      {error && (
        <div className="gallery-message gallery-error">
          Unable to load videos: {error}
        </div>
      )}

      {!loading && !error && videos.length === 0 && (
        <div className="gallery-message">No videos published yet.</div>
      )}

      <section className="gallery-grid">
        {videos.map((item, index) => (
          <article className="gallery-card" key={item._id}>
            <video
              ref={(element) => {
                videoRefs.current[index] = element;
              }}
              className="gallery-video"
              src={item.videoUrl}
              muted
              autoPlay
              loop
              playsInline
              controls
              preload="metadata"
              title={item.title}
            >
              Your browser does not support video playback.
            </video>

            <h2 className="gallery-title">{item.title}</h2>
          </article>
        ))}
      </section>
    </main>
  );
}
