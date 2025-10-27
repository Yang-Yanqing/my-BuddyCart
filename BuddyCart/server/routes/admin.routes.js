const express=require("express")
const router = require("express").Router();
const {syncProducts,cleanProductsInDb}=require("../controllers/admin.control");
const {requireAuth,requireRole }=require("../middleware/requireAuth")

router.post('/products/sync',requireAuth, requireRole('admin'),syncProducts);
router.delete('/products',requireAuth, requireRole('admin'),cleanProductsInDb);

module.exports=router;