// backend/routes/gallery.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Gallery = require("../models/Gallery");

const router = express.Router();

const uploadDir = path.join(process.cwd(), "uploads", "gallery");

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200 MB
  },
  fileFilter: (req, file, cb) => {
    const allowed = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];

    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only MP4, WebM, OGG or MOV videos are allowed"));
    }

    cb(null, true);
  },
});

// GET /api/gallery — published videos for website
router.get("/", async (req, res) => {
  try {
    const videos = await Gallery.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .select("title filename originalName mimeType createdAt");

    const baseUrl = "https://api.bharat19express.com";
    res.json({
      success: true,
      data: videos.map((video) => ({
        ...video.toObject(),
        videoUrl: `${baseUrl}/uploads/gallery/${encodeURIComponent(video.filename)}`,
      })),
    });
  } catch (error) {
    console.error("Gallery fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load gallery",
    });
  }
});

// POST /api/gallery — upload video from admin
// IMPORTANT: Add your existing admin-auth middleware here.
router.post("/", upload.single("video"), async (req, res) => {
  try {
    const title = req.body.title?.trim();

    if (!title || !req.file) {
      if (req.file) fs.unlinkSync(req.file.path);

      return res.status(400).json({
        success: false,
        message: "Video title and file are required",
      });
    }

    const video = await Gallery.create({
      title,
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      isPublished: req.body.isPublished === "true",
    });

    res.status(201).json({
      success: true,
      message: "Video uploaded successfully",
      data: video,
    });
  } catch (error) {
    console.error("Gallery upload error:", error);

    res.status(500).json({
      success: false,
      message: "Video upload failed",
    });
  }
});

module.exports = router;
