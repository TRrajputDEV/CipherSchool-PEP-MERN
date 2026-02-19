import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    displayName: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
    },

    // User preferences
    bio: {
      type: String,
      maxlength: 200,
      default: "",
    },

    // Track if user wants email notifications (for future feature)
    emailNotifications: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;