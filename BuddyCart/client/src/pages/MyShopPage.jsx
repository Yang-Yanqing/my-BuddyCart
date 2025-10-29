 import { useEffect, useState } from "react";
 import { useAuth } from "../context/AuthContext";

 export default function MyShopPage(){
   const { token } = useAuth();
   const [shop, setShop] = useState(null);
   const [form, setForm] = useState({ name:"", description:"", logoUrl:"" });

   const headers = { "Content-Type":"application/json", "Authorization":`Bearer ${token}` };

   useEffect(()=>{
     fetch(`${import.meta.env.VITE_API_URL}/api/shops/me`,{ headers })
       .then(r=>r.ok?r.json():null).then(s=>{ if(s) { setShop(s); setForm({name:s.name,description:s.description,logoUrl:s.logoUrl}); }});
   },[]);

   const save = async ()=>{
     const method = shop? "PATCH":"POST";
     const url = shop? "/api/shops/me" : "/api/shops/me";
     const res = await fetch(`${import.meta.env.VITE_API_URL}${url}`,{
       method, headers, body: JSON.stringify(form)
     });
     const data = await res.json();
     if(res.ok){ setShop(data); }
   };

   return (
     <div>
       <h2>My Shop</h2>
       <input placeholder="Shop name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
       <input placeholder="Logo URL" value={form.logoUrl} onChange={e=>setForm({...form, logoUrl:e.target.value})}/>
       <textarea placeholder="Description" value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/>
       <button onClick={save}>{shop? "Update":"Create"}</button>
     </div>
   );
 }