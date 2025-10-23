const router = require("express").Router();
const {register,verifyUser,loginUser,updateUser,deleteUser}=require("../controllers/auth.control");
const {requireAuth} = require("../middleware/requireAuth");
const User=require("../models/User.model")


router.post('/register',register);
router.post('/logIn',loginUser);
router.put('/update/:id',updateUser);
router.delete('/remove/:id',deleteUser);

router.get("/me",requireAuth,async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("name email role");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (e) { next(e); }
});


module.exports=router;