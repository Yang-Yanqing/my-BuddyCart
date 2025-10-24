const mongoose=require("mongoose");

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, required: true },
  comment: String,
  date: Date,
  reviewerName: String,
  reviewerEmail: String
});

const productSchema=new mongoose.Schema(
    {
    externalId:{ type: Number, index: true, unique: true, sparse: true },
    title: { type: String, required: true },
    description: String,
    category: { type: String, index: true },
    brand: String,
    price: { type: Number, required: true },
    discountPercentage: Number,
    rating: Number,
    stock: { type: Number, default: 0 },
    sku: String,

     weight: Number,
     dimensions: {
    width: Number,
    height: Number,
    depth: Number
     },
     warrantyInformation: String,
     shippingInformation: String,
     availabilityStatus: {
     type: String,
     enum: ['In Stock', 'Out of Stock', 'Preorder'],
     default: 'In Stock' },
     returnPolicy: String,
     minimumOrderQuantity: { type: Number, default: 1 },

     images: [String],
     thumbnail: String,

     tags: [String],
     reviews: [reviewSchema],

    meta: {
    createdAt: Date,
    updatedAt: Date,
    barcode: String,
    qrCode: String
  }
    },{ timestamps: true }
)


productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    if (ret._id) ret._id = ret._id.toString();
    if (ret.createdAt instanceof Date) ret.createdAt = ret.createdAt.toISOString();
    if (ret.updatedAt instanceof Date) ret.updatedAt = ret.updatedAt.toISOString();
    return ret;
  },
});

productSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    if (ret._id) ret._id = ret._id.toString();
    if (ret.createdAt instanceof Date) ret.createdAt = ret.createdAt.toISOString();
    if (ret.updatedAt instanceof Date) ret.updatedAt = ret.updatedAt.toISOString();
    return ret;
  },
});

const Review=mongoose.model("Review",reviewSchema);
const Product=mongoose.model("Product",productSchema);

module.exports={ Review,Product };


