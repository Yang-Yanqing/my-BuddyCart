const express = require("express");
const router = express.Router();
const { listProducts } = require("../controllers/product.control");

router.get("/", listProducts);
module.exports = router;
