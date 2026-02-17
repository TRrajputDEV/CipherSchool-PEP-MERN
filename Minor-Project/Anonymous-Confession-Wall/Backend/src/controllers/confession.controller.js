import bcrypt from "bcryptjs";
import Confession from "../models/confession.model.js";

// ── POST /api/confessions ────────────────────────────────────
const createConfession = async (req, res) => {
  try {
    const { text, secretCode } = req.body;

    // Basic validation
    if (!text?.trim()) {
      return res.status(400).json({ message: "Confession text is required." });
    }
    if (!secretCode || secretCode.length < 4) {
      return res.status(400).json({ message: "Secret code must be at least 4 characters." });
    }

    // Hash secret code before saving
    const hashedCode = await bcrypt.hash(secretCode, 10);

    const confession = await Confession.create({
      text: text.trim(),
      secretCode: hashedCode,
      userId: req.user.googleId,
    });

    // Never send the hashed code back to client
    const { secretCode: _hidden, ...safeData } = confession.toObject();

    return res.status(201).json(safeData);
  } catch (err) {
    return res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// ── GET /api/confessions ─────────────────────────────────────
const getAllConfessions = async (req, res) => {
  try {
    // -secretCode ensures the hash is never sent to frontend
    const confessions = await Confession.find()
      .select("-secretCode")
      .sort({ createdAt: -1 });

    return res.status(200).json(confessions);
  } catch (err) {
    return res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// ── PUT /api/confessions/:id ─────────────────────────────────
const updateConfession = async (req, res) => {
  try {
    const { text, secretCode } = req.body;

    if (!secretCode) {
      return res.status(400).json({ message: "Secret code is required." });
    }

    const confession = await Confession.findById(req.params.id);
    if (!confession) {
      return res.status(404).json({ message: "Confession not found." });
    }

    // Verify secret code against stored hash
    const isMatch = await bcrypt.compare(secretCode, confession.secretCode);
    if (!isMatch) {
      return res.status(403).json({ message: "Incorrect secret code." });
    }

    if (text?.trim()) confession.text = text.trim();
    await confession.save();

    const { secretCode: _hidden, ...safeData } = confession.toObject();
    return res.status(200).json(safeData);
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
    const { type } = req.body; // expects: "like" | "love" | "laugh"

    const validTypes = ["like", "love", "laugh"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid reaction type. Use: like, love, or laugh." });
    }

    const confession = await Confession.findByIdAndUpdate(
      req.params.id,
      { $inc: { [`reactions.${type}`]: 1 } }, // increment the specific reaction
      { new: true }
    ).select("-secretCode");

    if (!confession) {
      return res.status(404).json({ message: "Confession not found." });
    }

    return res.status(200).json(confession);
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