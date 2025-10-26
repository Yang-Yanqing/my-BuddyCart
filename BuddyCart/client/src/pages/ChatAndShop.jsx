import React, { useState } from "react";
import ChatAndShopHeader from "../components/ChatAndShopHeader";
import DashboardPage from "./DashboardPage";
import ChatPage from "./ChatPage";

const ChatAndShop = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ChatAndShopHeader />

      <div
        className="shopchat-grid"
        style={{
          display: "grid",
          gridTemplateColumns: open ? "1fr min(520px, 38vw)" : "1fr",
          gap: 16,
          alignItems: "stretch",
          padding: 16,
        }}
      >
     
        <section className="card" style={{ padding: 0, overflow: "hidden" }}>
       
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 16px",
              borderBottom: "1px solid var(--line)",
              background: "var(--bg-elev-1)",
            }}
          >
            <h2 style={{ margin: 0, fontSize: 18 }}>Browse Products</h2>

            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <button
                className={`btn ${open ? "" : "btn-secondary"}`}
                onClick={() => setOpen((v) => !v)}
                aria-pressed={open}
              >
                {open ? "Hide Chat" : "Show Chat"}
              </button>
            </div>
          </div>

          <div style={{ padding: 16 }}>
            <DashboardPage />
          </div>
        </section>

  
        {open && (
          <aside
            className="card"
            style={{
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
        
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "12px 16px",
                borderBottom: "1px solid var(--line)",
                background: "var(--bg-elev-1)",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: 16,
                  color: "var(--text-2)",
                }}
              >
                Live Chat
              </h3>

              <div style={{ marginLeft: "auto" }}>
                <button className="btn" onClick={() => setOpen(false)}>
                  Close
                </button>
              </div>
            </div>

    
            <div
              style={{
                padding: 12,
                minHeight: 0,
                display: "flex",
                flex: 1,
              }}
            >
              <div style={{ flex: 1, minHeight: 0, width: "100%" }}>
               <ChatPage />
              </div>
            </div>
          </aside>
        )}
      </div>
    </>
  );
};

export default ChatAndShop;
