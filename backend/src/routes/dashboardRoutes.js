
import express from "express";

import {
  getAdminDashboard,
  getEditorDashboard,
  getCorrespondenceDashboard,
  getSubscriberDashboard,
} from "../controllers/dashboardController.js";

import {
  verifyUser,
  verifySubscriber,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin - Role 1
router.get("/admin", verifyUser, getAdminDashboard);

// Editor - Role 2
router.get("/editor", verifyUser, getEditorDashboard);

// Correspondence - Role 3
router.get(
  "/correspondence",
  verifyUser,
  getCorrespondenceDashboard
);

// Subscriber / Customer
router.get(
  "/subscriber",
  verifySubscriber,
  getSubscriberDashboard
);

export default router;
