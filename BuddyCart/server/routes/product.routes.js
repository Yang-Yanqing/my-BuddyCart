const express=require("express");
const router=express.Router();
const {listProducts,createProduct,updateProduct,deleteProduct}=require("../controllers/product.control");
const {requireAuth,requireRole}=require("../middleware/requireAuth")

router.get("/", listProducts);

router.post(
    "/",
    requireAuth,
    requireRole("vendor","admin"),
    createProduct
)

router.put(
    "/:id",
    requireAuth,
    requireRole("vendor","admin"),
    updateProduct
)

router.delete(
    "/:id",
    requireAuth,
    requireRole("vendor","admin"),
    deleteProduct
)



module.exports = router;
