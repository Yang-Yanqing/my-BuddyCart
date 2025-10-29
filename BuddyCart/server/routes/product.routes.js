const express=require("express");
const router=express.Router();
const {listProducts,createProduct,updateProduct,deleteProduct}=require("../controllers/product.control");
const {requireAuth,requireRole}=require("../middleware/requireAuth");
const { Product } = require("../models/Product.model");
const { Shop } = require("../models/Shop.model");
const requireOwnership=require("../middleware/ownership");

router.get("/", listProducts);

router.get(
  "/me",
  requireAuth,
  requireRole("vendor","admin"),

  async (req,res,next)=>{
    try{
      if(req.user.role==="admin"){
      return listProducts(req,res,next);
      }

      const q={ owner: req.user.id };
      if(req.query.myShop==="1"){
        const myShop=await Shop.findOne({ owner:req.user.id }).select("_id");
        q.shop=(myShop&&myShop._id)||null;
      }
      const list = await Product.find(q).sort("-createdAt").limit(100);
      res.json(list);
    }catch(e){ next(e); }
  }
);


function attachOwnerAndShop(req,res,next){
  if(req.user?.role==="vendor"){
    req.body.owner = req.user.id;
    Shop.findOne({ owner:req.user.id }).select("_id")
      .then(s=>{ req.body.shop = s?._id || null; next(); })
      .catch(next);
  }else{
    next();
  }
}

router.post(
    "/",
    requireAuth,
    requireRole("vendor","admin"),
    attachOwnerAndShop,
    createProduct
)

router.put(
    "/:id",
    requireAuth,
    requireRole("vendor","admin"),
    requireOwnership(Product, "id", "owner"),
    updateProduct
)

router.delete(
    "/:id",
    requireAuth,
    requireRole("vendor","admin"),
    requireOwnership(Product, "id", "owner"),
    deleteProduct
)



module.exports = router;
