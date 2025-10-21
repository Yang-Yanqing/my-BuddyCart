const mongoose=require("mongoose");

const roleRequestSchema=new mongoose.Schema({
    user:{type:mongoose.Types.ObjectId,ref:"User",required:true},
    requestedRole:{type:String,enum:["vendor","admin"],required:true},
    reviewStatus:{type:String,enum:["pending","approved","rejected"],default:"pending"},
    reviewBy:{type:mongoose.Types.ObjectId,ref:"User"},
    reviewDate:Date,
    reviewReason:String,
},
{timestamps:true}
)

module.exports=mongoose.model("RoleRequest",roleRequestSchema)