const mongoose=require("mongoose");
const connectDB=require('./db');
const express=require("express");

const app=express();

connectDB();

app.use(express.json());

app.use("/api/beta1/admin",require("./routes/admin.routes"));
app.use("/api/products", require("./routes/product.routes"));


const globalErrorHandler=require("./middleware/error")
app.use(globalErrorHandler);

module.exports = app;