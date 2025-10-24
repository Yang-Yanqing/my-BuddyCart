const router = require("express").Router();
const {
  createCheckoutSession,
  captureOrder,
} = require("../controllers/checkout.controller");

router.post("/create-checkout-session", createCheckoutSession);

router.post("/capture-order", captureOrder);

module.exports = router;