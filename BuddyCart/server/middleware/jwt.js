const jwt=require("jsonwebtoken")
const JWT_SECRET=process.env.JWT_SECRET||"buddyCartSecretKey";
const JWT_ISSUER=process.env.JWT_ISSUER||"buddycart";
const JWT_EXPIRES=process.env.JWT_EXPIRES || "7d";

function signAccessToken(payload={}){
  return jwt.sign(payload,JWT_SECRET, {
    expiresIn:JWT_EXPIRES,
    issuer:JWT_ISSUER,
  });
}
function verifyAccessToken(token) { 
  return jwt.verify(token,JWT_SECRET,{issuer:JWT_ISSUER});
}

function getTokenHeader(req){
  const h=req.headers.authorization||'';
  const [schema,token]=h.split(' ');
  if(schema?.toLowerCase()!=='bearer'||!token){return null;}
  return token
  }

async function requireAuth(req,res,next){
  try {
    const token=getTokenHeader(req);
    if(!token){return res.status(401).json({error:"Unauthorized"})}
    const payload=verifyAccessToken(token);
    req.user=payload;
    next()
  } catch (err) {
    return res.status(401).json({error:"Invalid token"});
  }
}

module.exports={
  signAccessToken,
  verifyAccessToken,
  requireAuth,
  getTokenHeader,
};