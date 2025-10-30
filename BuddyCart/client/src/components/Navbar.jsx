import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = [
  { label: "Fashion", tag: "mens-shirts" },
  { label: "Beauty", tag: "beauty" },
  { label: "Home", tag: "home-decoration" },
  { label: "Electronics", tag: "smartphones" },
  { label: "Sports", tag: "sports-accessories" },
  { label: "More…", tag: null },
];

export default function Navbar() {
  const [catOpen, setCatOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logOut } = useAuth();

  const gotoTag = (tag) => {
    if (!tag) return;
    navigate(`/tags/${tag}`);
    setCatOpen(false);
  };

  const handleProfileClick = () => {
    if (user?.role === "admin") navigate("/admin");
    else navigate("/profile");
  };

  const handleLogout = () => {
    logOut?.();
    navigate("/auth/login");
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

          <NavLink
            to="/cart"
            style={{
              padding: "8px 12px",
              borderRadius: 10,
              textDecoration: "none",
              color: "#333",
            }}
          >
            Cart
          </NavLink>

          <NavLink to="/about" className="nav-link">
          About
         </NavLink>

          {user ? (
            <>
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="me"
                  onClick={handleProfileClick}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    objectFit: "cover",
                    cursor: "pointer",
                    border: "1px solid rgba(0,0,0,0.08)",
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div
                  onClick={handleProfileClick}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#e5e7eb",
                    color: "#111",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  {(user?.name || user?.email || "U")[0].toUpperCase()}
                </div>
              )}
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
};
