import Comment from "../models/Comment.model.js";
import Confession from "../models/confession.model.js";
import User from "../models/User.model.js";

// ── GET /api/confessions/:id/comments ─────────────────────────
export const getComments = async (req, res) => {
  try {
    const { id: confessionId } = req.params;

    // Fetch comments for this specific confession, newest first
    const comments = await Comment.find({ confessionId })
      .sort({ createdAt: -1 })
      .lean(); // .lean() makes them plain JavaScript objects for easier manipulation

    // To make the UI look good, we need the Display Names of the agents who commented.
    // We extract all unique userIds (Google IDs) from the comments:
    const userIds = [...new Set(comments.map((c) => c.userId))];
    
    // Fetch those specific users
    const users = await User.find({ googleId: { $in: userIds } }).lean();
    
    // Create a quick lookup map: { "12345": { displayName: "Tushar" } }
    const userMap = users.reduce((acc, user) => {
      acc[user.googleId] = user;
      return acc;
    }, {});

    // Attach the user data to each comment before sending to the frontend
    const shapedComments = comments.map((c) => ({
      ...c,
      user: {
        displayName: userMap[c.userId]?.displayName || "Unknown Agent",
      },
    }));

    return res.status(200).json({ comments: shapedComments });
  } catch (err) {
    return res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// ── POST /api/confessions/:id/comments ────────────────────────
export const addComment = async (req, res) => {
  try {
    const { id: confessionId } = req.params;
    const { text } = req.body;
    const userId = req.user.googleId; // Authenticated user

    if (!text?.trim()) {
      return res.status(400).json({ message: "Note text is required." });
    }

    // Ensure the confession actually exists
    const confession = await Confession.findById(confessionId);
    if (!confession) {
      return res.status(404).json({ message: "Evidence file not found." });
    }

    // Create the comment
    const comment = await Comment.create({
      confessionId,
      userId,
      text: text.trim(),
    });

    // IMPORTANT: Increment the comment count on the confession itself
    // so the main grid cards know how many comments exist without fetching them!
    confession.commentCount += 1;
    await confession.save();

    // Fetch the author's display name so the UI updates instantly with their name
    const user = await User.findOne({ googleId: userId }).lean();

    // Return the newly created comment shaped exactly like the GET route
    return res.status(201).json({
      comment: {
        ...comment.toObject(),
        user: {
          displayName: user?.displayName || "Agent",
        },
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error.", error: err.message });
  }
};


// ... (keep your existing getComments and addComment functions here) ...

// ── PUT /api/confessions/:id/comments/:commentId ─────────────────
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user.googleId;

    if (!text?.trim()) return res.status(400).json({ message: "Note text cannot be empty." });

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Note not found." });

    // Ensure the agent owns this note
    if (comment.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized to amend this note." });
    }

    comment.text = text.trim();
    await comment.save();

    return res.status(200).json({ message: "Note amended successfully.", comment });
  } catch (err) {
    return res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// ── DELETE /api/confessions/:id/comments/:commentId ──────────────
export const deleteComment = async (req, res) => {
  try {
    const { id: confessionId, commentId } = req.params;
    const userId = req.user.googleId;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Note not found." });

    // Ensure the agent owns this note
    if (comment.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized to redact this note." });
    }

    await comment.deleteOne();

    // Decrement the comment count on the main confession card
    await Confession.findByIdAndUpdate(confessionId, { $inc: { commentCount: -1 } });

    return res.status(200).json({ message: "Note redacted successfully." });
  } catch (err) {
    return res.status(500).json({ message: "Server error.", error: err.message });
  }
};