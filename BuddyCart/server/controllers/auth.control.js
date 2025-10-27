const User=require("../models/User.model");
const {signAccessToken}=require("../middleware/jwt");
const {RoleRequest} = require("../models/RoleRequest.model");
const {notifyAdminsNewRoleRequest}=require("../db/mailer");

const ALLOWED_TARGET_ROLES=["vendor","admin"];
const register=async(req,res,next)=>{
try {
    let {name,email,password,desiredRole }=req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, password are required." });
    }
    email = String(email).trim().toLowerCase();
    const emailExisting=await User.findOne({email});
     if(emailExisting){return res.status(409).json({ message: "Email already registered." });}

    const newUser=await User.create({name,email,password});

    let roleRequest=null;
    if(["vendor","admin"].includes(desiredRole)){
        roleRequest=await RoleRequest.create(
            {user:newUser._id,
            requestedRole:desiredRole});
        
        console.log(`[Here is a role request] User ${newUser.email} requested :${desiredRole}.Pending admin approval.`);
        
        try {
         await notifyAdminsNewRoleRequest({ user:newUser, reqDoc:roleRequest });
       } catch (_) {}

        res.status(201).json({message:"Role request submitted and pending admin approval. Current role remains 'customer'. ",user:{id:newUser._id,email:newUser.email,role:newUser.role},} )
        return;
    }
    

    res.status(201).json({
        message:"User is create successfulluy!",
        user:{id:newUser._id,email:newUser.email,role:newUser.role},
            })

   
} catch (err) {
     if (err?.code === 11000) {
    return res.status(409).json({ message: "Email already registered." });
  }
    console.error("Here is a problem of register.", err)
    next(err)
}
}

const verifyUser=async (req,res,next)=>{
    
}

const loginUser=async(req,res,next)=>{
    try {
       
       const email=String(req.body.email || "").trim().toLowerCase();
       const password=String(req.body.password || "");


       const loginUser=await User.findOne({email}).select("+password");
       if(!loginUser){
        console.log("Login is failed!");
        return res.status(401).json({message:"Login is failed!"})
        }

       const pass=await loginUser.comparePassword(password);
       
       if(!pass){
        console.log("Login is failed!");
        return res.status(401).json({ message: "Login is failed!" });}
        const token=signAccessToken({id:loginUser._id,role: loginUser.role});

         console.log("Login is passed!");

        res.status(200).json(
            {token,                
           user:{id:loginUser._id,email:loginUser.email,role:loginUser.role},
           message:"User login successfulluy!"})        
    } catch (err) {
    console.error("Here is a problem of loginUser.",err)
    next(err)
    }
}

const updateUser=async(req,res,next)=>{
try {
    const { id }=req.params;
    const {name,email,password}=req.body;
   
    if (!id) return res.status(400).json({ message: "id param is required." });

    let update={};
    if(name)update.name=name;
    if(email)update.email=email.trim().toLowerCase();
    if(password)update.password=password;


   
    const updated=await User.findByIdAndUpdate(id,update,{new:true,runValidators:true,})
    
    return res.status(200).json({message:"User updated successfully!",user:{id:updated._id,name:updated.name,email:updated.email}})

} catch (err) {
    console.error("Here is a problem of updateUser.",err)
    next(err)
}
}

const deleteUser=async(req,res,next)=>{
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "id param is required." });
        const deleted = await User.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "User not found." });
        return res.status(200).json({ message:"User delete successfully!", user:{ id: deleted._id, name: deleted.name } })
        } catch (err) {
    console.error("Here is a problem of deleteUser.",err)
    next(err)
    }
}

const createOrReuseRoleRequest = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    let { requestedRole, reason } = req.body || {};
    if (!requestedRole) {
      return res.status(400).json({ message: "requestedRole is required" });
    }

    requestedRole = String(requestedRole).trim();
    if (!ALLOWED_TARGET_ROLES.includes(requestedRole)) {
      return res.status(400).json({ message: "Invalid requestedRole" });
    }
    if (typeof reason !== "undefined") {
      reason = String(reason).trim();
    }

  
    let doc=await RoleRequest.findOne({user: userId, status: "pending"});

    if (doc) {
      let touched = false;
      if (doc.requestedRole !== requestedRole) {
        doc.requestedRole = requestedRole;
        touched = true;
      }
      if (typeof reason !== "undefined" && doc.reason !== reason) {
        doc.reason = reason;
        touched = true;
      }
      if (touched) await doc.save();

      const populated = await RoleRequest.findById(doc._id)
        .populate("user", "email name role");

      return res.status(200).json({ reused: true, data: populated });
    }
    doc = await RoleRequest.create({
      user: userId,
      requestedRole,
      reason,
      status: "pending",
    });

    try {
     const user = await User.findById(userId).select("email name");
     await notifyAdminsNewRoleRequest({ user, reqDoc: doc });
     } catch (_) {}

    const populated = await RoleRequest.findById(doc._id)
      .populate("user", "email name role");

    return res.status(201).json({ reused: false, data: populated });
  } catch (err) {
    next(err);
  }
};

const MALE_LIKE=new Set([
  "mens-shirts",
  "mens-shoes",
  "mens-watches",
  "laptops",
  "mobile-accessories",
  "smartphones",
  "sports-accessories",
  "sunglasses",
  "motorcycle",
  "vehicle",
  "furniture",
  "tablets",
]);

const FEMALE_LIKE=new Set([
  "womens-bags",
  "womens-dresses",
  "womens-jewellery",
  "womens-shoes",
  "womens-watches",
  "beauty",
  "skin-care",
  "fragrances",
  "home-decoration",
  "kitchen-accessories",
  "groceries",
  "tops",
]);

async function trackPreferenceClick(req, res, next) {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    let { title, category } = req.body || {};
    title = (title || "").toString().trim();
    category = (category || "").toString().trim();
    if (!title || !category) {
      return res.status(400).json({ message: "title and category are required" });
    }

    const user = await User.findById(userId).select(
      "likedProductTitles colorR colorG colorB"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.likedProductTitles.includes(title)) {
      user.likedProductTitles.unshift(title);
      if (user.likedProductTitles.length > 50) user.likedProductTitles.pop();
    }

    let dr=0, dg=0, db=0;
    if (MALE_LIKE.has(category)) {
      dr = -5;
    } else if (FEMALE_LIKE.has(category)) {
      db = -5;
    }
    const clamp = (v) => Math.max(0, Math.min(255, v));
    user.colorR = clamp(user.colorR+dr);
    user.colorG = clamp(user.colorG+dg);
    user.colorB = clamp(user.colorB+db);

    await user.save();

    return res.json({
      ok: true,
      rgb: {r:user.colorR,g:user.colorG,b:user.colorB },
      delta: {dr,dg,db},
      likedProductTitles: user.likedProductTitles,
    });
  } catch (err) {
    next(err);
  }
}

module.exports={
  register,
  verifyUser,
  loginUser,
  updateUser,
  deleteUser,
  createOrReuseRoleRequest,
trackPreferenceClick
};