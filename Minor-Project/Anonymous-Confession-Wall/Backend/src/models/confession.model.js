import mongoose from "mongoose";

const confessionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },

    // Stored as bcrypt hash — never returned to client
    secretCode: {
      type: String,
      required: true,
    },

    reactions: {
      like:  { type: Number, default: 0 },
      love:  { type: Number, default: 0 },
      laugh: { type: Number, default: 0 },
    },

    // Google account ID of the poster
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

const Confession = mongoose.model("Confession", confessionSchema);

export default Confession;