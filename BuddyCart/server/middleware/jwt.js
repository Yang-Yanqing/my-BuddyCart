const jwt=require("jsonwebtoken")
const JWT_SECRET=process.env.JWT_SECRET;
const JWT_EXPIRES=process.env.JWT_EXPIRES || process.env.JWT_EXPIRES_IN || "1h";
const ISSUER="buddycart";

function signAccessToken(user){
  const payload={sub:user._id.toString(),role:user.role };
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES,
    issuer:ISSUER,
  });
}
function verifyAccessToken(token) {
  return jwt.verify(token, JWT_SECRET, { issuer:ISSUER });
}

module.exports = {signAccessToken, verifyAccessToken};