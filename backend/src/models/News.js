import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],

    content: { type: Object, default: {} },

    slug: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    type: {
      type: Number,
      enum: [1, 2, 3],
      default: 2,
    },

    scheduledAt: {
      type: Date,
      default: null,
    },
    views: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },

    isScheduled: {
      type: Boolean,
      default: false,
    },

    youtubeUrl: { type: String, default: "" },

    videoType: { type: Number, default: 0 },

    thumbnail: { type: String, default: "" },
  },
  { timestamps: true },
);

newsSchema.index({ title: 1, author: 1 }, { unique: true });

export default mongoose.model("News", newsSchema);
