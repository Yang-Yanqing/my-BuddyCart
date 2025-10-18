import { useEffect, useState } from "react";
import { fetchProducts } from "./api"; 

export default function ProductsPage() {
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchProducts({ page: 1, limit: 12 });
        setData(res);
      } catch (e) { setErr(e.message); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <p>Loading…</p>;
  if (err) return <p style={{color:"red"}}>{err}</p>;

  return (
    <div style={{maxWidth: 1000, margin: "24px auto"}}>
      <h1>Products ({data.total})</h1>
      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(220px,1fr))", gap:16}}>
        {data.items.map(p => (
          <div key={p._id} style={{border:"1px solid #eee", borderRadius:12, padding:12}}>
            {p.thumbnail && <img src={p.thumbnail} alt={p.title} style={{width:"100%", borderRadius:8}} />}
            <h3>{p.title}</h3>
            <strong>€ {p.price}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
