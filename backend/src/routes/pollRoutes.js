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

const router = express.Router();

/* =========================
   ADMIN
========================= */

router.post("/savePoll", createPoll);

router.get("/admin", getAllPolls);

router.put("/admin/:id", updatePoll);

/* =========================
   WEBSITE
========================= */

router.get("/active", getActivePoll);

router.post("/:id/vote", votePoll);

router.get("/:id/results", pollResults);

export default router;
