 const slugify = s => String(s || "").toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
 const { Shop } = require("../models/Shop.model");

 async function createMyShop(req, res, next){
   try {
     const { name, description, logoUrl } = req.body;
     const slug = slugify(name);
     const owner = req.user.id;
     const existed = await Shop.findOne({ owner });
     if (existed) return res.status(400).json({ message: "You already have a shop" });
     const shop = await Shop.create({ name, slug, description, logoUrl, owner });
     res.status(201).json(shop);
   } catch (e) { next(e); }
 };

async function getMyShop(req, res, next){
   try {
     const shop = await Shop.findOne({ owner: req.user.id });
     if (!shop) return res.status(404).json({ message: "Not found" });
     res.json(shop);
   } catch (e) { next(e); }
 };

 async function updateMyShop(req, res, next){
   try {
     const { name, description, logoUrl } = req.body;
     const shop = await Shop.findOne({ owner: req.user.id });
     if (!shop) return res.status(404).json({ message: "Not found" });
     if (name) { shop.name = name; shop.slug = slugify(name); }
     if (description != null) shop.description = description;
     if (logoUrl != null) shop.logoUrl = logoUrl;
     await shop.save();
     res.json(shop);
   } catch (e) { next(e); }
 };


async function adminListShops(req, res, next){
   try {
     const list = await Shop.find().populate("owner", "email role");
     res.json(list);
   } catch (e) { next(e); }
 };

async function adminDeleteShop(req, res, next){
   try {
     await Shop.findByIdAndDelete(req.params.id);
     res.json({ ok: true });
   } catch (e) { next(e); }
 };

 module.exports={
    createMyShop,
    getMyShop,
    updateMyShop,
    adminListShops,
    adminDeleteShop
 }