// admin/src/pages/GalleryManager.jsx
import React, { useState } from 'react'

const API = 'https://api.bharat19express.com'

export default function GalleryManager() {
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
  const [publish, setPublish] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleUpload(event) {
    event.preventDefault()
    setMessage('')

    if (!title.trim() || !file) {
      setMessage('Please enter a title and select a video.')
      return
    }

    const formData = new FormData()
    formData.append('title', title.trim())
    formData.append('video', file)
    formData.append('isPublished', String(publish))

    try {
      setLoading(true)

      // Connect your existing admin authentication here.
      // If your backend expects a Bearer token, add its Authorization header.
      const response = await fetch(`${API}/api/gallery`, {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Upload failed')
      }

      setMessage('Video uploaded successfully.')
      setTitle('')
      setFile(null)
      setPublish(true)

      const input = document.getElementById('gallery-video-file')
      if (input) input.value = ''
    } catch (err) {
      setMessage(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="gallery-admin">
      <style>{`
        .gallery-admin {
          max-width: 720px;
          margin: 30px auto;
          padding: 24px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 4px 18px rgba(0,0,0,.05);
          color: #222;
        }

        .gallery-admin h1 {
          margin: 0 0 8px;
          font-size: 26px;
        }

        .gallery-admin .subtitle {
          margin: 0 0 24px;
          color: #666;
          font-size: 14px;
        }

        .gallery-admin label {
          display: block;
          margin: 17px 0 7px;
          font-size: 14px;
          font-weight: 700;
        }

        .gallery-admin input[type="text"],
        .gallery-admin input[type="file"] {
          display: block;
          box-sizing: border-box;
          width: 100%;
          padding: 12px;
          border: 1px solid #d1d5db;
          border-radius: 7px;
          background: #fff;
          font-size: 14px;
        }

        .gallery-admin .publish-row {
          display: flex;
          align-items: center;
          gap: 9px;
          margin: 18px 0;
          font-size: 14px;
        }

        .gallery-admin .publish-row label {
          margin: 0;
        }

        .gallery-admin button {
          width: 100%;
          padding: 13px 16px;
          border: 0;
          border-radius: 7px;
          background: #e31e24;
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
        }

        .gallery-admin button:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .gallery-admin .message {
          margin: 16px 0 0;
          overflow-wrap: anywhere;
          font-size: 14px;
        }

        @media (max-width: 600px) {
          .gallery-admin {
            margin: 15px 10px;
            padding: 18px;
          }
        }
      `}</style>

      <h1>Manage Video Gallery</h1>
      <p className="subtitle">Upload a video, add its title and choose whether to publish it.</p>

      <form onSubmit={handleUpload}>
        <label htmlFor="gallery-video-title">Video title</label>
        <input
          id="gallery-video-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter video title"
          maxLength={200}
          required
        />

        <label htmlFor="gallery-video-file">Select video</label>
        <input
          id="gallery-video-file"
          type="file"
          accept="video/mp4,video/webm,video/ogg,video/quicktime"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
        />

        <div className="publish-row">
          <input
            id="gallery-publish"
            type="checkbox"
            checked={publish}
            onChange={(e) => setPublish(e.target.checked)}
          />
          <label htmlFor="gallery-publish">Publish immediately</label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload Video'}
        </button>

        {message && (
          <p className="message" role="status">
            {message}
          </p>
        )}
      </form>
    </div>
  )
}
