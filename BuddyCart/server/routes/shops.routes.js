 const router = require("express").Router();
 const { requireAuth, requireRole } = require("../middleware/requireAuth");
 const c = require("../controllers/shop.controller");


 router.post("/me",requireAuth, requireRole("vendor"), c.createMyShop);
 router.get("/me", requireAuth, requireRole("vendor"), c.getMyShop);
 router.patch("/me", requireAuth,requireRole("vendor"), c.updateMyShop);


 router.get("/", requireAuth,requireRole("admin"), c.adminListShops);
 router.delete("/:id", requireAuth, requireRole("admin"), c.adminDeleteShop);

 module.exports = router;
