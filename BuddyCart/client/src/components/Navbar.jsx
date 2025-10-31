import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";


const CATEGORIES = [
  { label: "Fashion", tag: "mens-shirts" },
  { label: "Beauty", tag: "beauty" },
  { label: "Home", tag: "home-decoration" },
  { label: "Electronics", tag: "smartphones" },
  { label: "Sports", tag: "sports-accessories" },
  { label: "More…", tag: null },
];

const Avatar = ({ name, url, size = 32 }) => {
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "U")}`;
  const src = url || fallback;
  return (
    <img
      src={src}
      alt="avatar"
      width={size}
      height={size}
      style={{
        borderRadius: "50%",
        objectFit: "cover",
        display: "block",
        border: "1px solid rgba(0,0,0,0.08)",
      }}
      onError={(e) => {
        if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
      }}
    />
  );
};

export default function Navbar() {
  const [catOpen, setCatOpen] = useState(false);
  const navigate = useNavigate();
  const {user, logOut} = useAuth();
  const {cart}=useCart();
  const {count}=cart.length;

  const gotoTag = (tag) => {
    if (!tag) return;
    navigate(`/tags/${tag}`);
    setCatOpen(false);
  };

 
  const handleLogout = () => {
    logOut?.();
    navigate("/auth/login");
  };

    const onAvatarClick = () => {
    if (!user) return navigate("/auth/login");
     if (user.role === "admin") return navigate("/admin");
     if (user.role === "vendor") return navigate("/vendor");
     return navigate("/profile");
   };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "saturate(160%) blur(10px)",
        background: "rgba(255,255,255,0.75)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "10px 16px",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* 左：Logo */}
        <div>
          <Link
            to="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            <span
              style={{
                display: "grid",
                placeItems: "center",
                width: 32,
                height: 32,
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                fontWeight: 800,
                color: "#222",
              }}
            >
              YQ
            </span>
            <span style={{ fontWeight: 700, letterSpacing: 0.2, color: "#111" }}>
              BuddyCart
            </span>
          </Link>
        </div>

        {/* 中：分类 */}
        <nav style={{ justifySelf: "center", position: "relative" }}>
          <div
            onMouseEnter={() => setCatOpen(true)}
            onMouseLeave={() => setCatOpen(false)}
            onClick={() => setCatOpen((v) => !v)}
            style={{ position: "relative", cursor: "pointer" }}
          >
            <span
              style={{
                padding: "8px 14px",
                borderRadius: 999,
                border: "1px solid rgba(0,0,0,0.08)",
                background: "#fff",
                boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                userSelect: "none",
              }}
            >
              Browse
            </span>

            {catOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  left: 0,
                  minWidth: 220,
                  background: "#fff",
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                  borderRadius: 14,
                  padding: 8,
                  display: "grid",
                  gap: 4,
                }}
              >
                {CATEGORIES.map((c) => (
                  <button
                    key={c.label}
                    onClick={() => gotoTag(c.tag)}
                    disabled={!c.tag}
                    title={c.tag ? `View ${c.label}` : "More coming soon"}
                    style={{
                      textAlign: "left",
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: "none",
                      background: "transparent",
                      cursor: c.tag ? "pointer" : "not-allowed",
                      opacity: c.tag ? 1 : 0.5,
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.background = "rgba(0,0,0,0.04)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* 右：操作区 */}
        <div
          style={{
            justifySelf: "end",
            display: "inline-flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <NavLink
            to="/chat"
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              textDecoration: "none",
              color: "#333",
            }}
          >
            Chat & Shop
          </NavLink>

          <NavLink to="/cart" style={{ position: "relative", display: "inline-block" }}>
         Cart
         {count > 0 && (
           <span style={{
             position: "absolute", top: -6, right: -10, minWidth: 16, height: 16,
             borderRadius: 8, padding: "0 4px", fontSize: 11, lineHeight: "16px",
             background: "#ff4d4f", color: "#fff", textAlign: "center"
           }}>{count}</span>
         )}
       </NavLink>

          <NavLink to="/about" style={{ padding: "8px 12px", borderRadius: 10, color: "#333", textDecoration: "none" }}>
            About
          </NavLink>

          {user ? (
            <>
              <div
                onClick={onAvatarClick}
                style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
                title="Open profile"
              >
                <Avatar name={user.name || user.email} url={user.profileImage} size={36} />
              </div>
              <button
                onClick={handleLogout}
                style={{
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/auth/login"
                style={{
                  padding: "8px 14px",
                  borderRadius: 12,
                  background: "#111",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 600,
                  border: "1px solid rgba(0,0,0,0.9)",
                }}
              >
                Sign in
              </NavLink>
              <NavLink
                to="/auth/register"
                style={{
                  padding: "8px 14px",
                  borderRadius: 12,
                  background: "#fff",
                  color: "#111",
                  textDecoration: "none",
                  fontWeight: 600,
                  border: "1px solid rgba(0,0,0,0.2)",
                }}
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
