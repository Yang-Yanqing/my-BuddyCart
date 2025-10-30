function requireOwnership(model, idParam = "id", ownerPath = "owner"){
   return async (req, res, next) => {
    try {
       const user= req.user; 
       if (!user)return res.status(401).json({ message: "Unauthorized" });
       if (user.role === "admin") return next();

       const doc = await model.findById(req.params[idParam]).select(ownerPath);
      if (!doc)return res.status(404).json({ message: "Not found" });
 
       const isOwner= String(doc[ownerPath]) === String(user.id);
       if (!isOwner)return res.status(403).json({ message: "Forbidden" });
 
       next();
    } catch (err) {
       next(err);
    }
   };
 };

module.exports=requireOwnership;