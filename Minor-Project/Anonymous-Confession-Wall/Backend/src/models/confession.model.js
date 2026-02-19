import mongoose from "mongoose";

const confessionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    secretCode: {
      type: String,
      required: true,
    },

    reactions: {
      like:  { type: [String], default: [] },
      love:  { type: [String], default: [] },
      laugh: { type: [String], default: [] },
    },

    userId: {
      type: String,
      required: true,
      index: true,
    },

    // ── NEW FIELDS ────────────────────────────────────────────

    // Tags for categorization (lowercase, max 5 per post)
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 5,
        message: "Maximum 5 tags allowed",
      },
    },

    // Draft or published
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
      index: true,
    },

    // Denormalized comment count for performance
    commentCount: {
      type: Number,
      default: 0,
    },

    // View count
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Compound indexes for efficient queries
confessionSchema.index({ status: 1, createdAt: -1 });
confessionSchema.index({ userId: 1, status: 1 });
confessionSchema.index({ tags: 1, status: 1 });

const Confession = mongoose.model("Confession", confessionSchema);

export default Confession;