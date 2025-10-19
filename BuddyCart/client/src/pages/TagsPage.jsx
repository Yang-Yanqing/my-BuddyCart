import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function TagPage() {
  const { tag } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      const res = await fetch(`https://dummyjson.com/products/category/${tag}`);
      const data = await res.json();
      setProducts(data.products || []);
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
              <p>${p.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
