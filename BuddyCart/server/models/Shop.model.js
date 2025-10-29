const mongoose=require("mongoose");

const shopSchema=new mongoose.Schema(
 {
   name: { type: String, required: true, trim: true },
   slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
   description: { type: String, default: "" },
   logoUrl: { type: String, default: "" },
   owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
   { timestamps: true }
 );

 //MVP: a vendor=> one store
shopSchema.index({ owner: 1 }, { unique: true });

const Shop = mongoose.model("Shop", shopSchema);
module.exports = { Shop };
