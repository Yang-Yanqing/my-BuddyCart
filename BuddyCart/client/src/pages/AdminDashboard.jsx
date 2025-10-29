import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { normalizeImage } from "../utils/normalizeImage";

export default function AdminDashboard() {
  const { user, token } = useAuth();
  console.log("DEBUG → user object:", user);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productInfo, setProductInfo] = useState(null);


  async function fetchRequests() {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/role-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data.items || []);
    } catch (err) {
      console.error("Failed to fetch role requests:", err);
    } finally {
      setLoading(false);
    }
  }


  async function handleApprove(id) {
    try {
      await axios.post(`/api/admin/role-requests/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Request approved!");
      fetchRequests();
    } catch (err) {
      console.error("Approval failed:", err);
      alert("Failed to approve this request.");
    }
  }


  async function handleReject(id) {
    try {
      await axios.post(`/api/admin/role-requests/${id}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("❌ Request rejected.");
      fetchRequests();
    } catch (err) {
      console.error("Rejection failed:", err);
      alert("Failed to reject this request.");
    }
  }


  async function handleSyncProducts() {
    try {
      const res = await axios.post("/api/admin/products/sync", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProductInfo(res.data);
      alert(`✅ Synced ${res.data.upserted || 0} new products.`);
    } catch (err) {
      console.error("Sync failed:", err);
      alert("Failed to sync products.");
    }
  }


  async function handleCleanProducts() {
    const confirmDelete = window.confirm("Are you sure you want to delete ALL products?");
    if (!confirmDelete) return;

    try {
      const res = await axios.delete("/api/admin/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProductInfo(res.data);
      alert(`🧹 Deleted ${res.data.deletedCount} products.`);
    } catch (err) {
      console.error("Clean failed:", err);
      alert("Failed to clean database.");
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Dashboard</h1>


      <div style={styles.profileCard}>
        {user?.profileImage ? (
          <img
            key={user.profileImage}
            src={normalizeImage(user.profileImage)}
            alt="Profile"
            style={styles.avatar}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placekitten.com/120/120";
            }}
          />
        ) : (
          <div
            style={{
              ...styles.avatar,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#aaa",
              fontSize: "0.8rem",
            }}
          >
            No Image
          </div>
        )}
        <div>
          <p><b>Name:</b> {user?.name}</p>
          <p><b>Email:</b> {user?.email}</p>
          <p><b>Role:</b> {user?.role}</p>
        </div>
      </div>


      <div style={styles.buttons}>
        <button onClick={handleSyncProducts} style={styles.syncBtn}>
          🔄 Sync Products
        </button>
        <button onClick={handleCleanProducts} style={styles.cleanBtn}>
          🧹 Clean Database
        </button>
      </div>

      {productInfo && (
        <div style={styles.infoBox}>
          <p><b>Message:</b> {productInfo.message}</p>
          {productInfo.fetched && (
            <p>
              Synced: {productInfo.fetched} | Upserted: {productInfo.upserted} | Modified: {productInfo.modified}
            </p>
          )}
          {productInfo.deletedCount !== undefined && (
            <p>Deleted: {productInfo.deletedCount}</p>
          )}
        </div>
      )}

     
      <h2 style={{ marginTop: "2rem" }}>Role Requests</h2>

      {loading ? (
        <p>Loading...</p>
      ) : requests.length === 0 ? (
        <p>No pending requests 🎉</p>
      ) : (
        requests.map((r) => (
          <div key={r._id} style={styles.requestCard}>
            <p><b>User:</b> {r.user?.email}</p>
            <p><b>Requested Role:</b> {r.requestedRole}</p>
            <p><b>Status:</b> {r.status}</p>
            <div style={{ marginTop: "0.5rem" }}>
              <button style={styles.approveBtn} onClick={() => handleApprove(r._id)}>Approve</button>
              <button style={styles.rejectBtn} onClick={() => handleReject(r._id)}>Reject</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}


const styles = {
  container: { padding: "2rem", maxWidth: 900, margin: "auto" },
  title: { textAlign: "center", marginBottom: "1.5rem" },
  profileCard: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    background: "#fafafa",
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: "1rem",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: "50%",
    objectFit: "cover",
    background: "#eee",
  },
  buttons: {
    display: "flex",
    gap: "1rem",
    marginTop: "1.5rem",
  },
  syncBtn: {
    background: "#4CAF50",
    color: "#fff",
    padding: "10px 16px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  cleanBtn: {
    background: "#e53935",
    color: "#fff",
    padding: "10px 16px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  infoBox: {
    marginTop: "1rem",
    padding: "0.75rem 1rem",
    background: "#f7f7f7",
    border: "1px solid #ddd",
    borderRadius: 6,
  },
  requestCard: {
    border: "1px solid #ccc",
    borderRadius: 6,
    padding: "1rem",
    marginBottom: "1rem",
    background: "#fff",
  },
  approveBtn: {
    background: "#2196F3",
    color: "#fff",
    padding: "6px 12px",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    marginRight: "8px",
  },
  rejectBtn: {
    background: "#9E9E9E",
    color: "#fff",
    padding: "6px 12px",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
};
