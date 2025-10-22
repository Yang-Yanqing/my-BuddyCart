const router = require("express").Router();
const {register,verifyUser,loginUser,updateUser,deleteUser}=require("../controllers/auth.control");


router.post('/register',register);
router.post('/logIn',loginUser);
router.put('/update/:id',updateUser);
router.delete('/remove/:id',deleteUser);

module.exports = router;