import { useEffect,useRef } from "react";

const ChatMessages=({messages=[],currentUserId})=>{
    const listRef=useRef(null);

    useEffect(()=>{
        const e=listRef.current;
        if(!e)return;
        e.scrollTop=e.scrollHeight
    },[messages])

    return (
    <div
      ref={listRef}
      className="messagesScroll"
      style={{
        height: "60vh",
        overflowY: "auto",
        padding: 12,
        background: "#fafafa",
        borderRadius: 8,
      }}
    >
      {messages.map((m,idx)=>{
        const isSelf =
          m?.user?.userId && currentUserId && m.user.userId===currentUserId;
        const key=m?.id??`${m?.ts ?? "t"}_${idx}`;

        return (
          <div
            key={key}
            style={{
              maxWidth:"85%",
              margin:isSelf?"8px 0 8px auto":"8px 0",
              background:isSelf?"#eef2f7":"#fff",
              borderRadius:12,
              padding:"8px 10px",
              boxShadow:"0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{fontSize: 12,color: "#667085",marginBottom: 4}}>
              <strong>{m?.user?.name || "User"}</strong>
              {m?.type==="comment" ? (
                <span style={{marginLeft: 8, fontSize: 11, opacity: 0.8}}>
                  [comment]
                </span>
              ) : null}
              {m?.ts ? (
                <span style={{marginLeft: 8}}>
                  {new Date(m.ts).toLocaleTimeString()}
                </span>
              ) : null}
            </div>
            <div
              style={{
                whiteSpace:"pre-wrap",
                wordBreak:"break-word",
                fontSize:14,
              }}
            >
              {m?.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatMessages;