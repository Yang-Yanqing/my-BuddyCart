// ShowcasePanel.jsx
import React, { useEffect, useState } from "react";

const ShowcasePanel = ({
  meName = "Me",
  peerName = "Peer",
  myItem = null,
  peerItem = null,
  onClearMine,
  onClearPeer,
  onRate,
}) => {
  const [target, setTarget] = useState(peerItem ? "peer" : "mine");

  useEffect(() => {
    if (target === "mine" && !myItem && peerItem) setTarget("peer");
    if (target === "peer" && !peerItem && myItem) setTarget("mine");
  }, [target, myItem, peerItem]);

  const ensureValidTarget = (t) => {
    if (t === "mine" && !myItem) return peerItem ? "peer" : "mine";
    if (t === "peer" && !peerItem) return myItem ? "mine" : "peer";
    return t;
  };
  const setTargetSafe = (t) => setTarget(ensureValidTarget(t));

  const emojis = [
    { key: "best", icon: "😍", label: "best" },
    { key: "good", icon: "🙂", label: "good" },
    { key: "ok", icon: "😐", label: "ok" },
    { key: "bad", icon: "🙁", label: "bad" },
    { key: "worst", icon: "💩", label: "worst" },
  ];

  const onClickRate = (rKey) => {
    const tgt = ensureValidTarget(target);
    if (!onRate) return;
    if (tgt === "mine" && !myItem) return;
    if (tgt === "peer" && !peerItem) return;
    onRate(tgt, rKey);
  };

  return (
    <section className="showcase-2slots" style={wrap}>
      <div style={slotsRow}>
        <Slot
          title={meName}
          item={myItem}
          onClear={onClearMine}
          active={target === "mine"}
          onSelect={() => setTargetSafe("mine")}
        />
        <Slot
          title={peerName}
          item={peerItem}
          onClear={onClearPeer}
          active={target === "peer"}
          onSelect={() => setTargetSafe("peer")}
        />
      </div>

      <div style={rateBar}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ opacity: 0.7, fontSize: 14 }}>
            Score <b style={{ margin: "0 4px" }}>{target === "mine" ? meName : peerName}</b> item
          </span>
          <div style={{ display: "flex", gap: 8 }}>
            {emojis.map((e) => (
              <button
                key={e.key}
                type="button"
                title={e.label}
                onClick={() => onClickRate(e.key)}
                style={emojiBtn}
              >
                <span style={{ fontSize: 20, lineHeight: 1 }}>{e.icon}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <ToggleBtn active={target === "mine"} onClick={() => setTargetSafe("mine")} label={meName} />
          <ToggleBtn active={target === "peer"} onClick={() => setTargetSafe("peer")} label={peerName} />
        </div>
      </div>
    </section>
  );
};

function Slot({ title, item, onClear, active, onSelect }) {
  return (
    <div
      className={`slot ${active ? "is-active" : ""}`}
      onClick={onSelect}
      style={{
        ...slotBox,
        borderColor: active ? "#111827" : slotBox.borderColor,
        boxShadow: active ? "0 0 0 2px #11182710" : "none",
      }}
    >
      <div style={slotHeader}>
        <span style={{ fontWeight: 600 }}>{title}</span>
        {item ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClear?.();
            }}
            style={clearBtn}
          >
            Remove
          </button>
        ) : (
          <span style={{ opacity: 0.6, fontSize: 12 }}>空位</span>
        )}
      </div>
      {item ? (
        <div style={slotBody}>
          <div style={thumbBox}>
            {item.thumbnail || item.image ? (
              <img
                src={item.thumbnail || item.image}
                alt={item.title || "item"}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                loading="lazy"
              />
            ) : (
              <div style={thumbPh}>No image</div>
            )}
          </div>
          <div style={{ fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {item.title || "Untitled"}
          </div>
        </div>
      ) : (
        <div style={slotEmpty}>After clicking “Share to booth” on a product, it will appear here.</div>
      )}
    </div>
  );
}

function ToggleBtn({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        height: 32,
        padding: "0 12px",
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        background: active ? "#111827" : "#fff",
        color: active ? "#fff" : "#111827",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

// ---- inline styles（可被全局样式覆盖）----
const wrap = { display: "flex", flexDirection: "column", gap: 12 };
const slotsRow = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 };
const slotBox = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, minHeight: 140, cursor: "pointer" };
const slotHeader = { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 };
const slotBody = { display: "flex", alignItems: "center", gap: 10 };
const slotEmpty = { height: 96, display: "grid", placeItems: "center", opacity: 0.6, fontSize: 13 };
const thumbBox = { width: 64, height: 64, borderRadius: 8, overflow: "hidden", background: "#f3f4f6", flex: "0 0 auto" };
const thumbPh = { width: "100%", height: "100%", display: "grid", placeItems: "center", fontSize: 12, opacity: 0.6 };
const rateBar = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, border: "1px solid #e5e7eb", borderRadius: 12, padding: 10 };
const emojiBtn = { height: 36, width: 36, borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" };
const clearBtn = { height: 28, padding: "0 10px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontSize: 12 };

export default ShowcasePanel;
