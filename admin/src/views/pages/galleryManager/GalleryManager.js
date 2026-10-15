import React, { useEffect, useRef, useState } from 'react'

const API = 'https://api.bharat19express.com'

const MAX_FILE_SIZE = 200 * 1024 * 1024

const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
]

export default function GalleryManager() {
  const [title, setTitle] = useState('')
  const [file, setFile] = useState(null)
  const [publish, setPublish] = useState(true)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [dragging, setDragging] = useState(false)

  const fileInputRef = useRef(null)
  const xhrRef = useRef(null)
  const objectUrlRef = useRef(null)

  const isImage = file?.type.startsWith('image/')
  const isVideo = file?.type.startsWith('video/')

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
      }

      // Avoid aborting a completed upload during cleanup.
      xhrRef.current = null
    }
  }, [])

  function showMessage(text, type = 'error') {
    setMessage(text)
    setMessageType(type)
  }

  function selectFile(selectedFile) {
    setMessage('')
    setProgress(0)

    if (!selectedFile) return

    if (!ACCEPTED_TYPES.includes(selectedFile.type)) {
      showMessage(
        'Unsupported file format. Please choose a JPG, PNG, WEBP, AVIF, GIF, MP4, WEBM, OGG or MOV file.',
      )
      return
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      showMessage('File size must be 200 MB or less.')
      return
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
    }

    objectUrlRef.current = URL.createObjectURL(selectedFile)
    setFile(selectedFile)
  }

  function removeFile() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }

    setFile(null)
    setProgress(0)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function formatSize(bytes) {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  function handleUpload(event) {
    event.preventDefault()
    setMessage('')
    setProgress(0)

    if (!title.trim()) {
      showMessage('Please enter a title for this gallery item.')
      return
    }

    if (!file) {
      showMessage('Please select an image or video to upload.')
      return
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      showMessage('This file format is not supported.')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      showMessage('File size must be 200 MB or less.')
      return
    }

    const formData = new FormData()
    formData.append('title', title.trim())

    // Must match upload.single("media") in the backend route.
    formData.append('media', file)
    formData.append('isPublished', String(publish))

    setLoading(true)

    const xhr = new XMLHttpRequest()
    xhrRef.current = xhr

    xhr.open('POST', `${API}/api/gallery`)

    // Connect your existing admin authentication here.
    // Example:
    // xhr.setRequestHeader("Authorization", `Bearer ${yourToken}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProgress(Math.round((event.loaded / event.total) * 100))
      }
    }

    xhr.onload = () => {
      setLoading(false)
      xhrRef.current = null

      let result

      try {
        result = JSON.parse(xhr.responseText)
      } catch {
        showMessage('The server returned an unexpected response. Please try again.')
        return
      }

      if (xhr.status < 200 || xhr.status >= 300 || !result.success) {
        showMessage(result.message || 'Upload failed. Please try again.')
        return
      }

      setProgress(100)
      showMessage(
        `${isImage ? 'Image' : 'Video'} uploaded successfully${
          publish ? ' and published' : ' as a draft'
        }.`,
        'success',
      )

      setTitle('')
      removeFile()
      setPublish(true)
    }

    xhr.onerror = () => {
      setLoading(false)
      xhrRef.current = null
      showMessage('Network error. Check your connection and try again.')
    }

    xhr.onabort = () => {
      setLoading(false)
      xhrRef.current = null
      showMessage('Upload cancelled.')
    }

    xhr.ontimeout = () => {
      setLoading(false)
      xhrRef.current = null
      showMessage('The upload took too long. Please try again.')
    }

    xhr.timeout = 15 * 60 * 1000
    xhr.send(formData)
  }

  function cancelUpload() {
    xhrRef.current?.abort()
  }

  return (
    <div className="gm-page">
      <style>{`
        .gm-page {
          --gm-primary: #c91f2c;
          --gm-text: #182230;
          --gm-muted: #667085;
          --gm-border: #e4e7ec;
          max-width: 1050px;
          margin: 0 auto;
          padding: 28px 22px 50px;
          color: var(--gm-text);
          font-family: Inter, system-ui, -apple-system, sans-serif;
        }

        .gm-page * { box-sizing: border-box; }

        .gm-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          margin-bottom: 26px;
        }

        .gm-eyebrow {
          color: var(--gm-primary);
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 8px;
        }

        .gm-header h1 {
          font-size: clamp(25px, 4vw, 34px);
          line-height: 1.2;
          margin: 0 0 9px;
          font-weight: 800;
          letter-spacing: -0.8px;
        }

        .gm-header p {
          color: var(--gm-muted);
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
        }

        .gm-header-icon {
          display: grid;
          place-items: center;
          width: 58px;
          height: 58px;
          flex: 0 0 58px;
          background: #fff0f1;
          color: var(--gm-primary);
          border-radius: 17px;
          font-size: 27px;
        }

        .gm-card {
          background: #fff;
          border: 1px solid var(--gm-border);
          border-radius: 16px;
          box-shadow: 0 6px 24px rgba(16,24,40,.045);
          overflow: hidden;
        }

        .gm-card-head {
          padding: 22px 25px;
          border-bottom: 1px solid #eef0f3;
        }

        .gm-card-head h2 {
          margin: 0 0 6px;
          font-size: 18px;
          font-weight: 750;
        }

        .gm-card-head p {
          margin: 0;
          color: var(--gm-muted);
          font-size: 13px;
          line-height: 1.5;
        }

        .gm-form { padding: 25px; }

        .gm-field { margin-bottom: 24px; }

        .gm-label {
          display: block;
          margin-bottom: 9px;
          font-size: 13px;
          font-weight: 750;
          color: #344054;
        }

        .gm-required { color: var(--gm-primary); }

        .gm-input {
          width: 100%;
          min-height: 47px;
          padding: 12px 14px;
          border: 1px solid #d0d5dd;
          border-radius: 9px;
          color: var(--gm-text);
          background: #fff;
          font: inherit;
          font-size: 14px;
          outline: none;
          transition: border-color .2s, box-shadow .2s;
        }

        .gm-input:focus {
          border-color: var(--gm-primary);
          box-shadow: 0 0 0 3px rgba(201,31,44,.1);
        }

        .gm-help {
          display: block;
          margin-top: 8px;
          color: var(--gm-muted);
          font-size: 12px;
          line-height: 1.6;
        }

        .gm-drop {
          min-height: 210px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          border: 1.5px dashed #c8cdd5;
          border-radius: 12px;
          background: #fafbfc;
          transition: border-color .2s, background .2s;
          cursor: pointer;
        }

        .gm-drop:hover, .gm-drop.gm-dragging {
          border-color: var(--gm-primary);
          background: #fff7f7;
        }

        .gm-drop-icon {
          width: 50px;
          height: 50px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #fff0f1;
          color: var(--gm-primary);
          font-size: 24px;
          margin-bottom: 13px;
        }

        .gm-drop strong {
          font-size: 15px;
          margin-bottom: 7px;
        }

        .gm-drop span {
          font-size: 12px;
          color: var(--gm-muted);
          line-height: 1.6;
        }

        .gm-browse {
          color: var(--gm-primary);
          font-weight: 750;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .gm-file {
          margin-top: 15px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 14px;
          border: 1px solid var(--gm-border);
          border-radius: 12px;
        }

        .gm-preview {
          width: 90px;
          height: 72px;
          flex: 0 0 90px;
          background: #f2f4f7;
          border-radius: 8px;
          overflow: hidden;
        }

        .gm-preview img, .gm-preview video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .gm-file-info {
          min-width: 0;
          flex: 1;
        }

        .gm-file-name {
          font-size: 13px;
          font-weight: 750;
          overflow-wrap: anywhere;
          margin-bottom: 6px;
        }

        .gm-file-meta {
          font-size: 12px;
          color: var(--gm-muted);
        }

        .gm-remove {
          border: 1px solid #f0c6ca;
          color: #b4232d;
          background: #fff;
          border-radius: 8px;
          padding: 8px 10px;
          font-weight: 700;
          font-size: 12px;
          cursor: pointer;
        }

        .gm-publish {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          border: 1px solid var(--gm-border);
          border-radius: 11px;
          background: #fcfcfd;
        }

        .gm-publish input {
          width: 17px;
          height: 17px;
          margin: 2px 0 0;
          accent-color: var(--gm-primary);
          flex: 0 0 auto;
        }

        .gm-publish label { cursor: pointer; flex: 1; }

        .gm-publish strong {
          display: block;
          font-size: 13px;
          margin-bottom: 5px;
        }

        .gm-publish small {
          display: block;
          font-size: 12px;
          color: var(--gm-muted);
          line-height: 1.6;
        }

        .gm-progress {
          margin-top: 20px;
          padding: 16px;
          border: 1px solid var(--gm-border);
          border-radius: 11px;
          background: #fcfcfd;
        }

        .gm-progress-top {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          font-size: 13px;
          margin-bottom: 11px;
        }

        .gm-progress-top strong { font-weight: 750; }

        .gm-progress-track {
          width: 100%;
          height: 8px;
          background: #eaecf0;
          border-radius: 99px;
          overflow: hidden;
        }

        .gm-progress-fill {
          height: 100%;
          background: var(--gm-primary);
          border-radius: 99px;
          transition: width .2s ease;
        }

        .gm-progress-note {
          display: block;
          margin-top: 9px;
          font-size: 12px;
          color: var(--gm-muted);
        }

        .gm-message {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          margin-top: 20px;
          padding: 13px 15px;
          border-radius: 9px;
          font-size: 13px;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .gm-message.success {
          background: #ecfdf3;
          color: #027a48;
          border: 1px solid #abefc6;
        }

        .gm-message.error {
          background: #fff1f2;
          color: #b4232d;
          border: 1px solid #fecdd3;
        }

        .gm-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 25px;
        }

        .gm-button {
          min-height: 47px;
          padding: 12px 22px;
          border-radius: 9px;
          font: inherit;
          font-size: 14px;
          font-weight: 750;
          cursor: pointer;
          transition: background .2s, opacity .2s;
        }

        .gm-button-primary {
          min-width: 185px;
          border: 1px solid var(--gm-primary);
          background: var(--gm-primary);
          color: #fff;
        }

        .gm-button-primary:hover:not(:disabled) {
          background: #a91824;
        }

        .gm-button-secondary {
          border: 1px solid var(--gm-border);
          background: #fff;
          color: #344054;
        }

        .gm-button:disabled {
          opacity: .55;
          cursor: not-allowed;
        }

        .gm-footer-note {
          color: var(--gm-muted);
          text-align: center;
          font-size: 12px;
          line-height: 1.7;
          margin: 17px 0 0;
        }

        @media (max-width: 600px) {
          .gm-page { padding: 20px 12px 35px; }
          .gm-header { align-items: flex-start; }
          .gm-header-icon { width: 46px; height: 46px; flex-basis: 46px; }
          .gm-card-head { padding: 18px; }
          .gm-form { padding: 18px; }
          .gm-drop { min-height: 190px; padding: 18px; }
          .gm-file { flex-wrap: wrap; }
          .gm-preview { width: 72px; height: 62px; flex-basis: 72px; }
          .gm-remove { margin-left: auto; }
          .gm-actions { flex-direction: column; }
          .gm-button { width: 100%; }
        }
      `}</style>

      <header className="gm-header">
        <div>
          <div className="gm-eyebrow">Media management</div>
          <h1>Gallery Manager</h1>
          <p>Upload and manage the images and videos displayed in your gallery.</p>
        </div>

        <div className="gm-header-icon" aria-hidden="true">
          ▧
        </div>
      </header>

      <section className="gm-card">
        <div className="gm-card-head">
          <h2>Add gallery media</h2>
          <p>Complete the details below to add new media to Bharat19Express.</p>
        </div>

        <form className="gm-form" onSubmit={handleUpload}>
          <div className="gm-field">
            <label className="gm-label" htmlFor="gm-title">
              Media title <span className="gm-required">*</span>
            </label>

            <input
              id="gm-title"
              className="gm-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Latest news from Lucknow"
              maxLength={200}
              required
              disabled={loading}
            />

            <span className="gm-help">Use a clear, descriptive title. Maximum 200 characters.</span>
          </div>

          <div className="gm-field">
            <span className="gm-label">
              Select image or video <span className="gm-required">*</span>
            </span>

            <input
              ref={fileInputRef}
              id="gm-file"
              type="file"
              accept={ACCEPTED_TYPES.join(',')}
              hidden
              disabled={loading}
              onChange={(e) => selectFile(e.target.files?.[0] || null)}
            />

            <label
              htmlFor="gm-file"
              className={`gm-drop ${dragging ? 'gm-dragging' : ''}`}
              onDragOver={(e) => {
                e.preventDefault()
                if (!loading) setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragging(false)
                if (!loading) selectFile(e.dataTransfer.files?.[0])
              }}
              style={{
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              <div className="gm-drop-icon" aria-hidden="true">
                {file ? (isImage ? '▧' : '▶') : '↑'}
              </div>

              <strong>{file ? 'Media selected' : 'Drag and drop your file here'}</strong>

              <span>
                {file ? (
                  <>
                    <span className="gm-browse">Choose another file</span>
                  </>
                ) : (
                  <>
                    or <span className="gm-browse">browse files</span>
                    <br />
                    JPG, PNG, WEBP, AVIF, GIF, MP4, WEBM, OGG, MOV
                    <br />
                    Maximum file size: 200 MB
                  </>
                )}
              </span>
            </label>

            {file && (
              <div className="gm-file">
                <div className="gm-preview">
                  {isImage ? (
                    <img src={objectUrlRef.current || ''} alt="Selected preview" />
                  ) : (
                    <video src={objectUrlRef.current || ''} muted playsInline />
                  )}
                </div>

                <div className="gm-file-info">
                  <div className="gm-file-name">{file.name}</div>
                  <div className="gm-file-meta">
                    {isImage ? 'Image' : 'Video'} · {formatSize(file.size)}
                  </div>
                </div>

                <button type="button" className="gm-remove" disabled={loading} onClick={removeFile}>
                  Remove
                </button>
              </div>
            )}
          </div>

          <div className="gm-publish">
            <input
              id="gm-publish"
              type="checkbox"
              checked={publish}
              disabled={loading}
              onChange={(e) => setPublish(e.target.checked)}
            />

            <label htmlFor="gm-publish">
              <strong>Publish immediately</strong>
              <small>
                {publish
                  ? 'This item will be visible in the public gallery after upload.'
                  : 'Save this item as a draft. It will not appear in the public gallery yet.'}
              </small>
            </label>
          </div>

          {loading && (
            <div className="gm-progress" role="status" aria-live="polite">
              <div className="gm-progress-top">
                <strong>Uploading your {isImage ? 'image' : 'video'}…</strong>
                <strong>{progress}%</strong>
              </div>

              <div
                className="gm-progress-track"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                aria-label="Upload progress"
              >
                <div className="gm-progress-fill" style={{ width: `${progress}%` }} />
              </div>

              <span className="gm-progress-note">
                Please keep this page open until the upload finishes.
              </span>

              <button
                type="button"
                className="gm-button gm-button-secondary"
                style={{ marginTop: 14 }}
                onClick={cancelUpload}
              >
                Cancel upload
              </button>
            </div>
          )}

          {message && (
            <div
              className={`gm-message ${messageType}`}
              role={messageType === 'error' ? 'alert' : 'status'}
            >
              <span aria-hidden="true">{messageType === 'success' ? '✓' : '!'}</span>
              <span>{message}</span>
            </div>
          )}

          <div className="gm-actions">
            <button
              type="button"
              className="gm-button gm-button-secondary"
              disabled={loading && !file}
              onClick={() => {
                if (loading) return
                setTitle('')
                removeFile()
                setPublish(true)
                setMessage('')
              }}
            >
              Reset form
            </button>

            <button type="submit" className="gm-button gm-button-primary" disabled={loading}>
              {loading
                ? `Uploading… ${progress}%`
                : `↑ Upload ${file ? (isImage ? 'Image' : 'Video') : 'Media'}`}
            </button>
          </div>

          <p className="gm-footer-note">Supported media only · Maximum 200 MB per file</p>
        </form>
      </section>
    </div>
  )
}
