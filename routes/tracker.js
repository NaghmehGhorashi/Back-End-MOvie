const express = require("express");
const router = express.Router();
const { insertTrackingData } = require("../tracking");

router.post("/", async (req, res) => {
  // Remove "/api/track"
  try {
    const ip =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
    const { screenResolution, userAgent } = req.body;

    console.log("📡 Tracker endpoint hit:");
    console.log(`→ IP: ${ip}`);
    console.log(`→ Screen Resolution: ${screenResolution}`);
    console.log(`→ User Agent: ${userAgent}`);

    await insertTrackingData({
      ipAddress: ip,
      screenResolution,
      userAgent,
      timestamp: new Date(),
    });

    res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error("Tracking error:", err);
    res.status(500).json({ status: "error", message: "Tracking failed" });
  }
});

module.exports = router;
