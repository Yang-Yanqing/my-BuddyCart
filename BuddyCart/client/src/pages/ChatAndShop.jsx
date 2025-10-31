import React, { useState } from "react";
import ChatAndShopHeader from "../components/ChatAndShopHeader";
import DashboardPage from "./DashboardPage";
import ChatPage from "./ChatPage";
import productId from "../utils/productId";

const ChatAndShop = () => {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [shareTick, setShareTick] = useState(0);

  return (
    <>
      <ChatAndShopHeader />

      <div
        className="chat-and-shop"
        style={{
          display: "grid",
          gridTemplateColumns: open ? "1fr min(520px, 38vw)" : "1fr",
          gap: "16px",
          alignItems: "stretch",
          padding: "16px",
          position: "relative",
        }}
      >
 
        <section
          className="card"
          style={{
            padding: 0,
            overflow: "hidden",
            position: "relative",
            zIndex: 5,
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
            <h2 style={{ margin: 0, fontSize: 18 }}>Browse Products</h2>

            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <button
                className={`btn ${open ? "" : "btn-secondary"}`}
                onClick={() => setOpen((v) => !v)}
                aria-pressed={open}
              >
                {open ? "Hide Chat" : "Show Chat"}
              </button>
              <button
                className="btn"
                disabled={!selectedProduct || !open}
                title={
                  !open
                    ? "Open chat first"
                    : selectedProduct
                    ? "Attach selected product"
                    : "Pick a product"
                }
                onClick={() => setShareTick((t) => t + 1)}
              >
                Attach to chat
              </button>
            </div>
          </div>

          <div style={{ padding: 16 }}>
            <DashboardPage
   selectMode
   selectedId={productId(selectedProduct)}
   onSelect={(item) => setSelectedProduct(item)}
 />
          </div>


          {!open && (
            <button
              onClick={() => setOpen(true)}
              style={{
                position: "fixed",
                bottom: 20,
                right: 20,
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: 60,
                height: 60,
                cursor: "pointer",
                fontSize: 24,
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                zIndex: 999,
              }}
              title="Open Chat"
            >
              💬
            </button>
          )}
        </section>

     
        {open && (
          <aside
            className="card"
            style={{
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
              position: "sticky",
              top: 16,
              height: "calc(100vh - 32px)",
              overflow: "hidden",
              zIndex: 1,
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
                overflow: "auto",
              }}
            >
              <div style={{ flex: 1, minHeight: 0, width: "100%" }}>
                <ChatPage
                  selectedProduct={selectedProduct}
                  shareTick={shareTick}
                />
              </div>
            </div>
          </aside>
        )}
      </div>
    </>
  );
};
export default ChatAndShop;
