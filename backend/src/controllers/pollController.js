import Poll from "../models/Poll.js";

export const createPoll = async (req, res) => {
  try {
    // if (!req.user || req.user.role !== "admin") {
    //   return res.status(403).json({ success: false, message: "Unauthorized" });
    // }

    const { question, options, start_date, end_date } = req.body;

    if (!question || !options || options.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Invalid poll data",
      });
    }

    const poll = await Poll.create(req.body);

    res.json({ success: true, data: poll });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.json({ success: true, data: polls });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updatePoll = async (req, res) => {
  try {
    const poll = await Poll.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found",
      });
    }

    res.json({ success: true, data: poll });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
