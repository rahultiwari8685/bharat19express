
import mongoose from "mongoose";

const newsViewSchema = new mongoose.Schema(
  {
    newsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "News",
      required: true,
      index: true,
    },

    viewedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: false,
  }
);

newsViewSchema.index({ viewedAt: -1 });
newsViewSchema.index({ newsId: 1, viewedAt: -1 });

export default mongoose.model("NewsView", newsViewSchema);
