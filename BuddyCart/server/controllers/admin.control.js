const {getProducts}=require("../db/seed-products")
const {Product}=require("../models/Product.model");




const syncProducts=async (req,res,next)=>{
    try {
        const limit=parseInt(req.query.limit || '190');
        const skip=parseInt(req.query.skip || '0');

        const {products=[]}= await getProducts(limit,skip);
        if(!products.length){return res.status(200).json({message:"No products from API,PLEASE CHECK."})}
        
        const allProducts=products.map((p)=>{const items={
        externalId: p.id,
        title: p.title,
        description: p.description,
        category: p.category,
        brand: p.brand,
        price: p.price,
        discountPercentage: p.discountPercentage,
        rating: p.rating,
        stock: p.stock,
        sku: p.sku,
        weight: p.weight,
        dimensions: p.dimensions,
        warrantyInformation: p.warrantyInformation,
        shippingInformation: p.shippingInformation,
        availabilityStatus: p.availabilityStatus,
        returnPolicy: p.returnPolicy,
        minimumOrderQuantity: p.minimumOrderQuantity,
        images: p.images,
        thumbnail: p.thumbnail,
        tags: p.tags,
        meta: p.meta
        }
        return {updateOne:{
        filter:{externalId:items.externalId},
        update:{$set:items},
        upsert:true
     }}
     })
     const result = await Product.bulkWrite(allProducts,{ordered:false});
     res.status(200).json({
        message:'API products fetched and synced to local database.',
        fetched: products.length,
        upserted: result.upsertedCount,
        modified: result.modifiedCount
     })
    } catch (err) {
         console.error('Sync failed in admincontrol:', err);
         next(err);
    }
}


const cleanProductsInDb=async (req,res,next)=>{
    try {
      const result=await Product.deleteMany({});
      return res.status(200).json({
        message: "All products in local DB have been deleted.",
        deletedCount:result.deletedCount ?? 0,
      })
    } catch (err) {
        console.error("Delete failed in admincontrol:",err);
        next(err)
    }
}
module.exports={syncProducts,cleanProductsInDb};