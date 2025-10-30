
const mongoose = require("mongoose");
const { RoleRequest } = require("../models/RoleRequest.model");
const User = require("../models/User.model");
const { notifyApplicantResult } = require("../db/mailer"); 


function ensureAdmin(req, res) {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ message: "Forbidden: admin only" });
    return false;
  }
  return true;
}

function parsePaging(query) {
  const page = Math.max(parseInt(query.page || "1", 10) || 1, 1);
  const pageSize = Math.min(Math.max(parseInt(query.pageSize || "20", 10) || 20, 1), 100);
  const skip = (page - 1) * pageSize;
  return { page, pageSize, skip };
}

async function createRoleRequest(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    const requestedRole = (req.body && req.body.requestedRole) || "";
    const reason = (req.body && req.body.reason) || "";

    if (!requestedRole) {
      return res.status(400).json({ message: "requestedRole is required." });
    }


    const existing = await RoleRequest.findOne({
      user: userId,
      status: "pending",
    }).populate("user", "email name role");

    if (existing) {
      if (existing.requestedRole!==requestedRole) {
        existing.requestedRole=requestedRole;
        existing.reviewReason=reason||existing.reviewReason;
        await existing.save();
      }
      return res.status(200).json({ message: "already pending", data: existing });
    }

    let doc;
    try{
      doc = await RoleRequest.create({
      user: userId,
      requestedRole,
      status: "pending",
      reviewStatus: null,
      reviewReason: reason,
    });
  }catch (e) {
      if (e?.code === 11000) {
        const again = await RoleRequest.findOne({ user: userId, status: "pending" }).populate("user","email name role");
        return res.status(200).json({ message: "already pending", data: again });
      }
      throw e;
    };

    const populated = await RoleRequest.findById(doc._id).populate("user", "email name role");
    return res.status(201).json({ message: "created", data: populated });
  } catch (err) {

    if (err && err.code === 11000) {
      return res.status(200).json({ message: "already pending (dup)", dup: true });
    }
    next(err);
  }
}


async function listRoleRequests(req, res, next) {
  try {
    if (!ensureAdmin(req, res)) return;

    const status = (req.query && req.query.status) || "pending";
    const { page, pageSize, skip } = parsePaging(req.query || {});

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
}


async function approveRoleRequest(req, res, next) {
  try {
    if (!ensureAdmin(req, res)) return;

    const adminId = req.user.id;
    const id = (req.params && req.params.id) || "";
    const reviewReason = (req.body && req.body.reviewReason) || "";

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid role request id." });
    }


    let rr = await RoleRequest.findById(id).populate("user", "email name role");
    if (!rr) {
      return res.status(404).json({ message: "RoleRequest not found." });
    }


    if (rr.status !== "pending") {
      return res.status(200).json({ message: `already ${rr.reviewStatus || "closed"}`, data: rr });
    }

    if (!mongoose.isValidObjectId(rr.user?._id)) {
      return res.status(404).json({ message: "User id in RoleRequest is invalid." });
    }
    const user = await User.findByIdAndUpdate(
      rr.user._id,
      { $set: { role: rr.requestedRole } },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await RoleRequest.findByIdAndUpdate(id, {
      $set: {
        status: "closed",
        reviewStatus: "approved",
        reviewBy: adminId,
        reviewDate: new Date(),
        reviewReason: reviewReason || rr.reviewReason || "",
      },
    });

    rr = await RoleRequest.findById(id).populate("user", "email name role");
    res.json({ message: "approved", data: rr });

 
    try {
      await notifyApplicantResult({
        userEmail: rr?.user?.email,
        reqDoc: rr,
      });
    } catch (_) {}
  } catch (err) {
    console.error("[approveRoleRequest] error:", err?.name, err?.message);
    next(err);
  }
}


async function rejectRoleRequest(req, res, next) {
  try {
    if (!ensureAdmin(req, res)) return;

    const adminId = req.user.id;
    const id = (req.params && req.params.id) || "";
    const reviewReason = (req.body && req.body.reviewReason) || "";

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid role request id." });
    }

    let rr = await RoleRequest.findById(id).populate("user", "email name role");
    if (!rr) {
      return res.status(404).json({ message: "RoleRequest not found." });
    }

    if (rr.status !== "pending") {
      return res.status(200).json({ message: `already ${rr.reviewStatus || "closed"}`, data: rr });
    }

    await RoleRequest.findByIdAndUpdate(id, {
      $set: {
        status: "closed",
        reviewStatus: "rejected",
        reviewBy: adminId,
        reviewDate: new Date(),
        reviewReason: reviewReason || rr.reviewReason || "",
      },
    });

    rr = await RoleRequest.findById(id).populate("user", "email name role");
    res.json({ message: "rejected", data: rr });

    try {
      await notifyApplicantResult({
        userEmail: rr?.user?.email,
        reqDoc: rr,
      });
    } catch (_) {}
  } catch (err) {
    console.error("[rejectRoleRequest] error:", err?.name, err?.message);
    next(err);
  }
}

module.exports = {
  createRoleRequest,
  listRoleRequests,
  approveRoleRequest,
  rejectRoleRequest,
};
