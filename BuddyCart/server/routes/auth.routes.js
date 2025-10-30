const router = require("express").Router();
const {register,
  verifyUser,
  loginUser,
  updateUser,
  deleteUser,
  createOrReuseRoleRequest,
  trackPreferenceClick,
  updateMe}=require("../controllers/auth.control");

const {requireAuth,requireRole} = require("../middleware/requireAuth");
const User=require("../models/User.model")


router.post('/register',register);
router.post('/login',loginUser);
router.put('/update/:id', requireAuth, requireRole('admin'), updateUser);
router.delete('/remove/:id', requireAuth, requireRole('admin'), deleteUser);

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).lean(); 
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage || "",
      },
    });
  } catch (e) {
    next(e);
  }
});

router.put("/me", requireAuth, updateMe);
router.post("/role-requests", requireAuth,createOrReuseRoleRequest);
router.post("/me/click",requireAuth,requireRole("customer"),trackPreferenceClick);

module.exports=router;