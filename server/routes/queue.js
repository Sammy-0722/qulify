const express = require('express');
const router = express.Router();
const Token = require("../models/Token");
const Admin = require("../models/Admin");
const authMiddleware = require("../middleware/auth");

// PUBLIC — user and admin both need this


// PUBLIC — user joins queue
// GET queue for specific admin
// GET queue for specific admin
router.get("/:adminId", authMiddleware, async (req, res) => {
  try {
    const { adminId } = req.params;
    const tokens = await Token.find({ adminId }).sort({ tokenNo: 1 });
    const admin = await Admin.findById(adminId);
    const currentServing = await Token.findOne({ adminId, status: 'Serving' });
    
    res.status(200).json({
      queue: tokens,
      currentServing: currentServing ? currentServing.tokenNo : null,
      waiting: await Token.countDocuments({ adminId, status: "Waiting" }),
      servedToday: await Token.countDocuments({ adminId, status: 'Served' }),
      isOpen: admin ? admin.isOpen : true
    });
  } catch (err) {
    console.error("Fetch queue error:", err);
    res.status(500).json({ error: "Failed to fetch queue" });
  }
});
// JOIN queue - public route (no auth needed for customers)
router.post("/join/:adminId", async (req, res) => {
  try {
    const { adminId } = req.params;
    const { name, note } = req.body;

    // Check if admin exists and queue is open
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    if (!admin.isOpen) {
      return res.status(403).json({ error: "Queue is currently closed" });
    }

    // Get the highest token number for this admin
    const lastToken = await Token.findOne({ adminId }).sort({ tokenNo: -1 });
    const newTokenNo = lastToken ? lastToken.tokenNo + 1 : 1;

    // Create new token
    const token = new Token({
      tokenNo: newTokenNo,
      name,
      note: note || "",
      adminId,
      status: "Waiting"
    });

    await token.save();
    res.status(201).json(token);
  } catch (err) {
    console.error("Join queue error:", err);
    res.status(500).json({ error: "Failed to join queue" });
  }
});

// Next token
router.put("/next/:adminId", authMiddleware, async (req, res) => {
  try {
    // Mark ALL currently serving tokens as Served (not just one)
    await Token.updateMany(
      { adminId: req.params.adminId, status: "Serving" },
      { status: "Served" }
    );

    // Pull next waiting token
    const token = await Token.findOneAndUpdate(
      { adminId: req.params.adminId, status: "Waiting" },
      { status: "Serving", counter: "C-1" },
      { new: true, sort: { tokenNo: 1 } }
    );

    if (!token) return res.status(404).json({ error: "No waiting tokens." });
    res.status(200).json(token);
  } catch (err) {
    res.status(500).json({ error: "Failed to get next token" });
  }
});
// Hold token
router.put("/hold/:adminId", authMiddleware, async (req, res) => {
  try {
    const token = await Token.findOneAndUpdate(
      { adminId: req.params.adminId, status: "Serving" },
      { status: "Hold" },
      { new: true }
    );
    if (!token) return res.status(404).json({ error: "No token currently serving." });
    res.status(200).json(token);
  } catch (err) {
    res.status(500).json({ error: "Failed to hold token" });
  }
});

// Skip token
router.put("/skip/:adminId", authMiddleware, async (req, res) => {
  try {
    const token = await Token.findOneAndUpdate(
      { adminId: req.params.adminId, status: "Serving" },
      { status: "Skipped" },
      { new: true }
    );
    if (!token) return res.status(404).json({ error: "No token currently serving." });
    res.status(200).json(token);
  } catch (err) {
    res.status(500).json({ error: "Failed to skip token" });
  }
});

// Reset queue
router.delete("/reset/:adminId",  authMiddleware,async (req, res) => {
  try {
    await Token.deleteMany({ adminId: req.params.adminId });
    res.status(200).json({ message: "Queue reset successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to reset queue" });
  }
});
router.put("/status/:adminId", authMiddleware, async (req, res) => {
  try {
    const { isOpen } = req.body;
    const { adminId } = req.params;
    
    // Find and update the specific admin's queue status
    const admin = await Admin.findByIdAndUpdate(
      adminId,
      { isOpen },
      { new: true }
    );
    
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    
    res.status(200).json({ isOpen: admin.isOpen });
  } catch (err) {
    console.error("Status update error:", err);
    res.status(500).json({ error: "Failed to update status" });
  }
});
router.put("/resume/:adminId", authMiddleware, async (req, res) => {
  try {
    const token = await Token.findOneAndUpdate(
      { adminId: req.params.adminId, status: "Hold" },
      { status: "Waiting" },
      { new: true, sort: { tokenNo: 1 } }
    );
    if (!token) return res.status(404).json({ error: "No token on hold." });
    res.status(200).json(token);
  } catch (err) {
    res.status(500).json({ error: "Failed to resume token" });
  }
});

module.exports = router;