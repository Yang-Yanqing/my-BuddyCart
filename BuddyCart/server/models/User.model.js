const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs")

const SALT_ROUNDS=parseInt(process.env.BCRYPT_SALT_ROUNDS||"10",10);


// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    name: { 
      type: String,
      required: [true, 'Name is required.']
    },  
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      select:false,
      minlength:6
    },
    profileImage:{type:String},
     role:{
      type:String,
      enum:["admin","vendor","customer"],
      default:"customer",
    },
    isVerified:{
      type:Boolean,
      default:false,
    } ,
   
    verificationTokenHash:String,
    verificationTokenExpires:Date,},

  {
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
);

//lets build a hook to ensure password creation and modification
//Remember Schema is a class,so it like a blueprint

userSchema.pre("save",async function(next){
  if(!this.isModified("password"))return next();
  const salt=await bcrypt.genSalt(SALT_ROUNDS);
  this.password=await bcrypt.hash(this.password,salt);
   next();
})

userSchema.pre("findOneAndUpdate", async function(next) {
  const update=this.getUpdate() || {};
  
  const toHash =
(update && update.password) ||
(update.$set && update.$set.password);

if (toHash) {
 const salt = await bcrypt.genSalt(SALT_ROUNDS);
 const hashed = await bcrypt.hash(toHash, salt);
if (update.password) update.password = hashed;
if (update.$set && update.$set.password) update.$set.password = hashed;
 this.setUpdate(update);
 }

  next();
});

userSchema.methods.comparePassword=function(p){
if (!this.password) return Promise.resolve(false);
return bcrypt.compare(p,this.password);
}

const User = model("User", userSchema);

module.exports = User;
