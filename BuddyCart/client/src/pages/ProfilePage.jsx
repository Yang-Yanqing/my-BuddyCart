import React from "react";
import { useAuth } from "../context/AuthContext";

const Row = ({ label, children }) => (
  <div style={{display:"grid",gridTemplateColumns:"120px 1fr",gap:12,marginBottom:8}}>
    <div style={{color:"#666"}}>{label}</div>
    <div>{children ?? "—"}</div>
  </div>
);

const Profile=()=>{
  const {user} = useAuth(); 

  if (!user) return <main><h2>Not logged in</h2></main>;

  return (
    <main style={{maxWidth:560, margin:"24px auto", padding:16}}>
      <div style={{
        border:"1px solid #eee",
        borderRadius:12,
        padding:20,
        background:"#fff",
        boxShadow:"0 4px 16px rgba(0,0,0,0.04)"
      }}>
        <header style={{display:"flex",alignItems:"center",gap:16, marginBottom:16}}>
          <Avatar name={user.name} src={user.profileImage} />
          <div>
            <h1 style={{margin:0}}>{user.name}</h1>
            <div style={{color:"#666"}}>{user.email}</div>
            {user.role && <Badge>{user.role}</Badge>}
          </div>
        </header>

        <section>
          <Row label="Verified">{user.isVerified ? "Yes" : "No"}</Row>
          {user.createdAt && (
            <Row label="Joined">
              {new Date(user.createdAt).toLocaleString()}
            </Row>
          )}
        </section>
      </div>
    </main>
  );
}

function Badge({ children }) {
  return (
    <span style={{
      display:"inline-block",
      padding:"2px 8px",
      border:"1px solid #e5e7eb",
      borderRadius:999,
      fontSize:12,
      color:"#2563eb",
      background:"#eff6ff",
      marginTop:6
    }}>{children}</span>
  );
}

function Avatar({ name = "?", src, size = 64 }) {
  const initials =
    (name || "?")
      .split(/\s+/).filter(Boolean).slice(0,2)
      .map(s => s[0]?.toUpperCase()).join("") || "?";
  const styleBox = {
    width:size, height:size, borderRadius:12,
    display:"flex", alignItems:"center", justifyContent:"center",
    background:"#f3f4f6", color:"#6b7280", fontWeight:600
  };
  if (src) return (
    <img src={src} alt={name} width={size} height={size}
         style={{...styleBox, objectFit:"cover"}}/>
  );
  return <div aria-hidden style={styleBox}>{initials}</div>;
}


export default  Profile;