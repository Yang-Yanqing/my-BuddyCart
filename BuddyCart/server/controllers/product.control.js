const {Product} = require("../models/Product.model");


async function createProduct(req,res,next) {
  try {
    const doc=new Product({
      ...req.body,
      owner:req.user.id
    })
    const saved=await doc.save();
    return res.status(201).json(saved);    
  } catch (err) {
    return next(err);
  }
}

async function updateProduct(req,res,next) {
  try {
    const {id}=req.params;
    const update={...req.body};
    if("owner" in update)delete update.owner;

    let result;
    if(req.user.role==="admin"){
      result=await Product.findByIdAndUpdate(id,update,{new:true,runValidators:true});
    }
    else{
      result=await Product.findByIdAndUpdate(
        {_id:id,owner:req.user.id},
        update,
        {new:true}
      )
    }

    if(!result){return res.status(404).json({error:"Not found or no permission."})};

    return res.json(result);
  } catch (err) {
    return next(err);
  }
}

async function deleteProduct(req,res,next) {
  try {
    const {id}=req.params;
    let result;
    if(req.user.role==="admin"){
      result=await Product.findByIdAndDelete(id);
    }else{
      result=await Product.findByIdAndDelete({_id:id,owner:req.user.id});
    }

    if(!result){return res.status(404).json({error:"Not found or no permission"})}
    return res.json({ok:true,id:result._id});
  } catch (err) {
    return next(err);
  }
}



async function listProducts(req, res, next) {
  try {
    const page = parseInt(req.query.page || "1");
    const limit = parseInt(req.query.limit || "12");
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find().sort({ _id: 1 }).skip(skip).limit(limit),
      Product.countDocuments(),
    ]);
    res.set('Cache-Control', 'no-store');
    res.status(200).json({
      success: true,
      total,
      page,
      products,
    });
  } catch (err) {
    console.error("Fetch products failed in productcontroller:", err);
    next(err);
  }
};

module.exports={
  createProduct,
  updateProduct,
  deleteProduct,
  listProducts
};