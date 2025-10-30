const {verifyAccessToken} = require("./jwt");
const User=require("../models/User.model")

function requireAuth(req,res,next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (!/^Bearer$/i.test(scheme) || !token) {
    return res.status(401).json({ message: "Unauthorized: missing token" });
  }

  try {
    const decoded=verifyAccessToken(token);

    User.findById(decoded.id).select("role name email profileImage").lean().then(dbUser=>{
    if (!dbUser) return res.status(401).json({ message: "Unauthorized: user not found" });
        req.user={ 
          id:decoded.id,
          role:dbUser.role, 
          name:dbUser.name,
          email:dbUser.email,
          profileImage:dbUser.profileImage || ""
        };
    return next();
  }) .catch(()=>res.status(401).json({message: "Unauthorized: user lookup failed" }));}  
  catch (err) {
    return res.status(401).json({ message: "Unauthorized: invalid or expired token" });
  }
};

function requireRole(...roles){
return(req,res,next)=>{
if(!req.user)return res.status(401).json({error:"Unauthorized"})
if(!roles.includes(req.user.role)){
  return res.status(403).json({message:"Forbidden: insufficient role"})
}
return next();
}
}

module.exports={requireAuth,requireRole};