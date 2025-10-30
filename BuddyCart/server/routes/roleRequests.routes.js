// routes/roleRequests.routes.js
const express = require("express");
const router = express.Router();

const {
  createRoleRequest,
  listRoleRequests,
  approveRoleRequest,
  rejectRoleRequest,
} = require("../controllers/roleRequests.controller");


const { requireAuth } = require("../middleware/requireAuth");
const { requireRole } = require("../middleware/requireAuth");


router.post("/", requireAuth,requireRole("admin"),createRoleRequest);


router.get("/", requireAuth, requireRole("admin"), listRoleRequests);
router.post("/:id/approve", requireAuth, requireRole("admin"), approveRoleRequest);
router.post("/:id/reject", requireAuth, requireRole("admin"), rejectRoleRequest);

module.exports = router;
