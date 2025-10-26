import {useEffect,useRef,useState} from "react";
import{io} from "socket.io-client"
import ChatInput from "../components/ChatInput";
import ChatMessages from "../components/ChatMessages";
import ShowcasePanel from "../components/ShowcasePanel";
import {useAuth} from "../context/AuthContext";
import {useParams,useNavigate} from "react-router-dom";

const SOCKET_URL=(typeof import.meta!=="undefined"&&import.meta.env &&import.meta.env.VITE_SOCKET_URL)||process.env.REACT_APP_SOCKET_URL||"http://localhost:5005";  
const NAMESPACE="/chat"; 
const SOCKET_PATH="/socket.io";   

const ChatPage=()=>{
    const {token,user,isAuthenticated,logOut}=useAuth();
    const {roomId:roomParam}=useParams();

    const roomId=roomParam||"lobby"

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
      return;
    }
    if(!roomId)return;

      const socket=io(`${SOCKET_URL}${NAMESPACE}`,{
        auth:{token},
        transports:["websocket"],
        reconnection: true,
        reconnectionAttempts:5,
        reconnectionDelay:1000,
        withCredentials: true,
        path: SOCKET_PATH,});

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
    };}, [roomId, token, isAuthenticated, logOut]);

  
    useEffect(()=>{
        const socket=socketRef.current;
        if (!socket) return;

    const onShowcase=(s)=>{setMyItem(s?.mine || null);
      setPeerItem(s?.peer || null);
    };

    socket.on("showcase_state", onShowcase);
    return () => {socket.off("showcase_state", onShowcase);};
  }, []);

  
  const onSend=(text)=>{if (!text?.trim()) return;
    if (!connected||!socketRef.current) return;
    const tempId=`tmp_${Date.now()}`;
    socketRef.current.emit("send_message",{roomId,type:"chat",text,tempId});
  };

  const shareToShowcase=(item)=>{
    socketRef.current?.emit("showcase:set", { item });
  };
  const clearMine=()=>socketRef.current?.emit("showcase:clear", { owner: "mine" });
  const clearPeer=()=>socketRef.current?.emit("showcase:clear", { owner: "peer" });
  const rate=(target, ratingKey)=>{
    socketRef.current?.emit("showcase:rate",{target,rating:ratingKey});
  };

  
     const currentUserId=user?.id||user?._id||null;



return(
    <main>
        <div className="chatInput">
            <ChatMessages messages={messages} currentUserId={currentUserId}/>
            <br/>
            <ChatInput onSend={onSend} disabled={false} maxLen={500}/>
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
        </div>
    </main>
)
}

export default ChatPage;