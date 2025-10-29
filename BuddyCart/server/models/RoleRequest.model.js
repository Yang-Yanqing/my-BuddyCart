const mongoose=require("mongoose");

const roleRequestSchema=new mongoose.Schema({
    user:{type:mongoose.Types.ObjectId,ref:"User",required:true,index:true},
    requestedRole:{type:String,enum:["vendor","admin"],required:true},

    status:{type:String,enum:["pending","closed"],default:"pending", index:true},
    reviewStatus:{type:String,enum:["approved","rejected"],default:undefined,index:true},
    reviewBy:{type:mongoose.Types.ObjectId,ref:"User"},
    reviewDate:{type:Date},
    reviewReason:{type:String},
},
{timestamps:true}
)

const RoleRequest=mongoose.model("RoleRequest",roleRequestSchema);
module.exports={RoleRequest};