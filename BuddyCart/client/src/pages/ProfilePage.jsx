import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  if (!user)
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#888",
        }}
      >
        <p>Please log in to view your profile.</p>
      </div>
    );

  const fallbackInitial = (user?.name || user?.email || "U")[0]?.toUpperCase?.() || "U";
 const avatarSize = 88;
  const avatarStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid rgba(0,0,0,0.06)",
    background: "#f3f4f6"
  };

  const handleSave = async () => {
  try {
    setLoading(true);
    const res = await axios.put(
      "/api/auth/me",
      { name: form.name, email: form.email },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("✅ Profile updated successfully!");
  
   if (res?.data?.user) {
     const stored = JSON.parse(localStorage.getItem("user") || "{}");
     localStorage.setItem("user", JSON.stringify({ ...stored, ...res.data.user }));
   }
   window.location.reload();
    setShowEdit(false);
  } catch (err) {
    console.error(err);
    alert("❌ Failed to update profile");
  } finally {
    setLoading(false);
  }
};

  const handleAdminAction = async (type) => {
    if (!window.confirm(`Are you sure you want to ${type}?`)) return;
    try {
      if (type === "clear") {
        await axios.delete("/api/admin/products", {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("🧹 All products cleared!");
      } else if (type === "sync") {
        await axios.post("/api/admin/products/sync", {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("🔄 Products synced from external source!");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Action failed. Check server logs.");
    }
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        background: "linear-gradient(180deg, #f8fafc 0%, #fff 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          padding: "40px 50px",
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            margin: "0 auto 16px",
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)",
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 36,
            fontWeight: 600,
          }}
        >
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt="avatar"
            style={avatarStyle}
            onError={(e)=>{ e.currentTarget.style.display="none"; }}
          />
        ) : (
          <div style={{
            ...avatarStyle,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontWeight:700, fontSize:28, color:"#555"
          }}>
            {fallbackInitial}
          </div>
        )}
        <div>
          <div style={{ fontSize:18, fontWeight:600 }}>{user?.name || "Unnamed User"}</div>
          <div style={{ color:"#666", marginTop:4 }}>{user?.email}</div>
          {user?.name?.[0]?.toUpperCase() ||
            user?.email?.[0]?.toUpperCase() ||
            "?"}
        </div>
        </div>
        </div>

        <h2 style={{ margin: "0 0 4px", fontSize: 22, color: "#111" }}>
          {user?.name || user?.email || "User"}
        </h2>

        <span
          style={{
            backgroundColor: "#e0f2fe",
            color: "#0369a1",
            padding: "4px 10px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          {user?.role || "customer"}
        </span>

        <div
          style={{
            marginTop: 24,
            borderTop: "1px solid #f0f0f0",
            paddingTop: 16,
            fontSize: 15,
            lineHeight: "1.6",
            color: "#444",
          }}
        >
          <p>
            <strong>Email:</strong> {user?.email || "—"}
          </p>
          <p>
            <strong>Verified:</strong>{" "}
            <span style={{ color: user?.verified ? "#16a34a" : "#b91c1c" }}>
              {user?.verified ? "Yes" : "No"}
            </span>
          </p>
        </div>

    
        <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={() => setShowEdit(true)}
            style={{
              background: "#2563eb",
              color: "#fff",
              padding: "10px 18px",
              borderRadius: 10,
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Edit Profile
          </button>

        
          {user.role === "admin" && (
            <>
              <button
                onClick={() => handleAdminAction("clear")}
                style={{
                  background: "#b91c1c",
                  color: "#fff",
                  padding: "10px 18px",
                  borderRadius: 10,
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                🧹 Clear All Products
              </button>
              <button
                onClick={() => handleAdminAction("sync")}
                style={{
                  background: "#15803d",
                  color: "#fff",
                  padding: "10px 18px",
                  borderRadius: 10,
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                🔄 Sync Products
              </button>
            </>
          )}

          {user.role === "vendor" && (
            <button
              onClick={() => navigate("/my-shop")}
              style={{
                background: "#f59e0b",
                color: "#fff",
                padding: "10px 18px",
                borderRadius: 10,
                border: "none",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              🏪 Manage My Shop
            </button>
          )}

          {user.role === "customer" && (
            <button
              style={{
                background: "#9ca3af",
                color: "#fff",
                padding: "10px 18px",
                borderRadius: 10,
                border: "none",
                fontWeight: 600,
              }}
              disabled
            >
              💡 Customer Account
            </button>
          )}
        </div>
      </div>

 
      {showEdit && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowEdit(false)}
        >
          <div
            style={{
              background: "#fff",
              padding: 30,
              borderRadius: 12,
              width: 340,
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: 20 }}>Edit Profile</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <label>
                Name:
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{
                    width: "100%",
                    padding: 8,
                    marginTop: 4,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                  }}
                />
              </label>

              <label>
                Email:
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={{
                    width: "100%",
                    padding: 8,
                    marginTop: 4,
                    borderRadius: 6,
                    border: "1px solid #ccc",
                  }}
                />
              </label>
            </div>

            <div
              style={{
                marginTop: 20,
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
              }}
            >
              <button
                onClick={() => setShowEdit(false)}
                style={{
                  padding: "8px 14px",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  background: "#f5f5f5",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                style={{
                  padding: "8px 14px",
                  border: "none",
                  borderRadius: 8,
                  background: "#2563eb",
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
