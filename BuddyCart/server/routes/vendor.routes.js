const router = require("express").Router();
const { requireAuth, requireRole } = require("../middleware/requireAuth");
const { Product } = require("../models/Product.model");


router.get("/my-shop", requireAuth, requireRole("vendor"), async (req, res, next) => {
  try {
    const userId = req.user.id;
    const products = await Product.find({ owner: userId })
      .sort({ createdAt: -1 })
      .select("title price category stock rating thumbnail");

    res.json({
      count: products.length,
      products,
    });
  } catch (err) {
    console.error("Error in /my-shop:", err);
    next(err);
  }
});


router.post("/my-shop", requireAuth, requireRole("vendor"), async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, description, category, price, stock, thumbnail } = req.body;

    if (!title || !price) {
      return res.status(400).json({ message: "title and price are required." });
    }

    const newProduct = await Product.create({
      title,
      description,
      category,
      price,
      stock,
      thumbnail,
      owner: userId,
    });

    res.status(201).json({ message: "Product created", product: newProduct });
  } catch (err) {
    console.error("Error creating vendor product:", err);
    next(err);
  }
});


router.delete("/my-shop/:id", requireAuth, requireRole("vendor"), async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const product = await Product.findOneAndDelete({ _id: id, owner: userId });
    if (!product) {
      return res.status(404).json({ message: "Product not found or not yours." });
    }
    res.json({ message: "Product deleted successfully", id });
  } catch (err) {
    console.error("Error deleting vendor product:", err);
    next(err);
  }
});

module.exports = router;
