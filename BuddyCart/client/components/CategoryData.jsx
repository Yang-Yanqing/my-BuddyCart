const divisions = {
  Fashion: [
    "mens-shirts",
    "mens-shoes",
    "mens-watches",
    "womens-dresses",
    "womens-shoes",
    "womens-bags",
    "womens-jewellery",
    "womens-watches",
    "tops",
    "sunglasses",
  ],
  "Beauty & Personal Care": ["beauty", "fragrances", "skin-care"],
  "Home & Living": [
    "furniture",
    "home-decoration",
    "kitchen-accessories",
    "groceries",
  ],
  "Electronics & Gadgets": [
    "smartphones",
    "laptops",
    "tablets",
    "mobile-accessories",
  ],
  "Automotive & Sports": ["vehicle", "motorcycle", "sports-accessories"],
};

async function fetchTaggedProducts() {
  const res = await fetch("https://dummyjson.com/products?limit=100");
  const data = await res.json();

  return data.products.map((p) => {
    const division = Object.keys(divisions).find((key) =>
      divisions[key].includes(p.category)
    );
    return { ...p, division: division };
  });
}

export { divisions, fetchTaggedProducts };
