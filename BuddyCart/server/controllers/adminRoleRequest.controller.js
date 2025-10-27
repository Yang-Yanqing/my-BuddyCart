const mongoose = require("mongoose");
const { RoleRequest } = require("../models/RoleRequest.model");
const { User } = require("../models/User.model");
const {notifyApplicantResult} = require("../db/mailer");


function ensureAdmin(req, res) {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ message: "Forbidden: admin only" });
    return false;
  }
  return true;
}

function parsePaging(query) {
  const page = Math.max(parseInt(query.page ?? "1", 10) || 1, 1);
  const pageSize = Math.min(
    Math.max(parseInt(query.pageSize ?? "20", 10) || 20, 1),
    100
  );
  const skip = (page - 1) * pageSize;
  return { page, pageSize, skip };
}


 async function listRoleRequests(req, res, next) {
  try {
    if (!ensureAdmin(req, res)) return;

    const { status = "pending" } = req.query;
    const { page, pageSize, skip } = parsePaging(req.query);

    const q = {};
    if (status) q.status = status;

    const [items, total] = await Promise.all([
      RoleRequest.find(q)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .populate("user", "email name role"),
      RoleRequest.countDocuments(q),
    ]);

    res.json({ total, page, pageSize, items });
  } catch (err) {
    next(err);
  }
};


async function approveRoleRequest(req, res, next){
  if (!ensureAdmin(req, res)) return;

  const adminId = req.user.id;
  const { id } = req.params;
  const { reviewReason } = req.body || {};

  let session = null;
  try {

    try {
      session = await mongoose.startSession();
      session.startTransaction();
    } catch (_) {
      session = null; 
    }

    const findOpts = session ? { session } : {};
    const reqDoc = await RoleRequest.findById(id, null, findOpts);
    if (!reqDoc) {
      if (session) { await session.abortTransaction(); session.endSession(); }
      return res.status(404).json({ message: "RoleRequest not found" });
    }
    if (reqDoc.status !== "pending") {
      if (session) { await session.abortTransaction(); session.endSession(); }
      return res.status(409).json({ message: "Request already reviewed" });
    }

  
    const user = await User.findById(reqDoc.user, null, findOpts);
    if (!user) {
      if (session) { await session.abortTransaction(); session.endSession(); }
      return res.status(404).json({ message: "User not found" });
    }
    user.role = reqDoc.requestedRole;
    await user.save(findOpts);

 
    reqDoc.status = "closed";
    reqDoc.reviewStatus = "approved";
    reqDoc.reviewBy = adminId;
    reqDoc.reviewDate = new Date();
    if (typeof reviewReason !== "undefined") reqDoc.reviewReason = reviewReason;
    await reqDoc.save(findOpts);

    if (session) { await session.commitTransaction(); session.endSession(); }

   
    const populated = await RoleRequest.findById(reqDoc._id)
      .populate("user", "email name role");
    res.json({ message: "approved", data: populated });
    try {
     await notifyApplicantResult({ userEmail: populated?.user?.email, reqDoc: populated });
    } catch (_) {}

  } catch (err) {
    if (session) {
      try { await session.abortTransaction(); session.endSession(); } catch (_) {}
    }
    next(err);
  }
};


async function rejectRoleRequest(req, res, next){
  try {
    if (!ensureAdmin(req, res)) return;

    const adminId = req.user.id;
    const { id } = req.params;
    const { reviewReason } = req.body || {};

    const reqDoc = await RoleRequest.findById(id);
    if (!reqDoc) {
      return res.status(404).json({message: "RoleRequest not found"});
    }
    if (reqDoc.status !== "pending") {
      return res.status(409).json({message: "Request already reviewed"});
    }

    reqDoc.status = "closed";
    reqDoc.reviewStatus="rejected";
    reqDoc.reviewBy=adminId;
    reqDoc.reviewDate=new Date();
    if (typeof reviewReason!=="undefined") reqDoc.reviewReason = reviewReason;
    await reqDoc.save();

    const populated = await RoleRequest.findById(reqDoc._id)
      .populate("user","email name role");
    res.json({ message:"rejected", data: populated });
    try {
     await notifyApplicantResult({ userEmail: populated?.user?.email, reqDoc: populated });
   } catch (_) {}
  } catch (err) {
    next(err);
  }
};
module.exports={listRoleRequests,approveRoleRequest,rejectRoleRequest}