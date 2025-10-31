import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import http from "../config/api";

export default function TagPage() {
  const { tag } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {

    async function loadProducts() {
      const { data } = await http.get("/products", {
        params: { category: tag, limit: 60, _: Date.now() },
         });
      setProducts(data?.products || data || []);
    }
    loadProducts();
  }, [tag]);

  return (
    <div>
      <h1>{tag.replace(/-/g, " ")}</h1>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div>
          {products.map((p) => (
            <div key={p.id}>
              <img src={p.thumbnail} alt={p.title} />
              <h3>{p.title}</h3>
              <p>€{p.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
