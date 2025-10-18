const express=require('express')
const router = require("express").Router();
const {syncProducts}=require("../controllers/admin.control");
const {cleanProductsInDb}=require("../controllers/admin.control")

router.post('/products/sync',syncProducts);
router.delete('/products', cleanProductsInDb);

module.exports=router;