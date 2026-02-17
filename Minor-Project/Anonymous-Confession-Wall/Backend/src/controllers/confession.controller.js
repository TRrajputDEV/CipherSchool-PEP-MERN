import bcrypt from "bcryptjs";
import Confession from "../models/confession.model.js";

// ── POST /api/confessions ────────────────────────────────────
const createConfession = async (req, res) => {
  try {
    const { text, secretCode } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ message: "Confession text is required." });
    }
    if (!secretCode || secretCode.length < 4) {
      return res.status(400).json({ message: "Secret code must be at least 4 characters." });
    }

    const hashedCode = await bcrypt.hash(secretCode, 10);

    const confession = await Confession.create({
      text: text.trim(),
      secretCode: hashedCode,
      userId: req.user.googleId,
    });

    // Return the exact same shape the frontend expects from getAllConfessions
    // reactions as counts, userReactions as empty array (creator hasn't reacted yet)
    return res.status(201).json({
      _id:          confession._id,
      text:         confession.text,
      userId:       confession.userId,
      createdAt:    confession.createdAt,
      updatedAt:    confession.updatedAt,
      reactions:    { like: 0, love: 0, laugh: 0 },
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
    const confessions = await Confession.find()
      .select("-secretCode")
      .sort({ createdAt: -1 });

    // Shape each confession: send counts + which types the current user reacted to
    const shaped = confessions.map((c) => {
      const validTypes = ["like", "love", "laugh"];
      return {
        _id:       c._id,
        text:      c.text,
        userId:    c.userId,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
        reactions: {
          like:  c.reactions.like.length,
          love:  c.reactions.love.length,
          laugh: c.reactions.laugh.length,
        },
        // Which types the requesting user has already reacted to
        userReactions: userId
          ? validTypes.filter((t) => c.reactions[t].includes(userId))
          : [],
      };
    });

    return res.status(200).json(shaped);
  } catch (err) {
    return res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// ── PUT /api/confessions/:id ─────────────────────────────────
const updateConfession = async (req, res) => {
  try {
    const { text, secretCode } = req.body;
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
    await confession.save();

    const validTypes = ["like", "love", "laugh"];

    // Same consistent shape as getAllConfessions and createConfession
    return res.status(200).json({
      _id:          confession._id,
      text:         confession.text,
      userId:       confession.userId,
      createdAt:    confession.createdAt,
      updatedAt:    confession.updatedAt,
      reactions: {
        like:  confession.reactions.like.length,
        love:  confession.reactions.love.length,
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

    // Verify secret code
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
    const { type } = req.body; // "like" | "love" | "laugh"
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
      // Unlike — remove userId from the array
      confession.reactions[type] = confession.reactions[type].filter(
        (id) => id !== userId
      );
    } else {
      // Like — add userId to the array
      confession.reactions[type].push(userId);
    }

    await confession.save();

    // Return counts (not the raw arrays) so the frontend stays simple
    const safeReactions = {
      like:  confession.reactions.like.length,
      love:  confession.reactions.love.length,
      laugh: confession.reactions.laugh.length,
    };

    // Also tell the client which types THIS user has currently reacted to
    const userReactions = validTypes.filter((t) =>
      confession.reactions[t].includes(userId)
    );

    return res.status(200).json({
      _id:         confession._id,
      text:        confession.text,
      reactions:   safeReactions,
      userReactions,              // e.g. ["like", "laugh"]
      userId:      confession.userId,
      createdAt:   confession.createdAt,
      updatedAt:   confession.updatedAt,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error.", error: err.message });
  }
};

export {
  createConfession,
  getAllConfessions,
  updateConfession,
  deleteConfession,
  reactToConfession,
};