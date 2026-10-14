import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Gallery from "../models/Gallery.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../../uploads/gallery");

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];

    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Unsupported video format"));
    }

    cb(null, true);
  },
});

router.get("/", async (req, res) => {
  try {
    const videos = await Gallery.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: videos.map((video) => ({
        ...video,
        videoUrl: `https://api.bharat19express.com/uploads/gallery/${encodeURIComponent(video.filename)}`,
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

// IMPORTANT: Add your existing admin-auth middleware before upload.
router.post("/", upload.single("video"), async (req, res) => {
  try {
    const title = req.body.title?.trim();

    if (!title || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Title and video are required",
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

export default router;
