import bcrypt from "bcryptjs";
import Confession from "../models/confession.model.js";

// Predefined tags
const PREDEFINED_TAGS = [
  "relationship", "work", "family", "friendship", "secret",
  "regret", "confession", "advice", "rant", "achievement"
];

// ── POST /api/confessions ────────────────────────────────────
const createConfession = async (req, res) => {
  try {
    const { text, secretCode, tags = [], status = "published" } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ message: "Confession text is required." });
    }
    if (!secretCode || secretCode.length < 4) {
      return res.status(400).json({ message: "Secret code must be at least 4 characters." });
    }

    // Normalize tags: lowercase, trim, max 5
    const normalizedTags = tags
      .map((t) => t.toLowerCase().trim())
      .filter((t) => t.length > 0)
      .slice(0, 5);

    const hashedCode = await bcrypt.hash(secretCode, 10);

    const confession = await Confession.create({
      text: text.trim(),
      secretCode: hashedCode,
      userId: req.user.googleId,
      tags: normalizedTags,
      status: status === "draft" ? "draft" : "published",
    });

    return res.status(201).json({
      _id: confession._id,
      text: confession.text,
      userId: confession.userId,
      tags: confession.tags,
      status: confession.status,
      commentCount: 0,
      viewCount: 0,
      createdAt: confession.createdAt,
      updatedAt: confession.updatedAt,
      reactions: { like: 0, love: 0, laugh: 0 },
      userReactions: [],
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// ── GET /api/confessions ─────────────────────────────────────
const getAllConfessions = async (req, res) => {
  try {
    const userId = req.user?.googleId || null;
    const { tag, search, page = 1, limit = 12 } = req.query;

    const query = { status: "published" };

    // Filter by tag
    if (tag) query.tags = tag.toLowerCase();

    // Search in text
    if (search) {
      query.text = { $regex: search, $options: "i" };
    }

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
      commentCount: c.commentCount,
      viewCount: c.viewCount,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      reactions: {
        like: c.reactions.like.length,
        love: c.reactions.love.length,
        laugh: c.reactions.laugh.length,
      },
      userReactions: userId
        ? validTypes.filter((t) => c.reactions[t].includes(userId))
        : [],
    }));

    return res.status(200).json({
      confessions: shaped,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// ── PUT /api/confessions/:id ─────────────────────────────────
const updateConfession = async (req, res) => {
  try {
    const { text, secretCode, tags, status } = req.body;
    const userId = req.user.googleId;

    if (!secretCode) {
      return res.status(400).json({ message: "Secret code is required." });
    }

    const confession = await Confession.findById(req.params.id);
    if (!confession) {
      return res.status(404).json({ message: "Confession not found." });
    }

    const isMatch = await bcrypt.compare(secretCode, confession.secretCode);
    if (!isMatch) {
      return res.status(403).json({ message: "Incorrect secret code." });
    }

    if (text?.trim()) confession.text = text.trim();
    if (tags) {
      confession.tags = tags
        .map((t) => t.toLowerCase().trim())
        .filter((t) => t.length > 0)
        .slice(0, 5);
    }
    if (status) confession.status = status;

    await confession.save();

    const validTypes = ["like", "love", "laugh"];

    return res.status(200).json({
      _id: confession._id,
      text: confession.text,
      userId: confession.userId,
      tags: confession.tags,
      status: confession.status,
      commentCount: confession.commentCount,
      viewCount: confession.viewCount,
      createdAt: confession.createdAt,
      updatedAt: confession.updatedAt,
      reactions: {
        like: confession.reactions.like.length,
        love: confession.reactions.love.length,
        laugh: confession.reactions.laugh.length,
      },
      userReactions: validTypes.filter((t) =>
        confession.reactions[t].includes(userId)
      ),
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// ── DELETE /api/confessions/:id ──────────────────────────────
const deleteConfession = async (req, res) => {
  try {
    const { secretCode } = req.body;

    if (!secretCode) {
      return res.status(400).json({ message: "Secret code is required." });
    }

    const confession = await Confession.findById(req.params.id);
    if (!confession) {
      return res.status(404).json({ message: "Confession not found." });
    }

    const isMatch = await bcrypt.compare(secretCode, confession.secretCode);
    if (!isMatch) {
      return res.status(403).json({ message: "Incorrect secret code." });
    }

    await confession.deleteOne();
    return res.status(200).json({ message: "Confession deleted successfully." });
  } catch (err) {
    return res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// ── POST /api/confessions/:id/react ─────────────────────────
const reactToConfession = async (req, res) => {
  try {
    const { type } = req.body;
    const userId = req.user.googleId;

    const validTypes = ["like", "love", "laugh"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid reaction type." });
    }

    const confession = await Confession.findById(req.params.id);
    if (!confession) {
      return res.status(404).json({ message: "Confession not found." });
    }

    const alreadyReacted = confession.reactions[type].includes(userId);

    if (alreadyReacted) {
      confession.reactions[type] = confession.reactions[type].filter(
        (id) => id !== userId
      );
    } else {
      confession.reactions[type].push(userId);
    }

    await confession.save();

    const safeReactions = {
      like: confession.reactions.like.length,
      love: confession.reactions.love.length,
      laugh: confession.reactions.laugh.length,
    };

    const userReactions = validTypes.filter((t) =>
      confession.reactions[t].includes(userId)
    );

    return res.status(200).json({
      _id: confession._id,
      text: confession.text,
      reactions: safeReactions,
      userReactions,
      tags: confession.tags,
      commentCount: confession.commentCount,
      userId: confession.userId,
      createdAt: confession.createdAt,
      updatedAt: confession.updatedAt,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// ── GET /api/confessions/tags/predefined ────────────────────
const getPredefinedTags = (req, res) => {
  return res.json({ tags: PREDEFINED_TAGS });
};

export {
  createConfession,
  getAllConfessions,
  updateConfession,
  deleteConfession,
  reactToConfession,
  getPredefinedTags,
  PREDEFINED_TAGS,
};