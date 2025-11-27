const express = require("express");
const { getDbStatus } = require("../config/db");

const router = express.Router();


router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});


router.get("/ready", (req, res) => {
  const dbOk = getDbStatus();

  if (!dbOk) {
    return res.status(503).json({
      ready: false,
      dependencies: {
        mongo: "disconnected",
      },
    });
  }

  res.json({
    ready: true,
    dependencies: {
      mongo: "connected",
    },
  });
});

module.exports = router;
