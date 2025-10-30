import {useEffect,useRef,useState,useMemo} from "react";
import{io} from "socket.io-client"
import ChatInput from "../components/ChatInput";
import ChatMessages from "../components/ChatMessages";
import ShowcasePanel from "../components/ShowcasePanel";
import {useAuth} from "../context/AuthContext";
import {useParams} from "react-router-dom";

const SOCKET_URL=(typeof import.meta!=="undefined"&&import.meta.env &&import.meta.env.VITE_SOCKET_URL)||
process.env.REACT_APP_SOCKET_URL||
"https://buddycart-server.onrender.com";  
const NAMESPACE="/chat"; 
const SOCKET_PATH="/socket.io";   

const ChatPage=({selectedProduct, shareTick})=>{
    const {token,user,isAuthenticated,logOut}=useAuth();
    const {roomId:roomParam}=useParams();

    const roomId=roomParam||"lobby"
    
    const displayName = useMemo(
     () => (user?.name || user?.displayName || user?.username || (user?.email ? user.email.split("@")[0] : null) || "Guest"),
      [user]
    );

    const[copied,setCopied]=useState(false);
    
    const copyRoomCode=async() => {
    try {
     await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(()=>setCopied(false),1500);
   } catch (e) {
     const ok=window.prompt("You can copy the roomId", roomId);
     if (ok!==null) setCopied(true);
   }
  };

    const [myItem,setMyItem]=useState(null);
    const [peerItem,setPeerItem]=useState(null);

    
    const [messages,setMessages]=useState([]);
    const [connected,setConnected]=useState(false);
    const socketRef=useRef(null);

    useEffect(()=>
    {
      if (!isAuthenticated) {
        setConnected(false);
        setMessages([]);
        setMyItem(null);
        setPeerItem(null);
      return;
    }
    if(!roomId)return;

    const socket = io(`${SOCKET_URL}${NAMESPACE}`, {
        auth: { token, name: displayName, avatar: user?.profileImage || null },
        query: { roomId, token },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        withCredentials: true,
        path: SOCKET_PATH,
      });

           socketRef.current=socket;

      socket.on("connect",()=>{setConnected(true);socket.emit("join_room",{roomId})});
      socket.on("disconnect",()=>setConnected(false));
      
      socket.on("connect_error",(err)=>{console.error("connect_error", err?.message || err);
      if (String(err?.message||"").includes("401")) {logOut?.();}});

      socket.on("room_state",(s)=>s.recentMessages&&setMessages(s.recentMessages));

      socket.on("message",(m)=>setMessages((prev)=>[...prev,m].slice(-300)));

      socket.on("chat:error",(err)=>{console.error("chat:error",err)});

      return () => {
        try {
        socket.emit("leave_room", {roomId});
      } catch {}
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };}, [roomId, token, isAuthenticated, logOut,displayName]);

    useEffect(() => {
      if (!token || !isAuthenticated || !roomId) return;

      }, [roomId, token, isAuthenticated, logOut, displayName]);

   useEffect(()=>{
    if (!shareTick) return;                 
    if (!selectedProduct) return;
    if (!connected) return;
    const socket = socketRef.current;
    if (!socket) return;
    
    socket.emit("showcase:set", { item: selectedProduct });

    
  }, [shareTick, selectedProduct, connected]);
 
useEffect(() => {
  const handler = (e) => {
    const item = e.detail;
    if (item && socketRef.current) {
      socketRef.current.emit("showcase:set", { item });
    } else {
      alert("Chat not connected yet — open chat first!");
    }
  };
  window.addEventListener("share-to-showcase", handler);
  return () => window.removeEventListener("share-to-showcase", handler);
}, []);

    useEffect(()=>{
        const socket=socketRef.current;
        if (!socket) return;

    const onShowcase=(s)=>{
      setMyItem(s?.mine || null);
      setPeerItem(s?.peer || null);
    };

    socket.on("showcase_state", onShowcase);
    return () => {socket.off("showcase_state", onShowcase);};
  }, [connected]);

  
  const onSend=(text)=>{if (!text?.trim()) return;
    if (!connected||!socketRef.current) return;
    const tempId=`tmp_${Date.now()}`;
    socketRef.current.emit("send_message",{roomId,type:"chat",text,tempId});
  };

  const shareToShowcase=(item)=>{
     if(!item) return;
    socketRef.current?.emit("showcase:set", { item });
  };
  const clearMine=()=>socketRef.current?.emit("showcase:clear", { owner: "mine" });
  const clearPeer=()=>socketRef.current?.emit("showcase:clear", { owner: "peer" });
  const rate=(target, ratingKey)=>{
    if(!target||!ratingKey) return;
    socketRef.current?.emit("showcase:rate",{target,rating:ratingKey});
  };


    const inviteOnceRef = useRef({});
 useEffect(() => {
   if (!isAuthenticated) return;
   const inviteId = `local_invite_${roomId}`;
   if (inviteOnceRef.current[inviteId]) return;

   const displayName =
     user?.name || user?.displayName || user?.username || "I";
   const inviteText =
     `Hey, I'm ${displayName}, come hang out and chat with me! ` +
     `Copy the room code to join: ${roomId}`;

   const inviteMsg = {
     id: inviteId,
     type: "info",
     text: inviteText,
     ts: Date.now(),
     meta: "roomInvite",
     user: { userId: "system", name: "System", avatar: null },
   };

   setMessages((prev = []) => {
     const cleaned = prev.filter((m) => m?.id !== inviteId && m?.meta !== "roomInvite"
     );
     return [inviteMsg, ...cleaned];
   });
   inviteOnceRef.current[inviteId] = true;
 }, [isAuthenticated, roomId, user]);
  
   const currentUserId = useMemo(()=> user?.id || user?._id || null, [user]);



return(
    <main>
       <div className="card" style={{marginBottom:12,padding:"10px 12px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ lineHeight:1.3 }}>
         <div style={{ fontSize:14, opacity:0.8}}>Current room</div>
        <div style={{ fontWeight:600 }}>{roomId}</div>
     </div>
     <button className="btn" style={{ marginLeft: "auto" }} onClick={copyRoomCode}>
        {copied ? "Copied":"Copy roomId"}
       </button>
      </div>

        <div className="chatInput">
            <ChatMessages messages={messages} currentUserId={currentUserId}/>
            <br/>
             <ChatInput onSend={onSend} disabled={!connected||!isAuthenticated}maxLen={500}/>
            {!connected && isAuthenticated && (
          <p style={{opacity:0.7}}>Connecting to the chat service…</p>
        )}
        {!isAuthenticated && (
          <p style={{opacity:0.7}}>Please log in before starting to chat.</p>
        )}
           
           <ShowcasePanel meName="me"
                          peerName="peer"
                          myItem={myItem}
                          peerItem={peerItem}
                          onClearMine={clearMine}
                          onClearPeer={clearPeer}
                          onRate={rate}/>
        
<div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
  {["😍", "😊", "😮", "😡", "💩"].map((emo) => (
    <button
      key={emo}
      onClick={() => onSend(emo)} 
      style={{
        fontSize: 22,
        background: "none",
        border: "none",
        cursor: "pointer",
      }}
      title={`Send ${emo}`}
    >
      {emo}
    </button>
  ))}


  <button
    onClick={() => {
      if (!connected) {
        alert("Chat not connected yet — open chat first!");
        return;
      }
      if (!myItem) {
        alert("Please share a product first before scoring it.");
        return;
      }
  
      onSend("⭐ I scored my shared item!");
    
      socketRef.current?.emit("showcase:rate", { target: myItem, rating: "⭐" });
    }}
    className="btn"
    style={{ marginLeft: "auto", padding: "6px 12px", borderRadius: 6 }}
  >
    Score me item
  </button>
</div>

        </div>
    </main>
)
}

export default ChatPage;