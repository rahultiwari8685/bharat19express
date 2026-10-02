import express from "express";

import {
  createPoll,
  getAllPolls,
  updatePoll,
} from "../controllers/pollController.js";

import {
  getActivePoll,
  votePoll,
  pollResults,
} from "../controllers/publicPollController.js";

import { verifySubscriber } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/savePoll", createPoll);

router.get("/admin", getAllPolls);

router.put("/admin/:id", updatePoll);

router.get("/active", getActivePoll);

// Customer must be logged in
router.post("/:id/vote", verifySubscriber, votePoll);

router.get("/:id/results", pollResults);

export default router;
