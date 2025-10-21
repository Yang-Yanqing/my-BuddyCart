const User=require("../models/User.model");
const RoleRequest=require("../models/RoleRequest.model")

const register=async(req,res,next)=>{
try {
    const {name,email,password,desiredRole }=req.body;
    const emailExisting=await User.findOne({email});
     if(emailExisting){return res.status(409).json({ message: "Email already registered." });}

    const newUser=await User.create({name,email,password});

    let roleRequest=null;
    if(["vendor","admin"].includes(desiredRole)){
        roleRequest=await RoleRequest.create(
            {user:newUser._id,
            requestedRole:desiredRole});
        
        console.log(`[Here is a role request] User ${newUser.email} requested :${desiredRole}.Pending admin approval.`);

        res.status(201).json({message:"Roll request submitted and block for approval ",user:{id:newUser._id,email:newUser.email,role:newUser.role},} )
        return;
    }
    

    res.status(201).json({
        message:"User is create successfulluy!",
        user:{id:newUser._id,email:newUser.email,role:newUser.role},
            })

   
} catch (err) {
    console.error("Here is a problem of register.")
    next(err)
}
}

const verifyUser=async (req,res,next)=>{
    
}

const loginUser=async(req,res,next)=>{
    try {
       const {email,password}=req.body;

       const loginUser=await User.findOne({email});
       if(!loginUser){
        console.log("Verify is failed!");
        res.status(401).json({message:"Verify is failed!"})
        return;
       }
       if(loginUser.password!==password){
        console.log("Verify is failed!");
        return res.status(401).json({ message: "Verify is failed!" });}
       
         console.log("Verify is passed!");
            res.status(200).json({message:"User verify successfulluy!",
           user:{id:loginUser._id,email:loginUser.email,role:loginUser.role}})        
    } catch (err) {
    console.error("Here is a problem of verifyUser.")
    next(err)
    }
}

const updateUser=async(req,res,next)=>{
try {
    const { id }=req.params;
    const {name,email,password}=req.body;
   
    if (!id) return sendError(res, 400, "id param is required.");

    // let updateUser={};
    if(name)updateUser.name=name;
    if(email)updateUser.email=email;
    if(password)updateUser.password=password;
   
    const updated=await User.findByIdAndUpdate(id,updateUser,{new:true,runValidators:true,})
    
    return res.status(200).json({message:"User updated successfully!",user:{id:updated._id,name:updated.name,email:updated.email,password:updated.password}})

} catch (err) {
    console.error("Here is a problem of updateUser.")
    next(err)
}
}

const deleteUser=async(req,res,next)=>{
    try {
        const {name}=req.body;
        const deleteId=name._id;
        const deleteUser=await User.findByIdAndDelete(deleteId)
        return res.status(205).json({message:"User delete successfully!",user:{name:deleteUser.name}})
        
    } catch (err) {
    console.error("Here is a problem of verifyUser.")
    next(err)
    }
}

module.exports={register,verifyUser,loginUser,updateUser,deleteUser};