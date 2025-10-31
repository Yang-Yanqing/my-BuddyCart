import { useEffect, useState } from "react";
import http from "../config/api";
import { useAuth } from "../context/AuthContext";

export default function AdminRoleRequests() {
  const { token } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setErr("");
      const { data } = await http.get("/admin/role-requests?status=pending", {
        headers: { Authorization:`Bearer ${token}`}
      });
      setRows(data || []);
    } catch (e) {
      setErr(e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const act = async (id, action) => {
    try {
      const url = `/admin/role-requests/${id}/${action}`; 
      await http.post(url,{},{ headers:{Authorization:`Bearer ${token}`}});
      await load();
    } catch (e) {
      alert(e.response?.data?.message || e.message);
    }
  };

  if (loading) return <div style={{padding:24}}>Loading role requests…</div>;
  if (err) return <div style={{padding:24, color:"crimson"}}>Error: {err}</div>;

  return (
    <div style={{padding:24}}>
      <h2 style={{marginBottom:16}}>Pending Role Requests</h2>
      {rows.length === 0 ? (
        <div style={{color:"#777"}}>No pending requests.</div>
      ) : (
        <table style={{width:"100%", borderCollapse:"collapse"}}>
          <thead>
            <tr style={{textAlign:"left"}}>
              <th style={{borderBottom:"1px solid #ddd", padding:"8px"}}>User</th>
              <th style={{borderBottom:"1px solid #ddd", padding:"8px"}}>Email</th>
              <th style={{borderBottom:"1px solid #ddd", padding:"8px"}}>Requested Role</th>
              <th style={{borderBottom:"1px solid #ddd", padding:"8px"}}>Created At</th>
              <th style={{borderBottom:"1px solid #ddd", padding:"8px"}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r._id}>
                <td style={{borderBottom:"1px solid #eee", padding:"8px"}}>{r.user?.name || r.userId}</td>
                <td style={{borderBottom:"1px solid #eee", padding:"8px"}}>{r.user?.email || "-"}</td>
                <td style={{borderBottom:"1px solid #eee", padding:"8px"}}>{r.requestedRole}</td>
                <td style={{borderBottom:"1px solid #eee", padding:"8px"}}>{new Date(r.createdAt).toLocaleString()}</td>
                <td style={{borderBottom:"1px solid #eee", padding:"8px"}}>
                  <button onClick={() => act(r._id,"approve")} style={{marginRight:8}}>Approve</button>
                  <button onClick={() => act(r._id,"reject")} style={{color:"white", background:"#c44", border:"none", padding:"6px 10px", borderRadius:6}}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
