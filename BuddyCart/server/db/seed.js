// utils/seed.js
const { Product } = require("../models/Product.model");

async function seedIfEmpty() {
  const count = await Product.countDocuments();
  if (count > 0) return 0; 


  const res = await fetch("https://dummyjson.com/products?limit=60");
  const data = await res.json();

  const docs = (data.products || []).map(p => ({
    title: p.title,
    description: p.description,
    price: p.price,
    category: p.category,
    thumbnail: p.thumbnail,
    images: p.images,
    rating: p.rating,
    stock: p.stock,
    owner: null,         
    source: "dummyjson", 
  }));

  if (!docs.length) return 0;
  await Product.insertMany(docs, { ordered: false });
  return docs.length;
}

module.exports = { seedIfEmpty };
