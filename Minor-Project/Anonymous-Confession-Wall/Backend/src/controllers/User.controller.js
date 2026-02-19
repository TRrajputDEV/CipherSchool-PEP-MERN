import User from "../models/User.model.js";
import Confession from "../models/confession.model.js";

// GET /api/users/me — get current user profile with stats
const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.googleId;

    // Find or create user record
    let user = await User.findOne({ googleId: userId });
    if (!user) {
      user = await User.create({
        googleId: userId,
        email: req.user.email,
        displayName: req.user.displayName,
        avatar: req.user.avatar,
      });
    }

    // Get user stats
    const [publishedCount, draftCount] = await Promise.all([
      Confession.countDocuments({ userId, status: "published" }),
      Confession.countDocuments({ userId, status: "draft" }),
    ]);

    return res.json({
      user: {
        googleId: user.googleId,
        email: user.email,
        displayName: user.displayName,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt,
      },
      stats: {
        published: publishedCount,
        drafts: draftCount,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT /api/users/me — update profile
const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.googleId;
    const { bio } = req.body;

    const user = await User.findOneAndUpdate(
      { googleId: userId },
      { bio: bio?.trim() || "" },
      { new: true, upsert: true }
    );

    return res.json({
      googleId: user.googleId,
      displayName: user.displayName,
      avatar: user.avatar,
      bio: user.bio,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /api/users/me/confessions — get all user's confessions (published + drafts)
const getMyConfessions = async (req, res) => {
  try {
    const userId = req.user.googleId;
    const { status, page = 1, limit = 12 } = req.query;

    const query = { userId };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [confessions, total] = await Promise.all([
      Confession.find(query)
        .select("-secretCode")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Confession.countDocuments(query),
    ]);

    const validTypes = ["like", "love", "laugh"];
    const shaped = confessions.map((c) => ({
      _id: c._id,
      text: c.text,
      userId: c.userId,
      tags: c.tags,
      status: c.status,
      commentCount: c.commentCount,
      viewCount: c.viewCount,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      reactions: {
        like: c.reactions.like.length,
        love: c.reactions.love.length,
        laugh: c.reactions.laugh.length,
      },
      userReactions: validTypes.filter((t) => c.reactions[t].includes(userId)),
    }));

    return res.json({
      confessions: shaped,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

export { getMyProfile, updateMyProfile, getMyConfessions };