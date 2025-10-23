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

const requireRole=(...roles) => (req, res, next) => {
  if (!req.user?.role || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

module.exports={requireAuth}