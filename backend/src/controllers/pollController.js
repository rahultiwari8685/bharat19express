import Poll from "../models/Poll.js";

export const createPoll = async (req, res) => {
  try {
    const { question, options, start_date, end_date, show_result } = req.body;

    if (
      !question ||
      !options ||
      options.length < 2 ||
      !start_date ||
      !end_date
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Question, at least 2 options, start date and end date are required",
      });
    }

    const poll = await Poll.create({
      question,
      options,
      start_date,
      end_date,

      // Make newly created poll active
      status: "active",

      show_result: show_result !== undefined ? show_result : true,
    });

    return res.status(201).json({
      success: true,
      message: "Poll created successfully",
      data: poll,
    });
  } catch (error) {
    console.error("Create Poll Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllPolls = async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: polls,
    });
  } catch (error) {
    console.error("Get All Polls Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updatePoll = async (req, res) => {
  try {
    const poll = await Poll.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!poll) {
      return res.status(404).json({
        success: false,
        message: "Poll not found",
      });
    }

    return res.json({
      success: true,
      message: "Poll updated successfully",
      data: poll,
    });
  } catch (error) {
    console.error("Update Poll Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
