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
      // Each field stores an array of googleIds who reacted.
      // Count = array length. Toggle = add or remove the userId.
      like:  { type: [String], default: [] },
      love:  { type: [String], default: [] },
      laugh: { type: [String], default: [] },
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