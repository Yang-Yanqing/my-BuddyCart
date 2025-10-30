// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();


// ℹ️ Connects to the database
require("./db");
const cors = require('cors');
// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// const chatNameSpace=require("./middleware/chatNameSpace")

const app = express();

 const allowedOrigins = [
   'http://localhost:3000',
   'https://buddycart-client.netlify.app'
 ];

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);
app.use(
   cors({origin: function (origin, cb) {
       if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
       return cb(new Error('Not allowed by CORS'));
     },
     credentials: true,
     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
     allowedHeaders: ['Content-Type', 'Authorization'],
   })
 );
app.use("/api/admin", require("./routes/admin.routes"));
app.use("/api/admin/role-requests",require("./routes/roleRequests.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/auth",require("./routes/auth.routes"));
app.use("/api/checkout", require("./routes/checkout.routes"));
app.use("/api/shops", require("./routes/shops.routes"));
app.use("/api/vendor", require("./routes/vendor.routes"));


// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

app.get("/", (req, res) => {
  res.send("BuddyCart API is running");
});
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});
const mongoose = require('mongoose');
 app.get('/dbz', (req, res) => {
   // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
   res.json({ readyState: mongoose.connection.readyState });
 });

  app.get('/envz', (req, res) => {
   res.json({
     has_MONGO_URI: !!process.env.MONGO_URI,
     has_MONGODB_URI: !!process.env.MONGODB_URI
   });
 });
 app.get('/dbz', (req, res) => {
   const mongoose = require('mongoose');
   res.json({ readyState: mongoose.connection.readyState });
 });

 app.get('/mongotest', (req, res) => {
  const uri = process.env.MONGO_URI || '';
   const masked = uri.replace(/(\/\/[^:]+:)[^@]+@/, '$1****@');
  const m = uri.match(/^mongodb\+srv:\/\/[^@]+@([^/]+)\/?([^?]*)/);
  res.json({
    hasEnv: !!uri,
    sample: masked,              
    host: m ? m[1] : null,       
    dbName: m ? (m[2] || '(none)') : null 
  });
});
// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);






module.exports = app;
