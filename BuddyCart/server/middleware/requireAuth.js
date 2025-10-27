const {verifyAccessToken} = require("./jwt");

function requireAuth(req,res,next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Unauthorized: missing token" });
  }

  try {
    const decoded=verifyAccessToken(token);
    req.user={ id: decoded.id,role: decoded.role };
    return next();
  } catch (err) {
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

module.exports={requireAuth,requireRole}