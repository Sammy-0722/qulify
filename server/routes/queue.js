const express = require('express');
const router = express.Router();
const Token = require("../models/Token");
const Admin = require("../models/Admin");
const authMiddleware = require("../middleware/auth");

// PUBLIC — user and admin both need this
router.get("/", async (req, res) => {
  try {
    const queue = await Token.find({});
    const admin = await Admin.findOne({});
    const currentServing = await Token.findOne({ status: 'serving' });
    res.status(200).json({
      queue,
      currentServing: currentServing ? currentServing.tokenNo : null,
      waiting: await Token.countDocuments({ status: "Waiting" }),
      servedtoday: await Token.countDocuments({ status: 'served' }),
      isOpen: admin ? admin.isOpen : true
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch queue" });
  }
});

// PUBLIC — user joins queue
router.post("/join", async (req, res) => {
  try {
    const admin = await Admin.findOne({});
    if (admin && !admin.isOpen) {
      return res.status(403).json({ error: "Queue is currently closed." });
    }
    const count = await Token.countDocuments();
    const newToken = await Token.create({
      tokenNo: count + 1,
      name: req.body.name
    });
    res.status(200).json(newToken);
  } catch (err) {
    res.status(500).json({ error: "Failed to join queue" });
  }
});

// PROTECTED — all routes below require admin login
router.post("/next", authMiddleware, async (req, res) => {
  try {
    const serving = await Token.findOne({ status: "serving" });
    if (serving) {
      serving.status = "served";
      await serving.save();
    }
    const waiting = await Token.findOne({ status: "Waiting" });
    if (!waiting) return res.json({ message: "No one is waiting" });
    waiting.status = "serving";
    waiting.counter = "C1";
    await waiting.save();
    res.status(200).json(waiting);
  } catch (err) {
    res.status(500).json({ error: "Failed to call next" });
  }
});

router.post("/hold", authMiddleware, async (req, res) => {
  try {
    const serving = await Token.findOne({ status: 'serving' });
    if (!serving) return res.json({ message: "No one is serving" });
    serving.status = "hold";
    await serving.save();
    res.status(200).json(serving);
  } catch (err) {
    res.status(500).json({ error: "Failed to hold" });
  }
});

router.post("/skip", authMiddleware, async (req, res) => {
  try {
    const serving = await Token.findOne({ status: "serving" });
    if (!serving) return res.json({ message: "No one is serving" });
    serving.status = "skipped";
    await serving.save();
    res.status(200).json(serving);
  } catch (err) {
    res.status(500).json({ error: "Failed to skip" });
  }
});

router.post("/reset", authMiddleware, async (req, res) => {
  try {
    await Token.deleteMany({});
    res.json({ message: "Queue reset" });
  } catch (err) {
    res.status(500).json({ error: "Failed to reset queue" });
  }
});

router.put("/status", authMiddleware, async (req, res) => {
  try {
    const { isOpen } = req.body;
    const admin = await Admin.findOneAndUpdate({}, { isOpen }, { new: true });
    res.status(200).json({ isOpen: admin.isOpen });
  } catch (err) {
    res.status(500).json({ error: "Failed to update status" });
  }
});

module.exports = router;