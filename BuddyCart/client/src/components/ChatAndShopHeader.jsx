import { Link } from "react-router-dom";
import ListItem from "../components/ListItem";


const ChatAndShopHeader=()=>{
return (
<header
style={{
display: "flex",
alignItems: "center",
gap: 12,
padding: "10px 16px",
borderBottom: "1px solid var(--line)",
background:"var(--bg-elev-1)",
}}
>
<Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
{/* 占位 Logo */}
<div
aria-label="Site Logo"
style={{
width: 28,
height: 28,
borderRadius: 6,
background: "linear-gradient(135deg, #999, #ccc)",
border: "1px solid var(--line)",
}}
/>
<strong style={{color:"var(--text)", fontSize: 16 }}>Shop & Chat</strong>
</Link>

<div style={{ marginLeft: "auto" }}>
<Link className="btn" to="/profile" aria-label="Go to profile">
Profile
</Link>
</div>
</header>
);
}

export default ChatAndShopHeader;