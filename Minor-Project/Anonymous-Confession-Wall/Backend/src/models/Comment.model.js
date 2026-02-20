import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    // The confession this comment belongs to
    confessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Confession",
      required: true,
      index: true,
    },

    // Comment author (anonymous in UI but we track for moderation)
    userId: {
      type: String,
      required: true,
    },

    // Comment text
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    // For nested comments - references parent comment
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
      index: true,
    },

    // Reactions on comments
    reactions: {
      like: { type: [String], default: [] },
    },
  },
  { timestamps: true }
);

commentSchema.index({ confessionId: 1, parentId: 1 });

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;