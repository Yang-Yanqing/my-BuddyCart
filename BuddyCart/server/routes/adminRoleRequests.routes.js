const router = require("express").Router();
const { requireAuth,requireRole } = require("../middleware/requireAuth");

const {
  listRoleRequests,
  approveRoleRequest,
  rejectRoleRequest,
} = require("../controllers/adminRoleRequest.controller");

router.use(requireAuth, requireRole("admin"));

router.get("/", listRoleRequests);

router.post("/:id/approve", approveRoleRequest);

router.post("/:id/reject", rejectRoleRequest);

module.exports = router;
