import Poll from "../models/Poll.js";
import PollVote from "../models/PollVote.js";

export const getActivePoll = async (req, res) => {
  try {
    const now = new Date();

    const poll = await Poll.findOne({
      start_date: { $lte: now },
      end_date: { $gte: now },
    });

    if (!poll) {
      return res.json({ success: true, data: null });
    }

    res.json({ success: true, data: poll });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const votePoll = async (req, res) => {
  try {
    const { option_index } = req.body;

    if (option_index === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "Option required" });
    }

    if (!req.user || !req.user.customerId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res
        .status(404)
        .json({ success: false, message: "Poll not found" });
    }

    if (option_index < 0 || option_index >= poll.options.length) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid option" });
    }

    // create vote (unique index should prevent duplicates)
    await PollVote.create({
      poll_id: poll._id,
      customer_id: req.user.customerId,
      option_index,
    });

    // atomic increment
    await Poll.findByIdAndUpdate(req.params.id, {
      $inc: { [`options.${option_index}.votes`]: 1 },
    });

    res.json({ success: true, message: "Vote submitted" });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.code === 11000 ? "Already voted" : err.message,
    });
  }
};

export const pollResults = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);

    if (!poll) {
      return res
        .status(404)
        .json({ success: false, message: "Poll not found" });
    }

    res.json({ success: true, data: poll });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
