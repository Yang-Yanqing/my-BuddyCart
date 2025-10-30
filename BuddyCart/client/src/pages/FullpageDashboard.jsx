import React, { useRef } from "react";
import { Link } from "react-router-dom";
import DashboardPage from "./DashboardPage";

const DEFAULT_HERO =
  "https://images.unsplash.com/photo-1552649244-5e671e6d1c94?q=80&w=2400&auto=format&fit=crop";

const Section=({id,className="",children}) => (
  <section id={id}className={`snap-section ${className}`}>
    <div className="container"style={{ padding: "48px 24px" }}>{children}</div>
  </section>
);

const FullpageDashboard = ({
  heroImage = DEFAULT_HERO,
  illus2a,
  illus2b,
  illus3a,
  illus3b,
}) => 
    {
  const scrollerRef = useRef(null);
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="fullpage-root">
      
        
      <div ref={scrollerRef} className="snap-container">
        {/* Page1*/}
        <Section id="hero">
          <div style={{ position: "relative" }}>
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: "-24px",
                backgroundImage: `
                  linear-gradient(180deg, rgba(0,0,0,.35), rgba(0,0,0,.20) 30%, rgba(250,248,246,0)),
                  url(${heroImage})
                `,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderRadius: "var(--radius-lg)",
                boxShadow: "var(--shadow-lg)",
                filter: "saturate(1.05)",
              }}
            />
            <div style={{ position: "relative", color: "white", maxWidth: 740 }}>
              <h1 style={{ fontSize: 44, lineHeight: 1.12, fontWeight: 900, textShadow: "0 6px 28px rgba(0,0,0,.28)" }}>
                Chinese Street Vibes · Shopping × Chat × Community
              </h1>
              <p style={{ marginTop: 12, fontSize: 18, color: "rgba(255,255,255,.92)" }}>
                Discover great products, bring friends into chat, and share your picks together.
              </p>
              <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <button className="btn btn-primary" onClick={() => scrollTo("biz-1")}>
                  See Highlights
                </button>
                <button className="btn btn-secondary" onClick={() => scrollTo("products")}>
                  Browse Products
                </button>
              </div>
            </div>
          </div>
        </Section>

        {/* Page2 illustrations) */}
        <Section id="biz-1">
          <div className="card" style={{ padding: 24 }}>
            <h2>Highlight #1: Pin products into chat</h2>
            <p style={{ color: "var(--text-2)", marginTop: 6 }}>
              Share a product to a group or DM with one click. The following two illustrations are placeholders.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
              {[illus2a, illus2b].map((src, i) => (
                <figure key={i} className="card" style={{ aspectRatio: "16 / 9", overflow: "hidden" }}>
                  {src ? (
                    <img src={src} alt={`Highlight 1 – Illustration ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: "var(--muted)" }}>
                      Illustration {i + 1} placeholder
                    </div>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </Section>

        {/*Page3 illustrations*/}
        <Section id="biz-2">
          <div className="card" style={{ padding: 24 }}>
            <h2>Highlight #2: Profile background adapts to your browsing</h2>
            <p style={{ color: "var(--text-2)", marginTop: 6 }}>
              The profile theme changes based on product palettes. Two placeholders below for your mockups.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
              {[illus3a, illus3b].map((src, i) => (
                <figure key={i} className="card" style={{ aspectRatio: "16 / 9", overflow: "hidden" }}>
                  {src ? (
                    <img src={src} alt={`Highlight 2 – Illustration ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: "var(--muted)" }}>
                      Illustration {i + 1} placeholder
                    </div>
                  )}
                </figure>
              ))}
            </div>
          </div>
        </Section>

        {/*Page4 product */}
        <Section id="products">
          <DashboardPage />
        </Section>
      </div>
    </div>
  );
};

export default FullpageDashboard;
