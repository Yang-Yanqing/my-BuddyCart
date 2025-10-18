const {Product} = require("../models/Product.model");

exports.listProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "12");
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find().skip(skip).limit(limit),
      Product.countDocuments(),
    ]);
    res.status(200).json({
      success: true,
      total,
      page,
      products,
    });
  } catch (err) {
    console.error("Fetch products failed in productcontroller:", err);
    next(err);
  }
};
