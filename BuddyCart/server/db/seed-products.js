const axios=require ('axios');

const getProducts=async (effectiveLimit,skip) =>{
    try{const res= await axios.get(`https://dummyjson.com/products?limit=${effectiveLimit}&skip=${skip}`);
    return res.data;
} 
   catch(err){console.error("We have trouble with the Api item");throw err} }

   module.exports={getProducts};