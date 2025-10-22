const {verifyAccessToken} = require("./jwt");
function requireAuth(req,res,next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Unauthorized: missing token" });
  }

  try {
    const decoded=verifyAccessToken(token);
    req.user={ id: decoded.sub, role: decoded.role };
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: invalid or expired token" });
  }
};


module.exports=requireAuth