
// import mongoose from "mongoose";

// const newsViewSchema = new mongoose.Schema(
//   {
//     newsId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "News",
//       required: true,
//       index: true,
//     },

//     viewedAt: {
//       type: Date,
//       default: Date.now,
//       required: true,
//     },
//   },
//   {
//     timestamps: false,
//   }
// );

// newsViewSchema.index({ viewedAt: -1 });
// newsViewSchema.index({ newsId: 1, viewedAt: -1 });

// export default mongoose.model("NewsView", newsViewSchema);




import mongoose from "mongoose";

const newsViewSchema = new mongoose.Schema(
  {
    newsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "News",
      required: true,
      index: true,
    },

    viewerId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    viewerType: {
      type: String,
      enum: ["user", "customer", "anonymous"],
      default: "anonymous",
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
newsViewSchema.index({ viewerId: 1, viewerType: 1, viewedAt: -1 });

export default mongoose.model("NewsView", newsViewSchema);

