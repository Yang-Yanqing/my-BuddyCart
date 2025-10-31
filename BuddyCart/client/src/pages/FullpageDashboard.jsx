import React, { useRef, useEffect } from "react";
import DashboardPage from "./DashboardPage";
import "./FullpageDashboard.css";

// ===== Images (from your Cloudinary) =====
const HERO_HARO =
  "https://res.cloudinary.com/dtcgrtslg/image/upload/v1761873820/504854c7-aff4-4720-a280-ecc1b2d7379e_zpmal5.png";
const ILLUS_2 =
  "https://res.cloudinary.com/dtcgrtslg/image/upload/v1761873820/be6459e6-7fbb-45b0-9dbd-4eb0ce310be2_gyti0n.png";
const ILLUS_3 =
  "https://res.cloudinary.com/dtcgrtslg/image/upload/v1761873820/47a29b02-36da-4ce6-86a9-06c07618b621_rlj82i.png";
const ILLUS_4 =
  "https://res.cloudinary.com/dtcgrtslg/image/upload/v1761873820/%E7%AC%AC%E4%BA%8C%E9%A1%B5-%E7%AE%80%E5%8E%86%E6%B8%90%E5%8F%98%E4%BB%8B%E7%BB%8D%E5%9B%BE_iievph.png";
const ILLUS_5 =
  "https://res.cloudinary.com/dtcgrtslg/image/upload/v1761874749/0af07b75-99de-4124-90b6-0504ee1fc91d_y3wwnx.png";

const Section = ({ id, className = "", children }) => (
  <section id={id} className={`snap-section mondrian-section ${className}`}>
    <div className="container">{children}</div>
  </section>
);


const TwoCol = ({ left, right }) => (
  <div className="grid-2">
    <div className="card mondrian-tile">{left}</div>
    <div className="card mondrian-tile">{right}</div>
  </div>
);


const TextBlock = ({ title, subtitle }) => (
  <div className="mondrian-card" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <h2 style={{ margin: 0 }}>{title}</h2>
    <p className="muted" style={{ fontStyle: "italic", fontSize: "0.95rem", marginTop: 6 }}>
      {subtitle}
    </p>
  </div>
);

const FullpageDashboard = () => {
  const scrollerRef = useRef(null);

  const scrollTo = (id) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.style.overscrollBehavior = "contain";
    el.style.webkitOverflowScrolling = "touch";
    el.style.scrollSnapType = "y proximity";
  }, []);

  return (
    <div className="fullpage-root mondrian-bg">
      <div ref={scrollerRef} className="snap-container">
        {/* Page 1 */}
        <Section id="hero" className="hero-section">
          <div className="hero-card glass">
            <div
              className="hero-art"
              aria-hidden
              style={{
                backgroundImage: `
                  linear-gradient(180deg, rgba(0,0,0,.28), rgba(0,0,0,.12) 40%, rgba(0,0,0,0)),
                  url(${HERO_HARO})
                `,
              }}
            />
            <div className="hero-content">
              <h1>Chinese Street Vibes · Shopping × Chat × Community</h1>
              <p>Discover great products, bring friends into chat, and share your picks together.</p>
              <div className="cta-row">
                <button className="btn btn-primary" onClick={() => scrollTo("biz-2")}>
                  See Highlights
                </button>
                <button className="btn btn-secondary" onClick={() => scrollTo("products")}>
                  Browse Products
                </button>
              </div>
            </div>
          </div>
        </Section>

        {/* Page 2  */}
        <Section id="biz-2">
          <TwoCol
            left={
              <figure style={{ margin: 0 }}>
                <img src={ILLUS_2} alt="Illustrations 2" />
              </figure>
            }
            right={
              <TextBlock
                title={"Three-tier role management."}
                subtitle={"—Basion is indeed a master of operations management."}
              />
            }
          />
        </Section>

        {/* Page 3 */}
        <Section id="biz-3">
          <TwoCol
            left={<TextBlock title={"Virtual shop concept."} subtitle={"—You two, set up your own stalls."} />}
            right={
              <figure style={{ margin: 0 }}>
                <img src={ILLUS_3} alt="Illustrations 3" />
              </figure>
            }
          />
        </Section>

        {/* Page 4 */}
        <Section id="biz-4">
          <TwoCol
            left={
              <figure style={{ margin: 0 }}>
                <img src={ILLUS_4} alt="Illustrations 4" />
              </figure>
            }
            right={
              <TextBlock
                title={"Product click feedback capture."}
                subtitle={"—Basion, who knew you had such a girlish heart."}
              />
            }
          />
        </Section>

        {/* Page 5  */}
        <Section id="biz-5">
          <TwoCol
            left={
              <TextBlock
                title={"Chatroom showcase."}
                subtitle={"—Everyone tell me if I have taste; the EQ test starts now."}
              />
            }
            right={
              <figure style={{ margin: 0 }}>
                <img src={ILLUS_5} alt="Illustrations 5" />
              </figure>
            }
          />
        </Section>

        {/* Page 6 */}
        <Section id="products" className="last-section">
          <div className="card glass">
            <DashboardPage />
          </div>
        </Section>
      </div>
    </div>
  );
};

export default FullpageDashboard;
